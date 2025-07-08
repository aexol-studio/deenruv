import { FulfillmentHandler, LanguageCode } from "@deenruv/core";
import { InpostService } from "../services/inpost.service.js";

export const inpostFulfillmentHandlerCode = "inpost-fulfillment";
/**
 * The handler for Inpost shipping.
 */
export const inpostFulfillmentHandler = () => {
  let inpostService: InpostService;
  return new FulfillmentHandler({
    code: inpostFulfillmentHandlerCode,

    description: [
      {
        languageCode: LanguageCode.pl,
        value: "Dostawa InPost",
      },
      {
        languageCode: LanguageCode.en,
        value: "InPost fulifillment",
      },
    ],

    args: {
      dimensions: {
        type: "string",
        ui: {
          component: "select-form-input",
          options: [
            {
              value: "small",
              label: [
                {
                  languageCode: LanguageCode.en,
                  value: "A",
                },
                {
                  languageCode: LanguageCode.pl,
                  value: "A",
                },
              ],
            },
            {
              value: "medium",
              label: [
                {
                  languageCode: LanguageCode.en,
                  value: "B",
                },
                {
                  languageCode: LanguageCode.pl,
                  value: "B",
                },
              ],
            },
            {
              value: "large",
              label: [
                {
                  languageCode: LanguageCode.en,
                  value: "C",
                },
                {
                  languageCode: LanguageCode.pl,
                  value: "C",
                },
              ],
            },
            {
              value: "xlarge",
              label: [
                {
                  languageCode: LanguageCode.en,
                  value: "D",
                },
                {
                  languageCode: LanguageCode.pl,
                  value: "D",
                },
              ],
            },
          ],
        },
      },
    },

    init(injector) {
      inpostService = injector.get(InpostService);
    },

    async createFulfillment(ctx, orders, lines, args) {
      const shipment = await inpostService.createShipmentForOrders(
        ctx,
        orders,
        lines,
        args.dimensions as "small" | "medium" | "large" | "xlarge",
      );
      return { trackingCode: `${shipment.id}` };
    },
  });
};
