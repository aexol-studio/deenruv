import { Inject, Injectable } from "@nestjs/common";
import { ActiveOrderService, Order, RequestContext } from "@deenruv/core";
import { PhoneNumberValidationOptions } from "./types.js";
import { CountryCode, isValidPhoneNumber } from "libphonenumber-js";
import parsePhoneNumber from "libphonenumber-js";

import { PHONE_NUMBER_VALIDATION_OPTIONS } from "./symbol.js";

@Injectable()
export class PhoneNumberValidationService {
  constructor(
    @Inject(PHONE_NUMBER_VALIDATION_OPTIONS)
    private options: PhoneNumberValidationOptions,
    private activeOrderService: ActiveOrderService,
  ) {}

  private async getAllowedCountryCodes(
    ctx: RequestContext,
  ): Promise<CountryCode[] | void> {
    const { allowedCountryCodes } = this.options;
    if (typeof allowedCountryCodes === "function") {
      return await allowedCountryCodes(ctx);
    }
    if (Array.isArray(allowedCountryCodes)) {
      return allowedCountryCodes;
    }
  }

  private async getCountryCode(
    ctx: RequestContext,
    order: Order,
  ): Promise<string | void> {
    if (order.shippingAddress.countryCode)
      return order.shippingAddress.countryCode;
    const { defaultCountryCode } = this.options;
    if (typeof defaultCountryCode === "string") return defaultCountryCode;
    if (defaultCountryCode) return await defaultCountryCode(ctx, order);
  }

  async validatePhoneNumberForOrder(
    ctx: RequestContext,
    order: Order,
  ): Promise<string | void> {
    const { requirePhoneNumber } = this.options;
    const { phoneNumber } = order.shippingAddress;
    if (!phoneNumber) {
      return requirePhoneNumber ? "missing required phone number" : undefined;
    }
    const allowedCountryCodes = await this.getAllowedCountryCodes(ctx);
    const phone = parsePhoneNumber(phoneNumber);
    if (!phone) return "could not parse phone number";
    if (
      phone.country &&
      allowedCountryCodes &&
      !allowedCountryCodes.includes(phone.country)
    ) {
      return `phone number country ${phone.country} is not allowed`;
    }
    // Try to validate phone number before country hint.
    if (isValidPhoneNumber(phoneNumber)) {
      return;
    }
    const countryCode = await this.getCountryCode(ctx, order);
    if (!countryCode) {
      return "could not validate phone due to unknown country";
    }
    if (!isValidPhoneNumber(phoneNumber, countryCode as CountryCode)) {
      return `${phoneNumber} is not a valid phone number for country ${countryCode}`;
    }
  }

  async validatePhoneNumberForCurrentOrder(
    ctx: RequestContext,
  ): Promise<string | void> {
    const order = await this.activeOrderService.getActiveOrder(ctx, undefined);
    if (!order) {
      throw new Error("no active order");
    }
    return this.validatePhoneNumberForOrder(ctx, order);
  }
}
