import { registerReactRouteComponent } from "@deenruv/admin-ui/react";
import { GooglePage } from "./pages/GooglePage.js";
import { FacebookPage } from "./pages/FacebookPage.js";

export default [
  registerReactRouteComponent({
    component: GooglePage,
    path: "google-merchant",
    title: "Google Merchant Platform Integration Dashboard",
    breadcrumb: "Google Merchant Platform Integration Dashboard",
  }),
  registerReactRouteComponent({
    component: FacebookPage,
    path: "facebook-commerce",
    title: "Facebook Commerce Platform Integration Dashboard",
    breadcrumb: "Facebook Commerce Platform Integration Dashboard",
  }),
];
