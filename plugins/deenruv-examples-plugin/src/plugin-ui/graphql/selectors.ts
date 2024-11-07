import { Selector } from '../zeus';

export const SummaryOrdersSelector = Selector('Order')({
    total: true,
    totalWithTax: true,
    currencyCode: true,
});
