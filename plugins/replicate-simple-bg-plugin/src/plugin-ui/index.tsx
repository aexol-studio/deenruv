import { createDeenruvUIPlugin } from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns";
import { ReplicateSimpleBGInput } from "./components/ReplicateSimpleBG.js";
import React from "react";
import { NotebookPenIcon } from "lucide-react";
import { ReplicateSimpleBGProduct } from "./components/ReplicateSimpleGBProduct.js";

export const ReplicateSimpleBGUiPlugin = createDeenruvUIPlugin({
  version: "1.0.0",
  name: "Replicate Simple BG Plugin",
  pages: [{ element: <ReplicateSimpleBGInput />, path: "simple-bg-model" }],
  components: [
    {
      id: "products-detail-view-sidebar",
      tab: "product",
      component: ReplicateSimpleBGProduct,
    },
  ],
  navMenuLinks: [
    {
      groupId: "promotions-group",
      href: "simple-bg-model",
      id: "simple-bg-model",
      labelId: "Simple Background Model",
      icon: NotebookPenIcon,
    },
  ],
  translations: {
    ns: translationNS,
    data: { en, pl },
  },
});
