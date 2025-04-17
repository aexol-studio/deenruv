import { Injector, RequestContext } from "@deenruv/core";

import { TemplateLoader } from "./template-loader.js";
import { LoadTemplateInput, LoaderBody } from "../types.js";

export class ReactComponentLoader implements TemplateLoader {
  async loadTemplate(
    _1: Injector,
    ctx: RequestContext,
    { type }: LoadTemplateInput,
  ) {
    const template: LoaderBody = {
      type,
      ctx: ctx.serialize(),
    };
    return JSON.stringify(template);
  }
}
