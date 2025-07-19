import { createDeenruvUIPlugin } from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns";
import { Inpost } from "./components/Inpost.js";

export const InPostUIPlugin = createDeenruvUIPlugin({
  version: "1.0.0",
  name: "InPost Plugin",
  translations: { ns: translationNS, data: { en, pl } },
  components: [{ id: "shippingMethods-detail-view", component: Inpost }],
});
