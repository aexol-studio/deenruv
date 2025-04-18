import { FromSelector, GraphQLTypes, ZeusScalars } from "./index.js";

export const scalars = ZeusScalars({
    ID: { decode: (e) => e as string },
  Money: {
    decode: (e) => e as number,
  },
  DateTime: {
    decode: (e: unknown) => new Date(e as string).toISOString(),
  },
  JSON: {
    encode: (e: unknown) => {
      // hax który fixuje buga ze złym parsowaniem obiektu do query (productUpdate -> customFields)
      // bez tego jest przesyłany jako zwykły stringify, czyli klucze dostają "" i request sie crashuje

      return JSON.stringify(e).replace(/"(\w+)":/g, '$1:');
    },
    decode: (e: unknown) => {
      try {
        return JSON.parse(e as string);
      } catch {
        return e;
      }
    },
  },
});
export type ScalarsType = typeof scalars;

export type FromSelectorWithScalars<SELECTOR, NAME extends keyof GraphQLTypes> = FromSelector<
  SELECTOR,
  NAME,
  ScalarsType
>;
