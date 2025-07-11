import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import {
  Channel,
  RequestContextService,
  TransactionalConnection,
} from "@deenruv/core";
import type { Request } from "express";
import crypto from "crypto";
import { InpostConfigEntity } from "../entities/inpost-config-entity.js";
import { InpostService } from "../services/inpost.service.js";
export class InPostAuthErrorResult extends Error {
  readonly httpStatus: number;
}
export class AuthenticationError extends InPostAuthErrorResult {
  readonly __typename = "AuthenticationError";
  readonly name = "authentication_error";
  readonly httpStatus = 403;
  readonly message = "AUTH_ERROR";
}
@Injectable()
export class InPostWebhookGuard implements CanActivate {
  constructor(
    private connection: TransactionalConnection,
    private requestContextService: RequestContextService,
    private inpostService: InpostService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return this.verifySignature(context);
  }

  validateSignature(signature: string, body: string, secret: string): boolean {
    const computed = crypto
      .createHmac("sha256", secret)
      .update(body, "utf8")
      .digest("base64");
    return crypto.timingSafeEqual(
      Buffer.from(signature, "base64"),
      Buffer.from(computed, "base64"),
    );
  }

  async getHMACSecret(): Promise<string> {
    const configs = await this.connection.rawConnection
      .getRepository(InpostConfigEntity)
      .find({ take: 1 });
    if (configs.length === 0) {
      throw new Error("HMAC secret not found in database");
    }
    const config = configs[0];
    return config.apiKey;
  }

  private async verifySignature(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const headers = request.headers as Record<string, string>;
    console.log(
      "INPOST HEADERS",
      headers,
      "rawBody" in request ? "rawBody" : "body",
      "rawBody" in request ? request.rawBody : request.body,
    );
    const channel = await this.connection.rawConnection
      .getRepository(Channel)
      .findOne({
        where: { code: "__default_channel__" },
        relations: ["defaultTaxZone", "defaultShippingZone"],
      });
    if (!channel) throw new AuthenticationError();
    const ctx = await this.requestContextService.create({
      req: request,
      apiType: "admin",
      channelOrToken: channel,
      languageCode: channel.defaultLanguageCode,
    });
    context.switchToHttp().getRequest()["ctx"] = ctx;
    return true;
    if (!ctx) throw new AuthenticationError();
    if (!headers["x-inpost-signature"]) throw new AuthenticationError();
    const isValidSignature = this.validateSignature(
      headers["x-inpost-signature"],
      JSON.stringify(request.body),
      await this.getHMACSecret(),
    );
    if (!isValidSignature) throw new AuthenticationError();
    return true;
  }
}
