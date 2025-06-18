// A small workaround until ts-node supports esm properly
// Check out https://github.com/TypeStrong/ts-node/issues/2100
// for more details
import { pathToFileURL } from "node:url";
import { register } from "node:module";

try {
  await import("ts-node/esm");
  register("ts-node/esm", pathToFileURL("./"));
} catch {}
