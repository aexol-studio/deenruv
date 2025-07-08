import { registerReactCustomDetailComponent } from "@deenruv/admin-ui/react";
import { Inpost } from "./Inpost";

export default [
  registerReactCustomDetailComponent({
    locationId: "shipping-method-detail",
    component: Inpost,
  }),
];
