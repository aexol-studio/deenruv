import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { Inject, Injectable } from "@nestjs/common";
import {
  Channel,
  RequestContextService,
  TransactionalConnection,
} from "@deenruv/core";
import type { Request } from "express";
import { CRONJOBS_PLUGIN_OPTIONS } from "../constants.js";
import { CronJobsPluginOptions } from "../types.js";

export class CardMarketAuthErrorResult extends Error {
  readonly httpStatus: number;
}

export class AuthenticationError extends CardMarketAuthErrorResult {
  readonly __typename = "AuthenticationError";
  readonly name = "authentication_error";
  readonly httpStatus = 403;
  readonly message = "AUTH_ERROR";
}

@Injectable()
export class ControllersGuard implements CanActivate {
  constructor(
    private connection: TransactionalConnection,
    private requestContextService: RequestContextService,
    @Inject(CRONJOBS_PLUGIN_OPTIONS)
    private options: CronJobsPluginOptions,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return this.verifySignature(context);
  }

  private async verifySignature(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req?.query?.token;
    if (!token || token !== this.options.controllerAuthToken) {
      throw new AuthenticationError();
    }
    const channel = await this.connection.rawConnection
      .getRepository(Channel)
      .findOne({
        where: { code: "__default_channel__" },
        relations: ["defaultTaxZone", "defaultShippingZone"],
      });
    if (!channel) throw new AuthenticationError();
    const ctx = await this.requestContextService.create({
      req,
      apiType: "admin",
      channelOrToken: channel,
      languageCode: channel.defaultLanguageCode,
    });
    if (!ctx) throw new AuthenticationError();
    context.switchToHttp().getRequest()["ctx"] = ctx;
    return true;
  }
}
