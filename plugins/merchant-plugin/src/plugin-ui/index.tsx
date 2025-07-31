import React from "react";
import { createDeenruvUIPlugin } from "@deenruv/react-ui-devkit";
import { GooglePage } from "./pages/GooglePage.js";
import { FacebookPage } from "./pages/FacebookPage.js";
import { GlobeIcon } from "lucide-react";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns.js";

export const MerchantPluginUI = createDeenruvUIPlugin<{}>({
  version: "1.0.0",
  name: "MerchantPluginUI",
  translations: { ns: translationNS, data: { en, pl } },
  pages: [
    { path: "google-merchant", element: <GooglePage /> },
    { path: "facebook-commerce", element: <FacebookPage /> },
  ],
  navMenuGroups: [
    {
      id: "merchant-platforms",
      labelId: "nav.merchantPlatforms",
      placement: { groupId: "settings" },
    },
  ],
  navMenuLinks: [
    {
      groupId: "merchant-platforms",
      id: "google-merchant",
      labelId: "nav.googleMerchant",
      href: "google-merchant",
      icon: GlobeIcon,
    },
    {
      groupId: "merchant-platforms",
      id: "facebook-commerce",
      labelId: "nav.facebookCommerce",
      href: "facebook-commerce",
      icon: GlobeIcon,
    },
  ],
});
