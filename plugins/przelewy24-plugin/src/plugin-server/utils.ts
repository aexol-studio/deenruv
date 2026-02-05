import { Order } from "@deenruv/core";
import { P24Client } from "@aexol/przelewy24-sdk";
import {
  AllowedChannels,
  ENVS,
  Przelewy24PluginConfiguration,
} from "./types.js";
import {
  ALLOWED_MARKETS,
  BLIK_METHOD_NAME,
  PRZELEWY24_METHOD_NAME,
} from "./constants.js";

export const getSessionId = (order: Order) => {
  const przelewy24payments = order.payments.filter(
    (payment) =>
      payment.method === PRZELEWY24_METHOD_NAME ||
      payment.method === BLIK_METHOD_NAME,
  );
  const sessionId = !przelewy24payments.length
    ? `${order.code}`
    : `${order.code}-${przelewy24payments.length + 1}`;
  return sessionId;
};

export const getPrzelewy24SecretsByChannel = (
  options: Przelewy24PluginConfiguration,
  channel: string,
) => {
  const _ch = channel.toLowerCase();
  if (!ALLOWED_MARKETS.includes(_ch as AllowedChannels)) {
    throw new Error(`Market ${_ch} is not supported`);
  }
  return options[channel as AllowedChannels];
};

export const getP24Client = (przelewy24Secrets: ENVS): P24Client => {
  const baseURL = process.env.PRZELEWY24_URL || "https://sandbox.przelewy24.pl";
  const isSandbox = baseURL.includes("sandbox");

  return new P24Client({
    merchantId: Number(przelewy24Secrets.PRZELEWY24_POS_ID),
    posId: Number(przelewy24Secrets.PRZELEWY24_POS_ID),
    crc: przelewy24Secrets.PRZELEWY24_CRC,
    apiKey: przelewy24Secrets.PRZELEWY24_CLIENT_SECRET,
    sandbox: isSandbox,
  });
};
