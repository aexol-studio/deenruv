import { InternalServerError } from "@deenruv/core";
import {
  Przelewy24NotificationBody,
  Przelewy24PluginConfiguration,
} from "../types.js";
import {
  generateSHA384Hash,
  getAxios,
  getPrzelewy24SecretsByChannel,
} from "../utils.js";

const currencyCodeToChannel = (currencyCode: string) => {
  switch (currencyCode) {
    case "PLN":
      return "pl-channel";
    default:
      throw new Error(`Currency ${currencyCode} is not supported`);
  }
};

export const verifyPrzelewy24Payment = async (
  options: Przelewy24PluginConfiguration,
  body: Przelewy24NotificationBody,
) => {
  const channel = currencyCodeToChannel(body.currency);
  const przelewy24Secrets = getPrzelewy24SecretsByChannel(options, channel);
  const secrets = {
    pos_id: przelewy24Secrets.PRZELEWY24_POS_ID,
    crc: przelewy24Secrets.PRZELEWY24_CRC,
  };

  const api = getAxios(przelewy24Secrets);
  const sum = `{"sessionId":"${body.sessionId}","orderId":${body.orderId},"amount":${body.amount},"currency":"${body.currency}","crc":"${secrets["crc"]}"}`;
  try {
    const result = await api.put("/transaction/verify", {
      merchantId: body.merchantId || secrets["pos_id"],
      posId: body.posId || secrets["pos_id"],
      sessionId: body.sessionId,
      amount: body.amount,
      currency: body.currency,
      orderId: body.orderId,
      sign: generateSHA384Hash(sum),
    });
    if (!result.data.data) {
      throw new Error("malformed przelewy24 verify response");
    }
    return result.data.data.status;
  } catch (e) {
    throw new InternalServerError("Internal Server Error", { err: `${e}` });
  }
};
