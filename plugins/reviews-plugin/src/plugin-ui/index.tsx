import React from "react";
import { createDeenruvUIPlugin, DEENRUV_UI_VERSION } from "@deenruv/react-ui-devkit";
import { Reviews } from "./pages/Reviews";
import { ListIcon } from "lucide-react";
import { Review } from "./pages/Review";
import { ReviewProductSidebar } from "./components/ReviewProductSidebar";
import { TRANSLATION_NAMESPACE } from "./constants";

import pl from "./locales/pl";
import en from "./locales/en";
import { ReviewOrder } from "./components/ReviewOrder";
import { ReviewCustomer } from "./components/ReviewCustomer";

const PLUGIN_NAME = "reviews-plugin-ui";

export const REVIEWS_ROUTES = {
  route: ["/admin-ui", "extensions", PLUGIN_NAME, ":id"].join("/"),
  new: ["/admin-ui", "extensions", PLUGIN_NAME, "new"].join("/"),
  list: ["/admin-ui", "extensions", PLUGIN_NAME].join("/"),
  to: (id: string) => ["/admin-ui", "extensions", PLUGIN_NAME, id].join("/"),
};

export const ReviewsUIPlugin = createDeenruvUIPlugin({
  version: DEENRUV_UI_VERSION,
  name: PLUGIN_NAME.split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" "),
  pages: [
    { element: <Reviews />, path: "" },
    { element: <Review />, path: ":id" },
  ],
  translations: {
    ns: TRANSLATION_NAMESPACE,
    data: { en, pl },
  },
  components: [
    {
      id: "products-detail-view-sidebar",
      tab: "product",
      component: ReviewProductSidebar,
    },
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: "order-detail-view" as any,
      component: ReviewOrder,
    },
  ],
  tabs: [
    {
      id: "customers-detail-view",
      name: "reviews",
      label: "Reviews",
      component: <ReviewCustomer />,
      hideSidebar: true,
    },
  ],
  navMenuGroups: [
    {
      id: "reviews",
      labelId: "nav.reviews",
      placement: { groupId: "assortment-group" },
    },
  ],
  navMenuLinks: [
    {
      groupId: "reviews",
      id: "reviews-list",
      labelId: "nav.reviewsList",
      href: "",
      icon: ListIcon,
    },
  ],
});
