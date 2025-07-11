import { InjectableStrategy, RequestContext } from "@deenruv/core";

export type NewsletterPluginOptions = {
  strategy?: NewsletterStrategy;
};

type NewsletterResponse = { success: boolean } | { errorCode: string };

export interface NewsletterStrategy extends InjectableStrategy {
  addToNewsLetter: (
    ctx: RequestContext,
    email: string,
  ) => Promise<NewsletterResponse>;
}
