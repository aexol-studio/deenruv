import {
  FetchFn,
  endpoint,
  get,
  jsonResponse,
  is2xx,
} from "../../middleware/index.js";
import { Shipment } from "../../models/index.js";
import { isArray } from "../../validators/array.js";
import { isNumber } from "../../validators/number.js";
import { isObject } from "../../validators/object.js";
import { isOrganization } from "../../validators/organization.js";
import { isShipment } from "../../validators/is_shipment.js";
import { isString } from "../../validators/string.js";
import { Shipments } from "./shipments.js";

export interface ShipmentListResponse {
  href: string;
  count: number;
  page: number;
  per_page: number;
  items: Shipment[];
}

const mustShipmentList = (v: ShipmentListResponse) =>
  isString(v.href) &&
  isNumber(v.count) &&
  isNumber(v.page) &&
  isNumber(v.per_page) &&
  isArray(isShipment)(v.items);

export const isShipmentList = (v: unknown): v is ShipmentListResponse =>
  isObject(v) && mustShipmentList(v as ShipmentListResponse);

export class Organization {
  constructor(
    private apiBase: URL,
    private fetchFn: FetchFn,
  ) {}

  async fetch() {
    const res = await jsonResponse(isOrganization)(get(is2xx(this.fetchFn)))(
      this.apiBase,
    );
    return res.jsonResponse;
  }

  shipments() {
    return new Shipments(this.apiBase, endpoint("shipments")(this.fetchFn));
  }
}
