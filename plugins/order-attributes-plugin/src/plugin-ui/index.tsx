import {
  createDeenruvUIPlugin,
  DEENRUV_UI_VERSION,
} from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns";
import { AttributesInput } from "./components/AttributesInput";

export const OrderLineAttributesUiPlugin = createDeenruvUIPlugin({
  version: DEENRUV_UI_VERSION,
  name: "Order Line Attributes",
  inputs: [{ id: "attributes-input", component: AttributesInput }],
  translations: { ns: translationNS, data: { en, pl } },
});
