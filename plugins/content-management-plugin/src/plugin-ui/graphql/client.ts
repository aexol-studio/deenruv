import { ADMIN_API_URL } from '@deenruv/react-ui-devkit';
import { Chain, ZeusScalars } from '../zeus';

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

export const client = Chain(ADMIN_API_URL, { credentials: 'include' });
