import { Injectable } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { type QueryOrdersArgs } from "@deenruv/common/src/generated-types";
import { PaginatedList } from "@deenruv/common/src/shared-types";
import {
  Ctx,
  Order,
  OrderService,
  RequestContext,
  DeenruvPlugin,
  Relations,
  type RelationPaths,
  PluginCommonModule,
} from "@deenruv/core";
import gql from "graphql-tag";

@Injectable()
export class RelationDecoratorTestService {
  private lastRelations: string[];

  getRelations() {
    return this.lastRelations;
  }

  reset() {
    this.lastRelations = [];
  }

  recordRelations(relations: string[]) {
    this.lastRelations = relations;
  }
}

@Resolver()
export class TestResolver {
  constructor(
    private orderService: OrderService,
    private testService: RelationDecoratorTestService,
  ) {}

  @Query()
  orders(
    @Ctx() ctx: RequestContext,
    @Args() args: QueryOrdersArgs,
    @Relations(Order) relations: RelationPaths<Order>,
  ): Promise<PaginatedList<Order>> {
    this.testService.recordRelations(relations);
    return this.orderService.findAll(ctx, args.options || undefined, relations);
  }

  @Query()
  ordersWithDepth5(
    @Ctx() ctx: RequestContext,
    @Args() args: QueryOrdersArgs,
    @Relations({ entity: Order, depth: 5 }) relations: RelationPaths<Order>,
  ): Promise<PaginatedList<Order>> {
    this.testService.recordRelations(relations);
    return this.orderService.findAll(ctx, args.options || undefined, relations);
  }
}

@DeenruvPlugin({
  imports: [PluginCommonModule],
  shopApiExtensions: {
    resolvers: () => [TestResolver],
    schema: () => gql`
      extend type Query {
        orders(options: OrderListOptions): OrderList!
        ordersWithDepth5(options: OrderListOptions): OrderList!
      }
    `,
  },
  providers: [RelationDecoratorTestService],
  exports: [RelationDecoratorTestService],
})
export class RelationsDecoratorTestPlugin {}
