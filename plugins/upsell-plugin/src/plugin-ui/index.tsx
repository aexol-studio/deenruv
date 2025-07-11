import { createDeenruvUIPlugin } from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns";
import { ExtrasPage } from "./pages/ExtrasPage";
import React from "react";

export const UpsellUIPlugin = createDeenruvUIPlugin({
  version: "1.0.0",
  name: "UpsellUI Plugin",
  translations: { ns: translationNS, data: { en, pl } },
  tabs: [
    {
      id: "products-detail-view",
      component: <ExtrasPage />,
      hideSidebar: true,
      sidebarReplacement: <></>,
      name: "Extras",
      label: "Extras",
    },
  ],
});
