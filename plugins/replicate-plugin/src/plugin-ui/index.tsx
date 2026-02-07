import {
  createDeenruvUIPlugin,
  DEENRUV_UI_VERSION,
} from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns";
import { ReplicateInput } from "./components/Replicate";
import React from "react";
import { NotebookPenIcon } from "lucide-react";

export const ReplicateUiPlugin = createDeenruvUIPlugin({
  version: DEENRUV_UI_VERSION,
  name: "Replicate Newsletter Plugin",
  pages: [{ element: <ReplicateInput />, path: "" }],
  navMenuLinks: [
    {
      groupId: "promotions-group",
      href: "",
      id: "newsletter-model",
      labelId: "Newsletter Model",
      icon: NotebookPenIcon,
    },
  ],
  translations: {
    ns: translationNS,
    data: { en, pl },
  },
});
