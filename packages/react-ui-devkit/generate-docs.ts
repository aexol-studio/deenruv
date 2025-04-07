import fs from "fs/promises";
import path from "path";
import { parse } from "comment-parser";

const COMPONENTS_DIR = path.join(__dirname, "./src/universal_components");
const DOCS_DIR = path.join(__dirname, "./docs/universal_components");

async function parseComponentFile(filePath: string) {
  const content = await fs.readFile(filePath, "utf-8");
  const parsedComments = parse(content);
  if (!parsedComments.length) return;

  const componentName =
    path.basename(path.dirname(filePath)) === "universal_components"
      ? path.basename(filePath, path.extname(filePath))
      : path.basename(path.dirname(filePath));

  const comment = parsedComments[0];
  const description = comment.description.trim() || "No description provided.";

  const props = comment.tags
    .filter((tag) => tag.tag === "param")
    .map((tag) => ({
      name: tag.name,
      type: tag.type || "any",
      description: tag.description || "No description provided.",
    }));

  const customTypeRegex = /export (interface|type)\s+(\w+)\s*=*\s*{[\s\S]+?}/g;
  const customTypes = Array.from(content.matchAll(customTypeRegex)).map(
    (match) => match[0],
  );

  const markdown = `# ${componentName}

${description}

## Props

${
  props.length
    ? props
        .map(
          (prop) =>
            `### ${prop.name}

- **Type:** \`${prop.type}\`

${prop.description}`,
        )
        .join("\n\n")
    : "No props documented."
}

${
  customTypes.length
    ? `## Custom Types

${customTypes.map((typeDef) => `\`\`\`typescript\n${typeDef}\n\`\`\``).join("\n\n")}`
    : ""
}

## Example Usage

\`\`\`tsx
<${componentName}
${props
  .map((prop) => {
    const isFunction = prop.type.includes("=>");
    if (isFunction) {
      const functionBody = prop.type.replace(/=>.*/, "=> {}");
      return `  ${prop.name}={${functionBody}}`;
    }
    if (prop.type.includes("{") || prop.type.includes("[")) {
      return `  ${prop.name}={${prop.type}}`;
    }
    if (prop.type.includes("|")) {
      return `  ${prop.name}={${prop.type}}`;
    }
    return `  ${prop.name}={${prop.type === "any" ? "" : "/* value */"}}`;
  })
  .join("\n")}
/>
\`\`\`
`;

  await fs.mkdir(DOCS_DIR, { recursive: true });
  const docsFilePath = path.join(DOCS_DIR, `${componentName}.md`);
  await fs.writeFile(docsFilePath, markdown);

  console.log(`✅ Documentation successfully generated for ${componentName}`);
}

async function generateDocs() {
  const items = await fs.readdir(COMPONENTS_DIR);

  await Promise.all(
    items.map(async (item) => {
      const itemPath = path.join(COMPONENTS_DIR, item);
      const stats = await fs.stat(itemPath);

      if (stats.isDirectory()) {
        const innerFiles = await fs.readdir(itemPath);
        await Promise.all(
          innerFiles
            .filter(
              (innerFile) =>
                innerFile.endsWith(".tsx") || innerFile.endsWith(".ts"),
            )
            .map((innerFile) =>
              parseComponentFile(path.join(itemPath, innerFile)),
            ),
        );
      } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
        await parseComponentFile(itemPath);
      }
    }),
  );
}

generateDocs().catch((err) => console.error("🚨 Error generating docs:", err));
