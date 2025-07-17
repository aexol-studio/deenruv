import { Order, OrderState, RequestContext } from "@deenruv/core";
import { CountryCode } from "libphonenumber-js";

export type PhoneNumberValidationOptions = {
  disableTransitionValidation?: boolean;
  stateCheck?: OrderState;
  requirePhoneNumber?: boolean;
  defaultCountryCode?:
    | string
    | ((ctx: RequestContext, order: Order) => Promise<string> | string);
  allowedCountryCodes?:
    | CountryCode[]
    | ((ctx: RequestContext) => Promise<CountryCode[]> | CountryCode[]);
};
