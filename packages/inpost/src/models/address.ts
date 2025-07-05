import { CountryCode } from './country_code.js';
export type Address = {
  id?: number;
  city: string;
  country_code: CountryCode;
  post_code: string;
} & (
  | {
      line1: string;
      line2?: string;
    }
  | {
      street: string;
      building_number: string;
    }
);
