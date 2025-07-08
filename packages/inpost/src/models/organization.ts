import { Address } from './address.js';
import { Carrier } from './carrier.js';
import { Person } from './person.js';
import { Service } from './service.js';
export interface Organization {
  address: Address;
  bank_account_number?: string;
  carriers: Carrier[];
  contact_person?: Person;
  created_at: string;
  href: string;
  id: number;
  invoice_address?: Address;
  name: string;
  owner_id: number;
  services: Service[];
  tax_id: string;
  updated_at: string;
}
