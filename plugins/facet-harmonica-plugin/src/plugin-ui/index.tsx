import {
  createDeenruvUIPlugin,
  DEENRUV_UI_VERSION,
} from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns";
import { FacetHarmonica } from "./components";
import { tables } from "./tables.js";
import { DedicatedButtons } from "./components/DedicatedButtons.js";

export const FacetHarmonicaUiPlugin = createDeenruvUIPlugin({
  version: DEENRUV_UI_VERSION,
  name: "Facet Harmonica",
  components: [
    {
      id: "products-detail-view",
      component: FacetHarmonica,
    },
  ],
  // FacetsAccordions
  tables,
  translations: { ns: translationNS, data: { en, pl } },
  actions: {
    inline: [{ id: "orders-detail-view", component: DedicatedButtons }],
  },
});
