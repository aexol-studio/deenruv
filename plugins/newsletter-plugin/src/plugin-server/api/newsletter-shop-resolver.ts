import { Args, Resolver, Mutation } from "@nestjs/graphql";
import { Ctx, RequestContext } from "@deenruv/core";

import { NewsletterService } from "../services/newsletter-service.js";

@Resolver()
export class NewsletterShopResolver {
  constructor(private newsletterService: NewsletterService) {}

  @Mutation()
  async addToNewsletter(
    @Ctx() ctx: RequestContext,
    @Args() args: { email: string },
  ) {
    return this.newsletterService.addToNewsLetter(ctx, args.email);
  }
}
