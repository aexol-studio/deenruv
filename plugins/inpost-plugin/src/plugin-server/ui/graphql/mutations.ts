import { $ } from "../zeus";
import { typedGql } from "../zeus/typedDocumentNode";
import { scalars } from "./scalars";

const mutation = typedGql("mutation", { scalars });

const SEND_INVOICE = mutation({
  sendInvoiceToWFirma: [
    { input: $("input", "SendInvoiceToWFirmaInput!") },
    { url: true },
  ],
});

export const MUTATIONS = { SEND_INVOICE };
