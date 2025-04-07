import { createDeenruvUIPlugin } from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns";
import { InRealizationStateModal } from "./components/InRealizationStateModal.js";
import { InRealizationCard } from "./components/InRealizationCard.js";
import { InRealizationButton } from "./components/InRealizationButton.js";

export const InRealizationUIPlugin = createDeenruvUIPlugin({
  version: "1.0.0",
  name: "In Realization Plugin",
  translations: { ns: translationNS, data: { en, pl } },
  actions: {
    inline: [{ id: "orders-detail-view", component: InRealizationButton }],
  },
  components: [{ id: "orders-summary", component: InRealizationCard }],
  modals: [{ id: "manual-order-state", component: InRealizationStateModal }],
});
