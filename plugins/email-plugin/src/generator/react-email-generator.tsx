import { render } from "@react-email/render";
import { RequestContext } from "@deenruv/core";
import Handlebars from "handlebars";

import {
  EmailDetails,
  LoaderBody,
  ReactEmailSenderPluginOptions,
} from "../types.js";
import { EmailGenerator } from "./email-generator.js";
export class ReactComponentEmailGenerator implements EmailGenerator {
  constructor(private opts: ReactEmailSenderPluginOptions) {}
  async generate(
    from: string,
    subject: string,
    templateData: string,
    templateVars: Record<string, unknown>,
  ): Promise<Pick<EmailDetails, "from" | "subject" | "body">> {
    const compiledFrom = Handlebars.compile(from, { noEscape: true });
    const compiledSubject = Handlebars.compile(subject);
    const fromResult = compiledFrom(templateVars, {
      allowProtoPropertiesByDefault: true,
    });
    const subjectResult = compiledSubject(templateVars, {
      allowProtoPropertiesByDefault: true,
    });
    const data: LoaderBody = JSON.parse(templateData);
    const ctx = RequestContext.deserialize(data.ctx);
    const Component = this.opts.templates[data.type]?.(ctx);
    if (!Component) {
      throw new Error(`Component not found [${data.type}]`);
    }
    const body = await render(<Component {...templateVars} />, {});
    return {
      from: fromResult,
      subject: subjectResult,
      body,
    };
  }
}
