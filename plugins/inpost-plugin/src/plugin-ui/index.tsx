import {
  createDeenruvUIPlugin,
  DEENRUV_UI_VERSION,
} from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns";
import { Inpost } from "./components/Inpost.js";

export const InPostUIPlugin = createDeenruvUIPlugin({
  version: DEENRUV_UI_VERSION,
  name: "InPost Plugin",
  translations: { ns: translationNS, data: { en, pl } },
  components: [{ id: "shippingMethods-detail-view", component: Inpost }],
});
