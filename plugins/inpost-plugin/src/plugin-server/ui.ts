import { AdminUiExtension } from "@deenruv/ui-devkit/compiler/index.js";
import path from "path";
export const ui: AdminUiExtension = {
  id: "InPost-extension",
  extensionPath: path.join(__dirname, "ui"),
  providers: ["providers.ts"],
  globalStyles: [path.join(__dirname, "ui/styles/overwrite.css")],
  translations: {},
};
