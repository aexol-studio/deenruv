import { ZeusScalars } from "../zeus/index";

export const scalars = ZeusScalars({
  DateTime: {
    decode: (e: unknown) => new Date(e as string).toISOString(),
    encode: (e: unknown) => (e as Date).toISOString(),
  },
  JSON: {
    decode: (e: unknown) => JSON.parse(e as string),
    encode: (e: unknown) => JSON.stringify(e),
  },
});
