import { registerReactCustomDetailComponent } from '@deenruv/admin-ui/react';
import { ProformaInvoiceActionButton } from './components/ProformaInvoiceActionButton';
import { RecipeInvoiceActionButton } from './components/RecipeInvoiceActionButton';
// import { OrderDetailWFirma } from "./components/OrderDetailWFirma";

export default [
    ProformaInvoiceActionButton,
    RecipeInvoiceActionButton,
    // registerReactCustomDetailComponent({
    //   component: OrderDetailWFirma,
    //   locationId: "order-detail",
    // }),
];
