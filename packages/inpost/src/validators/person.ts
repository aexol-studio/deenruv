import { Person } from '../models/index.js';
import { isAddress } from './address.js';
import { isNumber } from './number.js';
import { isObject } from './object.js';
import { isOptional } from './optional.js';
import { isString } from './string.js';

const validatePerson = (v: Person) =>
  isOptional(isNumber)(v.id) &&
  isOptional(isString)(v.email) &&
  isOptional(isString)(v.first_name) &&
  isOptional(isString)(v.last_name) &&
  isOptional(isString)(v.phone) &&
  isOptional(isString)(v.company_name) &&
  isOptional(isAddress)(v.address);

export const isPerson = (v: unknown): v is Person =>
  isObject(v) && validatePerson(v as Person);
