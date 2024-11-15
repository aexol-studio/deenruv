import { createDeenruvUIPlugin } from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns";
import { Badges } from "./components/Badges";

export const BadgesUiPlugin = createDeenruvUIPlugin({
  version: "1.0.0",
  name: "Example Plugin",
  components: [{ id: "products-detail-view", component: Badges }],
  translations: {
    ns: translationNS,
    data: { en, pl },
  },
});
