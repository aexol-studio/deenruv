import { CountryCode } from '../models/index.js';
// Small trick that will cause compile time error if any enum is missing
const mustBeCountryCode = (v: CountryCode) => {
  switch (v) {
    case CountryCode.pl:
    case CountryCode.en:
      return true;
  }
};
export const isCountryCode = (v: unknown): v is CountryCode =>
  !!mustBeCountryCode(v as CountryCode);
