import { Order, RequestContext } from "@deenruv/core";
import { ALLOWED_MARKETS } from "./constants.js";
export type AllowedChannels = (typeof ALLOWED_MARKETS)[number];

export type ENVS = {
  PRZELEWY24_POS_ID: string;
  PRZELEWY24_CRC: string;
  PRZELEWY24_CLIENT_SECRET: string;
};

export type Przelewy24PluginConfiguration = {
  [market in AllowedChannels]: ENVS;
} & {
  apiUrl: string;
  returnUrl: (
    ctx: RequestContext,
    payload: { order: Order },
  ) => Promise<string> | string;
  przelewy24Host: string;
};

export interface Przelewy24NotificationBody {
  merchantId: number;
  posId: number;
  sessionId: string;
  amount: number;
  originAmount: string;
  currency: string;
  orderId: number | string;
  methodId?: number;
  statement: string;
  sign: string;
}
