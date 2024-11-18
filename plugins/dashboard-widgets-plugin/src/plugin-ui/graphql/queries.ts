import { typedGql } from '../zeus/typedDocumentNode';
import { $ } from '../zeus';

export const TEST = typedGql('query')({ activeAdministrator: { id: true } });

export const A = typedGql('query')({ product: [{ id: $('id', 'ID!') }, { id: true }] });
