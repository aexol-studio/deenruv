import { compileUiExtensions } from "@deenruv/ui-devkit/compiler/compile.js";
import path from "path";
import { ui as InpostUIPlugin } from "@deenruv/inpost-plugin/plugin-server/ui";

export function customAdminUi(options: {
  recompile: boolean;
  devMode: boolean;
}) {
  // delete process.env.NODE_OPTIONS;
  const compiledAppPath = path.join(__dirname, "./admin-ui");
  if (options.recompile) {
    return compileUiExtensions({
      command: "npm",
      outputPath: compiledAppPath,
      extensions: [],
      devMode: options.devMode,
    });
  } else return { path: path.join(compiledAppPath, "dist") };
}
