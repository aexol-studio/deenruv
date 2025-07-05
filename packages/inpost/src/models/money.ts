import { CurrencyCode } from './currency_code.js';
export interface Money {
  amount: number;
  currency: CurrencyCode;
}
