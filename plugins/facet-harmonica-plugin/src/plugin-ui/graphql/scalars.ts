import { ZeusScalars } from "../zeus";

export const scalars = ZeusScalars({
  ID: {
    decode: (e) => e as string,
  },
  DateTime: {
    decode: (e: unknown) => new Date(e as string).toISOString(),
    encode: (e: unknown) => (e as Date).toISOString(),
  },
  JSON: {
    decode: (e: unknown) => JSON.parse(e as string),
    encode: (e: unknown) => JSON.stringify(e),
  },
  Money: {
    decode: (e) => e as number,
  },
});
