import { addActionBarItem } from "@deenruv/admin-ui/core";
import { switchMap, map } from "rxjs";
import gql from "graphql-tag";
import { MUTATIONS } from "../graphql/mutations";

export const ProformaInvoiceActionButton = addActionBarItem({
  id: "wystaw-proforme",
  buttonStyle: "solid",
  buttonColor: "success",
  icon: "printer",
  locationId: "order-detail",
  label: "Wystaw proformę",
  buttonState: ({ route, dataService, notificationService, injector }) => {
    return route.data.pipe(
      switchMap((data) => data.detail.entity),
      map((order: any) => {
        if (
          order?.state === "PaymentSettled" ||
          order?.state === "InRealization" ||
          order?.state === "PartiallyShipped" ||
          order?.state === "Shipped" ||
          order?.state === "PartiallyDelivered" ||
          order?.state === "Delivered"
        ) {
          return { disabled: false, visible: true };
        }
        return { disabled: false, visible: false };
      }),
    );
  },
  onClick: async (x, { route, dataService, notificationService, injector }) => {
    const orderID = route.snapshot.params.id;
    const response = await dataService
      .mutate(MUTATIONS["SEND_INVOICE"], {
        input: { orderID, invoiceType: "proforma" },
      })
      .toPromise();

    if (response?.sendInvoiceToWFirma) {
      const url = "https://wfirma.pl/invoices/index/proforma";
      //@ts-expect-error vendure specific :)
      window.open(url, "_blank");
      notificationService.success("Proforma została wygenerowana");
    } else {
      notificationService.error("Wystąpił błąd podczas generowania proformy");
    }
  },
});
