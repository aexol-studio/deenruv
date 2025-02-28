import { $ } from '../zeus';
import { typedGql } from '../zeus/typedDocumentNode';
import { scalars } from './scalars';

const mutation = typedGql('mutation', { scalars });

export const SEND_INVOICE = mutation({
    sendInvoiceToWFirma: [{ input: $('input', 'SendInvoiceToWFirmaInput!') }, { url: true }],
});
