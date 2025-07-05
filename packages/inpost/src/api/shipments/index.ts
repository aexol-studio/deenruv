import {
  endpoint,
  is2xx,
  values,
  FetchFn,
  get,
  jsonResponse,
  jsonRequest,
  post,
} from '../../middleware/index.js';
import { isShipment } from '../../validators/is_shipment.js';

export class Shipment {
  constructor(
    private apiBase: URL,
    private fetchFn: FetchFn,
  ) {}

  async fetch() {
    const res = await jsonResponse(isShipment)(get(is2xx(this.fetchFn)))(
      this.apiBase,
    );
    return res.jsonResponse;
  }

  async label(
    args: {
      format?: 'Pdf' | 'Zpl' | 'Epl';
      type?: 'normal' | 'A6' | 'dpi300';
    } = {},
  ) {
    const res = await endpoint('label')(values(args)(get(is2xx(this.fetchFn))))(
      this.apiBase,
    );
    return res.body;
  }

  async buy(body: { offer_id: number }) {
    const res = await jsonResponse(isShipment)(
      endpoint('buy')(jsonRequest(body)(post(is2xx(this.fetchFn)))),
    )(this.apiBase);
    return res.jsonResponse;
  }
}
