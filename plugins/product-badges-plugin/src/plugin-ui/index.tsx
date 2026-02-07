import {
  createDeenruvUIPlugin,
  DEENRUV_UI_VERSION,
} from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns";
import { Badges } from "./components/Badges";

export const BadgesUiPlugin = createDeenruvUIPlugin({
  version: DEENRUV_UI_VERSION,
  name: "Example Plugin",
  extensions: [
    {
      id: "product-badges",
      surface: "products-detail-view",
      component: Badges,
    },
  ],
  translations: {
    ns: translationNS,
    data: { en, pl },
  },
});
