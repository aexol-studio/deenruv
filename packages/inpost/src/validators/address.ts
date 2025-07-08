import { Address } from "../models/index.js";
import { isCountryCode } from "./is_country_code.js";
import { isNumber } from "./number.js";
import { isObject } from "./object.js";
import { isOptional } from "./optional.js";
import { isString } from "./string.js";

const validateAddress = (v: Address) =>
  isNumber(v.id) &&
  isOptional(isString)((v as { building_number: string }).building_number) &&
  isOptional(isString)((v as { street: string }).street) &&
  isOptional(isString)(v.city) &&
  isOptional(isString)((v as { line1: string }).line1) &&
  isOptional(isString)((v as { line2: string }).line2) &&
  isString(v.post_code) &&
  isCountryCode(v.country_code);

export const isAddress = (v: unknown): v is Address =>
  isObject(v) && validateAddress(v as Address);
