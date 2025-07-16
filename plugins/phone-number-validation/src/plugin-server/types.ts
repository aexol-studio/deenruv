import { Order, OrderState, RequestContext } from "@deenruv/core";

export type PhoneNumberValidationOptions = {
  disableTransitionValidation?: boolean;
  stateCheck?: OrderState;
  requirePhoneNumber?: boolean;
  defaultCountryCode?:
    | string
    | ((ctx: RequestContext, order: Order) => Promise<string> | string);
  allowedCountryCodes?:
    | string[]
    | ((ctx: RequestContext) => Promise<string[]> | string[]);
};
