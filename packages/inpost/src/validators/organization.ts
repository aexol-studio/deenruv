import { isNumber } from './number.js';
import { isObject } from './object.js';
import { isOptional } from './optional.js';
import { isArray } from './array.js';
import { isString } from './string.js';
import { isCarrier } from './carrier.js';
import { isService } from './services.js';
import { isPerson } from './person.js';
import { isAddress } from './address.js';
import { Organization } from '../models/index.js';

const validateOrganization = (v: Organization) =>
  isNumber(v.id) &&
  isAddress(v.address) &&
  isOptional(isString)(v.bank_account_number) &&
  isArray(isCarrier)(v.carriers) &&
  isOptional(isPerson)(v.contact_person) &&
  isString(v.created_at) &&
  isString(v.href) &&
  isNumber(v.id) &&
  isOptional(isAddress)(v.invoice_address) &&
  isString(v.name) &&
  isNumber(v.owner_id) &&
  isArray(isService)(v.services) &&
  isString(v.tax_id) &&
  isString(v.updated_at);

export const isOrganization = (v: unknown): v is Organization =>
  isObject(v) && validateOrganization(v as Organization);
