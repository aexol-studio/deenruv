import { createDeenruvUIPlugin, DEENRUV_UI_VERSION } from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns";
import React from "react";
import { NotebookPenIcon } from "lucide-react";
import { ReplicateProductSidebar } from "./pages/ReplicateProductSidebar.js";
import { ReplicatePage } from "./pages/ReplicatePage.js";

export const ReplicateSimpleBGUiPlugin = createDeenruvUIPlugin({
  version: DEENRUV_UI_VERSION,
  name: "Replicate Simple BG Plugin",
  pages: [{ element: <ReplicatePage />, path: "simple-bg-model" }],
  components: [
    {
      id: "products-detail-view-sidebar",
      tab: "product",
      component: ReplicateProductSidebar,
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
