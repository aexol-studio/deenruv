import { ADMIN_API_URL } from '@deenruv/react-ui-devkit';
import { FromSelector, GraphQLTypes, Chain, ZeusScalars, LanguageCode } from '../zeus';

export const scalars = ZeusScalars({
    Money: {
        decode: e => e as number,
    },
    DateTime: {
        decode: (e: unknown) => new Date(e as string).toISOString(),
    },
    JSON: {
        decode: e => e as Record<string, unknown>,
    },
});

export const createClient = (lang: LanguageCode) =>
    Chain(`http://localhost:3000${ADMIN_API_URL}/?languageCode=${lang}`, {
        credentials: 'include',
    });

export type ScalarsType = typeof scalars;

export type FromSelectorWithScalars<SELECTOR, NAME extends keyof GraphQLTypes> = FromSelector<
    SELECTOR,
    NAME,
    ScalarsType
>;
