import { createDeenruvUIPlugin } from "@deenruv/react-ui-devkit";
import pl from "./locales/pl";
import en from "./locales/en";
import { translationNS } from "./translation-ns";
import { PaymentMethodInput } from "./components/PaymentMethodInput.js";

export const Przelewy24UIPlugin = createDeenruvUIPlugin({
  version: "1.0.0",
  name: "Przelewy24 UI Plugin",
  inputs: [{ id: "payment-method-input", component: PaymentMethodInput }],
  translations: { ns: translationNS, data: { en, pl } },
});
