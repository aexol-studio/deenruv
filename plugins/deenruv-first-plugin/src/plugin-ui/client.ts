import { Chain } from './zeus';

export const client = Chain('http://localhost:3000/admin-api', { credentials: 'include' });
