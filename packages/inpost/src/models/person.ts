import { Address } from './address.js';

export interface Person {
  id?: number;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
  address?: Address;
}
