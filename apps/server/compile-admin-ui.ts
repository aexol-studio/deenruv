import { compileUiExtensions } from "@deenruv/ui-devkit/compiler/compile.js";
import path from "path";

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
