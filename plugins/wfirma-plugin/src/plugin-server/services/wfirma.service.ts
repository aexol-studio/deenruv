import { Inject, Injectable } from "@nestjs/common";
import {
  RequestContext,
  OrderService,
  ShippingMethodService,
} from "@deenruv/core";
import { fetchWFirmaAPI } from "../helpers/fetch-wfirma-api";
import {
  AddContractorInput,
  AddInvoiceInput,
  Contractor,
  FindContractorInput,
  Invoice,
} from "../helpers/types";
import { PLUGIN_INIT_OPTIONS } from "../constants";
import { WFirmaPluginConfig } from "../types";
import { GraphQLTypes, ResolverInputTypes } from "../zeus";

@Injectable()
export class WFirmaService {
  constructor(
    private orderService: OrderService,
    private shippingMethodService: ShippingMethodService,
    @Inject(PLUGIN_INIT_OPTIONS) private plugin_config: WFirmaPluginConfig,
  ) {}
  private client = this.plugin_config?.authorization
    ? fetchWFirmaAPI(this.plugin_config.authorization)
    : null;

  async createInvoice(
    ctx: RequestContext,
    input: ResolverInputTypes["SendInvoiceToWFirmaInput"],
  ): Promise<GraphQLTypes["WFirmaResponse"] | null> {
    const { orderID, invoiceType } = input;

    if (!this.client) {
      console.error("WFirma authorization is not set");
      return null;
    }

    const orderData = await this.getOrderDataForInvoice(ctx, orderID);

    if (!orderData) return null;

    let contractorID = null;
    contractorID = orderData.contractor.email
      ? await this.findContractor(
          orderData.contractor.email,
          orderData.contractor.street ?? "",
        )
      : null;

    if (!contractorID) {
      contractorID = await this.addContractor(orderData.contractor);
    }
    if (!contractorID) return null;

    const addInvoiceInput: AddInvoiceInput = {
      invoices: [
        {
          invoice: {
            type: invoiceType,
            type_of_sale: "WSTO_EE",
            contractor: { id: contractorID },
            invoicecontents: orderData.invoicecontents,
            price_type: invoiceType === "proforma" ? "brutto" : "netto",
          },
        },
      ],
    };

    const addInvoiceResponse = await this.client(
      "add-invoice",
      addInvoiceInput,
    );
    if (!addInvoiceResponse?.invoices?.["0"]?.invoice?.id) return null;

    const saveResponse = await this.saveInvoiceDataOnOrder(
      ctx,
      orderID,
      input,
      addInvoiceResponse?.invoices?.["0"]?.invoice,
    );

    return saveResponse ? { __typename: "WFirmaResponse", url: "" } : null;
  }

  private async saveInvoiceDataOnOrder(
    ctx: RequestContext,
    orderID: string,
    input: ResolverInputTypes["SendInvoiceToWFirmaInput"],
    invoiceData?: Invoice,
  ) {
    const response = await this.orderService.updateCustomFields(ctx, orderID, {
      wfirmaInvoiceId: invoiceData?.id,
    });

    if (invoiceData?.fullnumber) {
      await this.orderService.addNoteToOrder(ctx, {
        id: orderID,
        note: `[WFirma] Typ faktury: ${input.invoiceType}, numer faktury: ${invoiceData.fullnumber}`,
        isPublic: false,
      });
    }

    return response;
  }

  private async findContractor(email: string, street: string) {
    if (this.client === null) {
      console.error("WFirma authorization is not set");
      return null;
    }
    const contractorRequestInput: FindContractorInput = {
      contractors: {
        parameters: {
          limit: 5,
          page: 1,
          fields: [{ field: "id" }, { field: "email" }],
          conditions: [
            {
              condition: {
                field: "email",
                operator: "eq",
                value: email,
              },
            },
            {
              condition: {
                field: "street",
                operator: "eq",
                value: street,
              },
            },
          ],
        },
      },
    };

    const response = await this.client(
      "find-contractor",
      contractorRequestInput,
    );

    return response?.contractors?.["0"]?.contractor?.id as string | undefined;
  }

  private async addContractor(contractor: Contractor) {
    if (this.client === null) {
      console.error("WFirma authorization is not set");
      return null;
    }
    const addContractorInput: AddContractorInput = {
      contractors: [
        {
          contractor: contractor,
        },
      ],
    };
    const response = await this.client("add-contractor", addContractorInput);

    return response?.contractors?.["0"]?.contractor?.id as string | undefined;
  }

  private async getOrderDataForInvoice(ctx: RequestContext, orderID: string) {
    try {
      const order = await this.orderService.findOne(ctx, orderID, [
        "customer",
        "lines",
        "lines.productVariant",
        "shippingLines",
        "shippingLines.shippingMethod",
        "customer.addresses",
        "sellerOrders.customer",
      ]);

      if (!order) throw new Error("Order not found");
      if (!order.customer) throw new Error("Order has no customer");
      if (
        !order.shippingAddress ||
        !order.shippingAddress.city ||
        !order.shippingAddress.postalCode
      ) {
        throw new Error("Order has no shipping address");
      }

      let nip = null;
      let companyName = null;

      const orderBillingAddress = order.billingAddress;

      const orderBillingAddressCustomFields = orderBillingAddress?.customFields;

      if (orderBillingAddressCustomFields) {
        nip = orderBillingAddressCustomFields?.companyTaxId;
        companyName = orderBillingAddressCustomFields?.companyName;
      }

      if (!nip) {
        const customAddressData = order.customer.addresses.find(
          (address) => address.streetLine1 === orderBillingAddress?.streetLine1,
        )?.customFields as any;

        if (customAddressData) {
          nip = customAddressData?.companyTaxId;
          companyName = customAddressData?.companyName;
        }
      }

      const contractor: Contractor = {
        name: companyName
          ? companyName
          : order.customer.firstName + " " + order.customer.lastName,
        street:
          (order.billingAddress?.streetLine1 ?? "") +
          " " +
          (order.billingAddress?.streetLine2 ?? ""),
        city: order.billingAddress.city,
        zip: order.billingAddress.postalCode,
        phone: order.customer.phoneNumber,
        email: order.customer.emailAddress,
        ...(nip ? { tax_id_type: "nip", nip } : {}),
      };
      const totalProductsQuantity = order.lines.reduce((acc, line) => {
        return acc + line.quantity;
      }, 0);

      const distributedOderDiscount = order.discounts.reduce(
        (acc, discount) => {
          if (discount.type === "DISTRIBUTED_ORDER_PROMOTION") {
            return acc - discount.amountWithTax / 100 / totalProductsQuantity;
          }
          return acc;
        },
        0,
      );

      const lineItemsDistributedDiscountArray = order.lines.map((line) => {
        const basePrice =
          (line.discountedLinePriceWithTax != line.linePriceWithTax
            ? line.discountedLinePriceWithTax
            : line.linePriceWithTax) /
          100 /
          line.quantity;

        const price =
          basePrice - distributedOderDiscount > 0
            ? basePrice - distributedOderDiscount
            : 0;

        const excessDiscount =
          basePrice - distributedOderDiscount > 0
            ? 0
            : distributedOderDiscount - basePrice;

        return { price, excessDiscount };
      });

      let totalExcessDiscount = lineItemsDistributedDiscountArray.reduce(
        (acc, { excessDiscount }) => acc + excessDiscount,
        0,
      );

      const invoicecontents: AddInvoiceInput["invoices"][number]["invoice"]["invoicecontents"] =
        order.lines.map((line, index) => {
          let priceValue = lineItemsDistributedDiscountArray[index].price;

          if (totalExcessDiscount > 0) {
            priceValue =
              totalExcessDiscount > priceValue
                ? 0
                : priceValue - totalExcessDiscount;
            totalExcessDiscount -=
              lineItemsDistributedDiscountArray[index].price;
          }
          const price = `${priceValue}`;

          return {
            invoicecontent: {
              name: line.productVariant.name,
              count: `${line.quantity}`,
              unit_count: `${line.quantity}`,
              price,
              unit: `szt.`,
            },
          };
        });

      const shipping = order.shippingWithTax / 100;
      if (shipping !== 0) {
        const shippingLine = order.shippingLines[0];
        const shippingMethod = await this.shippingMethodService.findOne(
          ctx,
          shippingLine.shippingMethod.id,
        );

        const shippingcontent = {
          invoicecontent: {
            name: shippingMethod?.name || "Shipping",
            count: "1",
            unit_count: "1",
            price: `${shipping}`,
            unit: `szt.`,
          },
        };
        invoicecontents.push(shippingcontent);
      }
      return { contractor, invoicecontents };
    } catch (error) {
      console.error("error on get data order data for invoice", error);
      return null;
    }
  }
}
