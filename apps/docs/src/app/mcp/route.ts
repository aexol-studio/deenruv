import { source } from "../../lib/source";
import { getLLMText } from "../../lib/get-llm-text";
import { toAbsoluteUrl } from "../../lib/site";

// ---------------------------------------------------------------------------
// MCP Docs Server – Read-only Streamable HTTP transport (MCP spec 2025-06-18)
// ---------------------------------------------------------------------------

const PROTOCOL_VERSION = "2025-06-18";
const SERVER_NAME = "deenruv-docs";
const SERVER_VERSION = "1.0.0";

// ---------------------------------------------------------------------------
// In-memory per-IP sliding-window rate limiter
// ---------------------------------------------------------------------------

interface RateBucket {
  tokens: number;
  lastRefill: number;
}

const RATE_LIMIT = 60; // requests per window
const RATE_WINDOW_MS = 60_000; // 1 minute
const rateBuckets = new Map<string, RateBucket>();

// Periodic cleanup to prevent memory leaks (every 5 minutes)
let lastCleanup = Date.now();
const CLEANUP_INTERVAL_MS = 300_000;

function cleanupBuckets(): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [ip, bucket] of rateBuckets) {
    if (now - bucket.lastRefill > RATE_WINDOW_MS * 2) {
      rateBuckets.delete(ip);
    }
  }
}

function isRateLimited(ip: string): boolean {
  cleanupBuckets();
  const now = Date.now();
  let bucket = rateBuckets.get(ip);

  if (!bucket) {
    bucket = { tokens: RATE_LIMIT - 1, lastRefill: now };
    rateBuckets.set(ip, bucket);
    return false;
  }

  // Refill tokens based on elapsed time
  const elapsed = now - bucket.lastRefill;
  const refill = Math.floor((elapsed / RATE_WINDOW_MS) * RATE_LIMIT);
  if (refill > 0) {
    bucket.tokens = Math.min(RATE_LIMIT, bucket.tokens + refill);
    bucket.lastRefill = now;
  }

  if (bucket.tokens <= 0) return true;
  bucket.tokens -= 1;
  return false;
}

// ---------------------------------------------------------------------------
// CORS helpers
// ---------------------------------------------------------------------------

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, MCP-Protocol-Version, Accept",
    "Access-Control-Expose-Headers": "MCP-Protocol-Version",
    "MCP-Protocol-Version": PROTOCOL_VERSION,
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

// ---------------------------------------------------------------------------
// JSON-RPC helpers
// ---------------------------------------------------------------------------

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

function jsonRpcResult(
  id: string | number | null,
  result: unknown,
): JsonRpcResponse {
  return { jsonrpc: "2.0", id, result };
}

function jsonRpcError(
  id: string | number | null,
  code: number,
  message: string,
  data?: unknown,
): JsonRpcResponse {
  return {
    jsonrpc: "2.0",
    id,
    error: { code, message, ...(data != null ? { data } : {}) },
  };
}

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

interface ToolDef {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

const TOOLS: ToolDef[] = [
  {
    name: "docs_list_pages",
    description:
      "List all documentation pages with their titles, descriptions, and URLs. Use to discover available documentation.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "docs_get_page",
    description:
      'Get the full content of a documentation page by its slug path. The slug is the URL path segment after /docs/ (e.g. "guides/developer-guide/plugins").',
    inputSchema: {
      type: "object",
      properties: {
        slug: {
          type: "string",
          description:
            'Page slug path (e.g. "guides/developer-guide/plugins"). Use docs_list_pages to find available slugs.',
        },
      },
      required: ["slug"],
    },
  },
  {
    name: "docs_search",
    description:
      "Search documentation pages by matching a query against page titles and descriptions. Returns matching pages with their slugs and URLs.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description:
            "Search query to match against page titles and descriptions.",
        },
        limit: {
          type: "number",
          description:
            "Maximum number of results to return (default: 10, max: 50).",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "docs_get_llms_txt",
    description:
      "Get the llms.txt index — a summary list of all documentation pages with links to their full content.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "docs_get_llms_full",
    description:
      "Get the full text of ALL documentation pages concatenated together. Warning: this returns a large amount of text.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "docs_list_sections",
    description:
      "List the top-level documentation sections/categories and the pages within each section.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// ---------------------------------------------------------------------------
// Tool implementations
// ---------------------------------------------------------------------------

interface ToolResult {
  content: { type: "text"; text: string }[];
  isError?: boolean;
}

function toolError(message: string): ToolResult {
  return { content: [{ type: "text", text: message }], isError: true };
}

async function callTool(
  name: string,
  args: Record<string, unknown>,
): Promise<ToolResult> {
  switch (name) {
    case "docs_list_pages": {
      const pages = source.getPages().map((page) => ({
        title: page.data.title,
        description: page.data.description ?? null,
        slug: page.slugs.join("/"),
        url: toAbsoluteUrl(page.url),
      }));
      return {
        content: [{ type: "text", text: JSON.stringify(pages, null, 2) }],
      };
    }

    case "docs_get_page": {
      const slug = args.slug;
      if (typeof slug !== "string" || slug.trim() === "") {
        return toolError(
          'Parameter "slug" is required and must be a non-empty string.',
        );
      }
      const slugParts = slug.split("/").filter(Boolean);
      const page = source.getPage(slugParts);
      if (!page) {
        return toolError(
          `Page not found for slug: "${slug}". Use docs_list_pages to find available pages.`,
        );
      }
      const text = await getLLMText(page);
      return { content: [{ type: "text", text }] };
    }

    case "docs_search": {
      const query = args.query;
      if (typeof query !== "string" || query.trim() === "") {
        return toolError(
          'Parameter "query" is required and must be a non-empty string.',
        );
      }
      const maxResults = Math.min(
        Math.max(1, typeof args.limit === "number" ? args.limit : 10),
        50,
      );
      const lowerQuery = query.toLowerCase();
      const tokens = lowerQuery.split(/\s+/).filter(Boolean);

      const results = source
        .getPages()
        .map((page) => {
          const title = (page.data.title ?? "").toLowerCase();
          const desc = (page.data.description ?? "").toLowerCase();
          const slugStr = page.slugs.join("/").toLowerCase();
          const combined = `${title} ${desc} ${slugStr}`;

          // Simple relevance scoring: count matching tokens
          let score = 0;
          for (const token of tokens) {
            if (title.includes(token)) score += 3;
            if (desc.includes(token)) score += 2;
            if (slugStr.includes(token)) score += 1;
          }
          // Bonus for exact phrase match
          if (combined.includes(lowerQuery)) score += 5;

          return { page, score };
        })
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, maxResults)
        .map((r) => ({
          title: r.page.data.title,
          description: r.page.data.description ?? null,
          slug: r.page.slugs.join("/"),
          url: toAbsoluteUrl(r.page.url),
          score: r.score,
        }));

      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
      };
    }

    case "docs_get_llms_txt": {
      const lines = [
        "# Deenruv Documentation",
        "",
        "> A flexible, headless e-commerce framework built on NestJS and GraphQL",
        "",
        `## Full docs: ${toAbsoluteUrl("/llms-full.txt")}`,
        "",
        "## Pages:",
        "",
        ...source
          .getPages()
          .map(
            (page) =>
              `- ${page.data.title}: ${toAbsoluteUrl(`${page.url}.mdx`)}`,
          ),
      ];
      return { content: [{ type: "text", text: lines.join("\n") }] };
    }

    case "docs_get_llms_full": {
      const scan = source.getPages().map(getLLMText);
      const scanned = await Promise.all(scan);
      return { content: [{ type: "text", text: scanned.join("\n\n") }] };
    }

    case "docs_list_sections": {
      const pages = source.getPages();
      const sections = new Map<
        string,
        { title: string; slug: string; url: string }[]
      >();

      for (const page of pages) {
        const sectionSlug = page.slugs[0] ?? "_root";
        if (!sections.has(sectionSlug)) {
          sections.set(sectionSlug, []);
        }
        sections.get(sectionSlug)!.push({
          title: page.data.title,
          slug: page.slugs.join("/"),
          url: toAbsoluteUrl(page.url),
        });
      }

      const result = Object.fromEntries(sections);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    }

    default:
      return toolError(`Unknown tool: "${name}"`);
  }
}

// ---------------------------------------------------------------------------
// MCP protocol handlers
// ---------------------------------------------------------------------------

async function handleRequest(
  req: JsonRpcRequest,
): Promise<JsonRpcResponse | null> {
  const { id, method, params } = req;

  switch (method) {
    // ---- Lifecycle ----
    case "initialize": {
      return jsonRpcResult(id ?? null, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {
          tools: { listChanged: false },
        },
        serverInfo: {
          name: SERVER_NAME,
          version: SERVER_VERSION,
        },
      });
    }

    case "notifications/initialized": {
      // Notification — no response
      return null;
    }

    case "ping": {
      return jsonRpcResult(id ?? null, {});
    }

    // ---- Tools ----
    case "tools/list": {
      return jsonRpcResult(id ?? null, {
        tools: TOOLS,
      });
    }

    case "tools/call": {
      const toolName = (params as Record<string, unknown> | undefined)?.name;
      const toolArgs =
        ((params as Record<string, unknown> | undefined)?.arguments as Record<
          string,
          unknown
        >) ?? {};

      if (typeof toolName !== "string") {
        return jsonRpcError(
          id ?? null,
          -32602,
          'Invalid params: "name" is required for tools/call',
        );
      }

      const toolDef = TOOLS.find((t) => t.name === toolName);
      if (!toolDef) {
        return jsonRpcError(id ?? null, -32602, `Unknown tool: "${toolName}"`);
      }

      const result = await callTool(toolName, toolArgs);
      return jsonRpcResult(id ?? null, result);
    }

    // ---- Unsupported ----
    default: {
      return jsonRpcError(id ?? null, -32601, `Method not found: "${method}"`);
    }
  }
}

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

function jsonResponse(
  body: JsonRpcResponse | JsonRpcResponse[],
  status: number,
  origin: string | null,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}

function sseResponse(
  body: JsonRpcResponse | JsonRpcResponse[],
  origin: string | null,
): Response {
  const items = Array.isArray(body) ? body : [body];
  const chunks = items
    .map((item) => `event: message\ndata: ${JSON.stringify(item)}\n\n`)
    .join("");

  return new Response(chunks, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      ...corsHeaders(origin),
    },
  });
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "127.0.0.1";
}

// ---------------------------------------------------------------------------
// Route handlers
// ---------------------------------------------------------------------------

export async function OPTIONS(req: Request): Promise<Response> {
  const origin = req.headers.get("origin");
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

export async function POST(req: Request): Promise<Response> {
  const origin = req.headers.get("origin");

  // Rate limiting
  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return jsonResponse(
      jsonRpcError(null, -32000, "Rate limit exceeded. Try again later."),
      429,
      origin,
    );
  }

  // Protocol version validation
  const protocolVersion = req.headers.get("mcp-protocol-version");
  if (protocolVersion && protocolVersion !== PROTOCOL_VERSION) {
    return jsonResponse(
      jsonRpcError(
        null,
        -32000,
        `Unsupported protocol version: "${protocolVersion}". Supported: "${PROTOCOL_VERSION}".`,
      ),
      400,
      origin,
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse(
      jsonRpcError(null, -32700, "Parse error: invalid JSON"),
      400,
      origin,
    );
  }

  // Determine response format
  const acceptHeader = req.headers.get("accept") ?? "";
  const wantsSSE = acceptHeader.includes("text/event-stream");

  // Handle batch requests
  if (Array.isArray(body)) {
    const responses: JsonRpcResponse[] = [];
    for (const item of body) {
      if (
        typeof item !== "object" ||
        item === null ||
        (item as JsonRpcRequest).jsonrpc !== "2.0"
      ) {
        responses.push(
          jsonRpcError(
            null,
            -32600,
            "Invalid Request: not a valid JSON-RPC 2.0 object",
          ),
        );
        continue;
      }
      const result = await handleRequest(item as JsonRpcRequest);
      if (result) responses.push(result);
    }
    if (responses.length === 0) {
      return new Response(null, {
        status: 202,
        headers: corsHeaders(origin),
      });
    }
    return wantsSSE
      ? sseResponse(responses, origin)
      : jsonResponse(responses, 200, origin);
  }

  // Single request
  if (
    typeof body !== "object" ||
    body === null ||
    (body as JsonRpcRequest).jsonrpc !== "2.0"
  ) {
    return jsonResponse(
      jsonRpcError(
        null,
        -32600,
        "Invalid Request: not a valid JSON-RPC 2.0 object",
      ),
      400,
      origin,
    );
  }

  const result = await handleRequest(body as JsonRpcRequest);

  // Notifications have no response
  if (!result) {
    return new Response(null, {
      status: 202,
      headers: corsHeaders(origin),
    });
  }

  return wantsSSE
    ? sseResponse(result, origin)
    : jsonResponse(result, 200, origin);
}

export async function GET(req: Request): Promise<Response> {
  const origin = req.headers.get("origin");

  const ip = getClientIp(req);
  if (isRateLimited(ip)) {
    return new Response("Rate limit exceeded", {
      status: 429,
      headers: corsHeaders(origin),
    });
  }

  const acceptHeader = req.headers.get("accept") ?? "";

  // If client requests SSE, open an SSE stream with a welcome event
  if (acceptHeader.includes("text/event-stream")) {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Send an initial endpoint event per Streamable HTTP spec
        const welcomeEvent = {
          jsonrpc: "2.0" as const,
          method: "notifications/initialized",
          params: {
            serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
            protocolVersion: PROTOCOL_VERSION,
          },
        };
        controller.enqueue(
          encoder.encode(
            `event: message\ndata: ${JSON.stringify(welcomeEvent)}\n\n`,
          ),
        );
        // Keep stream open — client can POST requests to receive responses
        // Close after a reasonable timeout to prevent resource leaks
        setTimeout(() => {
          try {
            controller.close();
          } catch {
            // Stream already closed by client
          }
        }, 300_000); // 5 minutes
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        ...corsHeaders(origin),
      },
    });
  }

  // Non-SSE GET — return server info as JSON
  return new Response(
    JSON.stringify({
      name: SERVER_NAME,
      version: SERVER_VERSION,
      protocolVersion: PROTOCOL_VERSION,
      description:
        "Deenruv documentation MCP server. Send JSON-RPC requests via POST.",
      tools: TOOLS.map((t) => t.name),
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(origin),
      },
    },
  );
}
