import { AdminUiExtension } from "@deenruv/ui-devkit/compiler/index.js";
import path from "path";

export const ui: AdminUiExtension = {
  id: "merchant-platform-integration",
  extensionPath: path.join(__dirname, "ui"),
  providers: ["providers.ts"],
  globalStyles: [path.join(__dirname, "ui/styles/tailwind.css")],
  routes: [{ route: "merchant-platform-integration", filePath: "routes.ts" }],
  translations: {},
};
