import { OrderProcess, OrderState } from "@deenruv/core";
import { PhoneNumberValidationOptions } from "./types.js";
import { PhoneNumberValidationService } from "./service.js";

let phoneNumberValidationService: PhoneNumberValidationService;
export const phoneNumberValidationProcess = ({
  stateCheck,
}: PhoneNumberValidationOptions): OrderProcess<OrderState> => ({
  init(injector) {
    phoneNumberValidationService = injector.get(PhoneNumberValidationService);
  },
  async onTransitionStart(_, toState, data) {
    if (toState === (stateCheck || "ArrangingPayment")) {
      return await phoneNumberValidationService.validatePhoneNumberForOrder(
        data.ctx,
        data.order,
      );
    }
  },
});
