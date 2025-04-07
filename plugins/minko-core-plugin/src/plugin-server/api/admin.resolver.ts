import { Mutation, Args, Query, Resolver } from "@nestjs/graphql";
import {
  Allow,
  Ctx,
  Permission,
  RequestContext,
  Transaction,
} from "@deenruv/core";
import { OrderRegisterService } from "../services/order-register.service";
import { StorageService } from "../services/storage.service";

@Resolver()
export class AdminResolver {
  constructor(
    private orderRegisterService: OrderRegisterService,
    private storageService: StorageService,
  ) {}

  @Allow(Permission.UpdateOrder)
  @Transaction()
  @Mutation()
  async registerRealization(@Ctx() ctx: RequestContext, @Args() args: any) {
    return this.orderRegisterService.registerRealization(ctx, args.input);
  }

  @Allow(Permission.UpdateOrder)
  @Transaction()
  @Mutation()
  async registerProforma(@Ctx() ctx: RequestContext, @Args() args: any) {
    return this.orderRegisterService.registerProforma(ctx, args.input);
  }

  @Allow(Permission.UpdateOrder)
  @Query()
  async getRealizationURL(@Ctx() ctx: RequestContext, @Args() args: any) {
    const realization = await this.orderRegisterService.getRealization(
      ctx,
      args.orderID as string,
    );
    if (!realization) return null;
    const url = await this.storageService.getSingedFileUrl(realization.key);
    return url;
  }

  @Allow(Permission.UpdateOrder)
  @Query()
  async getProformaURL(@Ctx() ctx: RequestContext, @Args() args: any) {
    const proforma = await this.orderRegisterService.getProforma(
      ctx,
      args.orderID as string,
    );
    if (!proforma) return null;
    const url = await this.storageService.getSingedFileUrl(proforma.key);
    return url;
  }
}
