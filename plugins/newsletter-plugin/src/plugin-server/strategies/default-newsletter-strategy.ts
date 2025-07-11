import { RequestContext } from "@deenruv/core";
import { NewsletterStrategy } from "../types.js";

export class DefaultNewsletterStrategy implements NewsletterStrategy {
  async addToNewsLetter(ctx: RequestContext, email: string) {
    return { success: true };
  }
}
