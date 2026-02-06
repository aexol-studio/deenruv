import { source } from "../../lib/source";

export const revalidate = false;

export async function GET() {
  const baseUrl = "https://docs.deenruv.io";

  const lines = [
    "# Deenruv Documentation",
    "",
    "> A flexible, headless e-commerce framework built on NestJS and GraphQL",
    "",
    `## Full docs: ${baseUrl}/llms-full.txt`,
    "",
    "## Pages:",
    "",
    ...source
      .getPages()
      .map((page) => `- ${page.data.title}: ${baseUrl}${page.url}.mdx`),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
