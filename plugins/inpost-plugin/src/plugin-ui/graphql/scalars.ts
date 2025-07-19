import { FromSelector, GraphQLTypes, ZeusScalars } from "../zeus";

export const scalars = ZeusScalars({
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
export type ScalarsType = typeof scalars;

export type FromSelectorWithScalars<
  SELECTOR,
  NAME extends keyof GraphQLTypes,
> = FromSelector<SELECTOR, NAME, ScalarsType>;
