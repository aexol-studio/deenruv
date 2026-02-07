import { source } from "../../lib/source";
import { toAbsoluteUrl } from "../../lib/site";

export const revalidate = false;

export async function GET() {
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
        (page) => `- ${page.data.title}: ${toAbsoluteUrl(`${page.url}.mdx`)}`,
      ),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
