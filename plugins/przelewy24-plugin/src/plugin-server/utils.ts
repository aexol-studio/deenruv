import axios from "axios";
import * as crypto from "crypto";
import { Order } from "@deenruv/core";
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

export const generateSHA384Hash = (sum: string) => {
  const hash = crypto.createHash("sha384");
  const data = hash.update(sum, "utf-8");
  const gen_hash = data.digest("hex");
  return gen_hash;
};

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

export const getAxios = (przelewy24Secrets: ENVS) => {
  const basicAuth =
    "Basic " +
    Buffer.from(
      `${przelewy24Secrets.PRZELEWY24_POS_ID}:${przelewy24Secrets.PRZELEWY24_CLIENT_SECRET}`,
      "utf-8",
    ).toString("base64");

  const baseURL = process.env.PRZELEWY24_URL || "https://sandbox.przelewy24.pl";
  return axios.create({
    baseURL: baseURL + "/api/v1",
    maxRedirects: 0,
    validateStatus: () => true,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: basicAuth,
    },
  });
};
