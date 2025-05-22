import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const PaymentMethodHandlerSelector = Selector(
  "ConfigurableOperationDefinition",
)({
  code: true,
  description: true,
  args: {
    name: true,
    defaultValue: true,
    label: true,
    type: true,
    description: true,
    list: true,
    ui: true,
    required: true,
  },
});

export type PaymentMethodHandlerType = FromSelectorWithScalars<
  typeof PaymentMethodHandlerSelector,
  "ConfigurableOperationDefinition"
>;
