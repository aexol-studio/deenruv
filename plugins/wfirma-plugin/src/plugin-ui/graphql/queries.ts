import { typedGql } from '../zeus/typedDocumentNode';
import { $ } from '../zeus';
import { scalars } from './scalars';

const query = typedGql('query', { scalars });

export const QUERIES = {};
