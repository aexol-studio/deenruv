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

export interface Przelewy24SecretsByMarket {
  PRZELEWY24_POS_ID: string;
  PRZELEWY24_CRC: string;
  PRZELEWY24_CLIENT_SECRET: string;
}

export type AllowedChannels = "pl-channel";

type ENVS = {
  PRZELEWY24_POS_ID: string;
  PRZELEWY24_CRC: string;
  PRZELEWY24_CLIENT_SECRET: string;
};

export type Przelewy24PluginConfiguration = {
  [key in AllowedChannels]?: ENVS;
};
