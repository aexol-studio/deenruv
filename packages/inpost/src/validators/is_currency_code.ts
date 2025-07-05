import { CurrencyCode } from '../models/index.js';
// Small trick that will cause compile time error if any enum is missing
const mustBeCurrencyCode = (v: CurrencyCode) => {
  switch (v) {
    case CurrencyCode.PLN:
      return true;
  }
};
export const isCurrencyCode = (v: unknown): v is CurrencyCode =>
  !!mustBeCurrencyCode(v as CurrencyCode);
