import { InternalServerError } from "@deenruv/core";
import {
  Przelewy24NotificationBody,
  Przelewy24PluginConfiguration,
} from "../types.js";
import { getPrzelewy24SecretsByChannel, getP24Client } from "../utils.js";
import { P24Error } from "@aexol/przelewy24-sdk";

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
  let channel: string;
  if (options.currencyCodeToChannel) {
    channel = options.currencyCodeToChannel(body.currency);
  } else {
    channel = currencyCodeToChannel(body.currency);
  }
  const przelewy24Secrets = getPrzelewy24SecretsByChannel(options, channel);
  const client = getP24Client(przelewy24Secrets);

  try {
    const result = await client.verifyTransaction({
      sessionId: body.sessionId,
      orderId: Number(body.orderId),
      amount: body.amount,
      currency: body.currency,
    });
    return result.data.status;
  } catch (e) {
    if (e instanceof P24Error) {
      throw new InternalServerError("P24 verification failed", {
        err: `${e.message} (code: ${e.code})`,
      });
    }
    throw new InternalServerError("Internal Server Error", { err: `${e}` });
  }
};
