import { FromSelector, GraphQLTypes, ZeusScalars } from '@deenruv/admin-types';

export const scalars = ZeusScalars({
  Money: {
    decode: (e) => e as number,
  },
  DateTime: {
    decode: (e: unknown) => new Date(e as string).toISOString(),
  },
  JSON: {
    encode: (e: unknown) => {
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
