import {
  createDeenruvUIPlugin,
  DEENRUV_UI_VERSION,
} from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns";
import { WFirmaButtons } from "./components/WFirmaButtons";
import React from "react";

export const WFirmaUIPlugin = createDeenruvUIPlugin({
  version: DEENRUV_UI_VERSION,
  name: "WFirma Plugin",
  actions: { inline: [{ id: "orders-detail-view", component: WFirmaButtons }] },
  translations: {
    ns: translationNS,
    data: { en, pl },
  },
});
