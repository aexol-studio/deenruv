import { FetchFn, endpoint, get, jsonResponse, is2xx } from '../middleware/index.js';
import { Organization } from '../models/index.js';
import { isArray } from '../validators/array.js';
import { isNumber } from '../validators/number.js';
import { isObject } from '../validators/object.js';
import { isOrganization } from '../validators/organization.js';
import { isString } from '../validators/string.js';
import { Organization as OrganizationAPI } from './organizations/index.js';

export interface OrganizationListResponse {
  href: string;
  count: number;
  page: number;
  per_page: number;
  items: Organization[];
}

const mustOrganizationList = (v: OrganizationListResponse) =>
  isString(v.href) &&
  isNumber(v.count) &&
  isNumber(v.page) &&
  isNumber(v.per_page) &&
  isArray(isOrganization)(v.items);

export const isOrganizationList = (v: unknown): v is OrganizationListResponse =>
  isObject(v) && mustOrganizationList(v as OrganizationListResponse);

export class Organizations {
  constructor(
    private apiBase: URL,
    private fetch: FetchFn,
  ) {}

  async list() {
    const res = await jsonResponse(isOrganizationList)(get(is2xx(this.fetch)))(
      this.apiBase,
    );
    return res.jsonResponse;
  }

  get(id: number) {
    return new OrganizationAPI(this.apiBase, endpoint(`${id}`)(this.fetch));
  }
}
