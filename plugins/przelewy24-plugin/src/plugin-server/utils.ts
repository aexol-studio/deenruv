import axios from "axios";
import * as crypto from "crypto";
import { Order } from "@deenruv/core";
import { Przelewy24SecretsByMarket, AllowedChannels } from "./types";
import { METHOD_NAME } from "./constants";

const allowedMarkets = ["pl-channel"] as AllowedChannels[];

export const generateSHA384Hash = (sum: string) => {
  const hash = crypto.createHash("sha384");
  const data = hash.update(sum, "utf-8");
  const gen_hash = data.digest("hex");
  return gen_hash;
};

export const getSessionId = (order: Order) => {
  const przelewy24payments = order.payments.filter(
    (payment) => payment.method === METHOD_NAME,
  );
  const sessionId = !przelewy24payments.length
    ? `${order.code}`
    : `${order.code}-${przelewy24payments.length + 1}`;
  return sessionId;
};

export const getPrzelewy24SecretsByChannel = (channel: string) => {
  const _ch = channel.toLowerCase();
  if (!allowedMarkets.includes(_ch as AllowedChannels)) {
    throw new Error(`Market ${_ch} is not supported`);
  }

  const ch = _ch.split("-")[0];

  const args = process.env as { [key: string]: string };
  const envs = {
    PRZELEWY24_POS_ID: args[`PRZELEWY24_POS_ID_${ch.toUpperCase()}`] as string,
    PRZELEWY24_CRC: args[`PRZELEWY24_CRC_${ch.toUpperCase()}`] as string,
    PRZELEWY24_CLIENT_SECRET: args[
      `PRZELEWY24_CLIENT_SECRET_${ch.toUpperCase()}`
    ] as string,
  };
  if (Object.values(envs).some((env) => !env)) {
    throw new Error(`Missing env variables for market ${channel}`);
  }
  return envs;
};

export const getAxios = (przelewy24Secrets: Przelewy24SecretsByMarket) => {
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
      "Content-Type": "application/json",
      Authorization: basicAuth,
    },
  });
};
