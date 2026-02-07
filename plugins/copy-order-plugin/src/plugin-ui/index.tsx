import {
  createDeenruvUIPlugin,
  DEENRUV_UI_VERSION,
  ORDER_STATE,
} from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { CopyOrderButton } from "./components/CopyOrderButton.js";
import { PLUGIN_NAME } from "./constants.js";

export const UIPlugin = createDeenruvUIPlugin<{
  notAllowedStates: ORDER_STATE[];
}>({
  version: DEENRUV_UI_VERSION,
  name: PLUGIN_NAME,
  config: {
    notAllowedStates: [ORDER_STATE.ADDING_ITEMS, ORDER_STATE.ARRANGING_PAYMENT],
  },
  translations: { ns: "copy-order-plugin", data: { en, pl } },
  actions: {
    dropdown: [{ id: "orders-detail-view", component: CopyOrderButton }],
  },
});
