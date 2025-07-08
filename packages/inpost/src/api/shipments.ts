import {
  FetchFn,
  endpoint,
  get,
  jsonRequest,
  jsonResponse,
  post,
  is2xx,
} from '../middleware/index.js';
import { Shipment } from '../models/index.js';
import { isArray } from '../validators/array.js';
import { isNumber } from '../validators/number.js';
import { isObject } from '../validators/object.js';
import { isShipment } from '../validators/is_shipment.js';
import { isString } from '../validators/string.js';
import { Shipment as ShipmentAPI } from './shipments/index.js';

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

export class Shipments {
  constructor(
    private apiBase: URL,
    private fetchFn: FetchFn,
  ) {}

  async list() {
    const res = await jsonResponse(isShipmentList)(get(is2xx(this.fetchFn)))(
      this.apiBase,
    );
    return res.jsonResponse;
  }

  async create(data: Shipment): Promise<Shipment> {
    const res = await jsonResponse(isShipment)(
      post(jsonRequest(data)(is2xx(this.fetchFn))),
    )(this.apiBase);
    return res.jsonResponse;
  }

  get(id: number) {
    return new ShipmentAPI(this.apiBase, endpoint(`${id}`)(this.fetchFn));
  }
}
