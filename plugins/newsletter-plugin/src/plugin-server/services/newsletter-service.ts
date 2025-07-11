import { Inject, Injectable } from "@nestjs/common";
import { Logger, RequestContext } from "@deenruv/core";
import { NewsletterPluginOptions, NewsletterStrategy } from "../types.js";
import { DefaultNewsletterStrategy } from "../strategies/default-newsletter-strategy.js";
import { NEWSLETTER_PLUGIN_OPTIONS } from "../constants.js";

@Injectable()
export class NewsletterService {
  strategy: NewsletterStrategy;
  private readonly logger = new Logger();
  private log = (message: string) =>
    this.logger.log(message, "Newsletter Service");
  constructor(
    @Inject(NEWSLETTER_PLUGIN_OPTIONS)
    private readonly options: NewsletterPluginOptions,
  ) {
    this.strategy = options?.strategy ?? new DefaultNewsletterStrategy();
  }

  async addToNewsLetter(ctx: RequestContext, email: string) {
    const response = await this.strategy.addToNewsLetter(ctx, email);
    return response;
  }
}
