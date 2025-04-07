import { Resolver, Query } from "@nestjs/graphql";
import { Ctx, RequestContext } from "@deenruv/core";
import { PhoneNumberValidationService } from "./service";

@Resolver()
export class ValidatePhoneNumberAPIResolver {
  constructor(
    private readonly phoneNumberValidationService: PhoneNumberValidationService,
  ) {}

  @Query()
  async validateCurrentOrderPhoneNumber(@Ctx() ctx: RequestContext) {
    const message =
      await this.phoneNumberValidationService.validatePhoneNumberForCurrentOrder(
        ctx,
      );
    if (!message) {
      return {
        __typename: "PhoneNumberValidationSuccess",
        success: true,
      };
    }
    return {
      __typename: "PhoneNumberValidationError",
      message,
    };
  }
}
