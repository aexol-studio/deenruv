import { Money } from '../models/index.js';
import { isObject } from './object.js';
import { isCurrencyCode } from './is_currency_code.js';

const mustBeMoney = (v: Money) =>
  typeof v.amount === 'number' && isCurrencyCode(v.currency);
export const isMoney = (v: unknown): v is Money =>
  isObject(v) && mustBeMoney(v as Money);
