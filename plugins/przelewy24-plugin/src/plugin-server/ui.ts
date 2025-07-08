import { AdminUiExtension } from "@deenruv/ui-devkit/compiler/index.js";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = fileURLToPath(new URL(".", import.meta.url));
export const ui: AdminUiExtension = {
  id: "przelewy24-ui",
  extensionPath: path.join(__dirname, "ui"),
  routes: [],
  providers: ["providers.ts"],
  translations: {},
};
