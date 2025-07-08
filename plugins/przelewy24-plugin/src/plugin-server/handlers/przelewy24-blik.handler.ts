import { LanguageCode, PaymentMethodHandler } from "@deenruv/core";
import { Przelewy24Service } from "../services/przelewy24.service.js";

let service: Przelewy24Service;
export const przelewy24BlikPaymentMethodHandler = new PaymentMethodHandler({
  code: "przelewy24BlikPaymentMethodHandler",
  description: [
    {
      languageCode: LanguageCode.en,
      value: "BLIK Payment handler (by Przelewy24)",
    },
    {
      languageCode: LanguageCode.pl,
      value: "Obsługa płatności BLIK (przez Przelewy24)",
    },
  ],
  args: {},
  init: (injector) => {
    service = injector.get(Przelewy24Service);
  },
  async createPayment(ctx, order, amount, args, metadata, method) {
    return service.createPayment(ctx, order, amount, args, metadata, method);
  },
  async settlePayment() {
    return {
      success: true,
    };
  },
});
