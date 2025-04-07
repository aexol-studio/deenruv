import {
  mergeConfig,
  Order,
  OrderMiddleware,
  OrderLine,
  RequestContext,
  ShouldAddItemToOrderInput,
  ShouldAdjustOrderLineInput,
} from "@deenruv/core";

import { ADJUST_ORDER_LINE } from "@deenruv/payments-plugin/e2e/graphql/shop-queries";
import {
  createErrorResultGuard,
  createTestEnvironment,
  ErrorResultGuard,
} from "@deenruv/testing";

import path from "path";
import { afterAll, beforeAll, it, describe, expect, vi } from "vitest";

import { testConfig } from "../../../e2e-common/test-config.js";
import { initialData } from "../../../e2e-common/e2e-initial-data.js";
import * as CodegenShop from "./graphql/generated-e2e-shop-types";
import {
  ADD_ITEM_TO_ORDER,
  ADJUST_ITEM_QUANTITY,
  GET_ACTIVE_ORDER,
  REMOVE_ITEM_FROM_ORDER,
} from "./graphql/shop-definitions";
class OrderMiddleware1 implements OrderMiddleware {
  shouldAddItemToOrderSpy = vi.fn();
  shouldAdjustOrderLineSpy = vi.fn();
  shouldRemoveItemFromOrderSpy = vi.fn();
  shouldAddItemToOrder(
    ctx: RequestContext,
    order: Order,
    input: ShouldAddItemToOrderInput,
  ): Promise<void | string> {
    this.shouldAddItemToOrderSpy(ctx, order, input);
    return Promise.resolve();
  }
  shouldAdjustOrderLine(
    ctx: RequestContext,
    order: Order,
    input: ShouldAdjustOrderLineInput,
  ): Promise<void | string> {
    this.shouldAdjustOrderLineSpy(ctx, order, input);
    return Promise.resolve();
  }
  shouldRemoveItemFromOrder(
    ctx: RequestContext,
    order: Order,
    orderLine: OrderLine,
  ): Promise<void | string> {
    this.shouldRemoveItemFromOrderSpy(ctx, order, orderLine);
    return Promise.resolve();
  }
}
class OrderMiddleware2 implements OrderMiddleware {
  async shouldAddItemToOrder(
    ctx: RequestContext,
    order: Order,
    input: ShouldAddItemToOrderInput,
  ) {
    if (input.productVariant.id === 2 && input.quantity < 2) {
      return "Quantity must be at least 2";
    }
  }
  async shouldAdjustOrderLine(
    ctx: RequestContext,
    order: Order,
    input: ShouldAdjustOrderLineInput,
  ): Promise<void | string> {
    if (input.orderLine.productVariant.id === 2 && input.quantity < 2) {
      return "Quantity must be at least 2";
    }
  }
  async shouldRemoveItemFromOrder(
    ctx: RequestContext,
    order: Order,
    orderLine: OrderLine,
  ): Promise<void | string> {
    const overridden = ctx.req?.query?.overridden;
    if (overridden) {
      return;
    }
    if (orderLine.productVariant.id === 2) {
      return "Cannot remove this item";
    }
  }
}
type OrderSuccessResult =
  | CodegenShop.UpdatedOrderFragment
  | CodegenShop.TestOrderFragmentFragment
  | CodegenShop.TestOrderWithPaymentsFragment
  | CodegenShop.ActiveOrderCustomerFragment;
const orderResultGuard: ErrorResultGuard<OrderSuccessResult> =
  createErrorResultGuard((input) => !!input.lines);
describe("Order interceptor", () => {
  const orderMiddleware1 = new OrderMiddleware1();
  const orderMiddleware2 = new OrderMiddleware2();
  const { server, adminClient, shopClient } = createTestEnvironment(
    mergeConfig(testConfig(), {
      orderOptions: {
        orderMiddlewares: [orderMiddleware1, orderMiddleware2],
      },
    }),
  );
  beforeAll(async () => {
    await server.init({
      initialData,
      productsCsvPath: path.join(__dirname, "fixtures/e2e-products-full.csv"),
      customerCount: 1,
    });
  });
  afterAll(async () => {
    await server.destroy();
  });
  it("willAddItemToOrder", async () => {
    const { addItemToOrder } = await shopClient.query<
      CodegenShop.AddItemToOrderMutation,
      CodegenShop.AddItemToOrderMutationVariables
    >(ADD_ITEM_TO_ORDER, {
      productVariantId: "T_1",
      quantity: 1,
    });
    orderResultGuard.assertSuccess(addItemToOrder);
    expect(addItemToOrder.lines.length).toBe(1);
    expect(orderMiddleware1.shouldAddItemToOrderSpy).toHaveBeenCalled();
    expect(
      orderMiddleware1.shouldAddItemToOrderSpy.mock.calls[0][0],
    ).toBeInstanceOf(RequestContext);
    expect(
      orderMiddleware1.shouldAddItemToOrderSpy.mock.calls[0][1],
    ).toBeInstanceOf(Order);
    expect(
      orderMiddleware1.shouldAddItemToOrderSpy.mock.calls[0][2].quantity,
    ).toBe(1);
    expect(
      orderMiddleware1.shouldAddItemToOrderSpy.mock.calls[0][2].productVariant
        .id,
    ).toBe(1);
    expect(
      orderMiddleware1.shouldAddItemToOrderSpy.mock.calls[0][2].customFields,
    ).toBeUndefined();
  });
  it("willAdjustOrderLine", async () => {
    const { adjustOrderLine } = await shopClient.query<
      CodegenShop.AdjustItemQuantityMutation,
      CodegenShop.AdjustItemQuantityMutationVariables
    >(ADJUST_ITEM_QUANTITY, {
      orderLineId: "T_1",
      quantity: 2,
    });
    orderResultGuard.assertSuccess(adjustOrderLine);
    expect(orderMiddleware1.shouldAdjustOrderLineSpy).toHaveBeenCalled();
    expect(
      orderMiddleware1.shouldAdjustOrderLineSpy.mock.calls[0][0],
    ).toBeInstanceOf(RequestContext);
    expect(
      orderMiddleware1.shouldAdjustOrderLineSpy.mock.calls[0][1],
    ).toBeInstanceOf(Order);
    expect(
      orderMiddleware1.shouldAdjustOrderLineSpy.mock.calls[0][2].quantity,
    ).toBe(2);
    expect(
      orderMiddleware1.shouldAdjustOrderLineSpy.mock.calls[0][2].orderLine.id,
    ).toBe(1);
    expect(
      orderMiddleware1.shouldAdjustOrderLineSpy.mock.calls[0][2].customFields,
    ).toBeUndefined();
  });
  it("willRemoveItemFromOrder", async () => {
    const { removeOrderLine } = await shopClient.query<
      CodegenShop.RemoveItemFromOrderMutation,
      CodegenShop.RemoveItemFromOrderMutationVariables
    >(REMOVE_ITEM_FROM_ORDER, {
      orderLineId: "T_1",
    });
    orderResultGuard.assertSuccess(removeOrderLine);
    expect(orderMiddleware1.shouldRemoveItemFromOrderSpy).toHaveBeenCalled();
    expect(
      orderMiddleware1.shouldRemoveItemFromOrderSpy.mock.calls[0][0],
    ).toBeInstanceOf(RequestContext);
    expect(
      orderMiddleware1.shouldRemoveItemFromOrderSpy.mock.calls[0][1],
    ).toBeInstanceOf(Order);
    expect(
      orderMiddleware1.shouldRemoveItemFromOrderSpy.mock.calls[0][2]
        .productVariant.id,
    ).toEqual(1);
  });
  it("willAddItemToOrder with error", async () => {
    const { addItemToOrder } = await shopClient.query<
      CodegenShop.AddItemToOrderMutation,
      CodegenShop.AddItemToOrderMutationVariables
    >(ADD_ITEM_TO_ORDER, {
      productVariantId: "T_2",
      quantity: 1,
    });
    orderResultGuard.assertErrorResult(addItemToOrder);
    expect(addItemToOrder.message).toBe(
      "An error occurred when attempting to modify the Order",
    );
    expect(addItemToOrder.interceptorError).toBe("Quantity must be at least 2");
  });
  it("item was not added to order", async () => {
    const { activeOrder } =
      await shopClient.query<CodegenShop.GetActiveOrderQuery>(GET_ACTIVE_ORDER);
    orderResultGuard.assertSuccess(activeOrder);
    expect(activeOrder.lines.length).toBe(0);
  });
  it("add item that passes interceptor check", async () => {
    const { addItemToOrder } = await shopClient.query<
      CodegenShop.AddItemToOrderMutation,
      CodegenShop.AddItemToOrderMutationVariables
    >(ADD_ITEM_TO_ORDER, {
      productVariantId: "T_2",
      quantity: 2,
    });
    orderResultGuard.assertSuccess(addItemToOrder);
    expect(addItemToOrder.lines.length).toBe(1);
  });
  it("willAdjustOrderLine with error", async () => {
    const { adjustOrderLine } = await shopClient.query<
      CodegenShop.AdjustItemQuantityMutation,
      CodegenShop.AdjustItemQuantityMutationVariables
    >(ADJUST_ORDER_LINE, {
      orderLineId: "T_2",
      quantity: 1,
    });
    orderResultGuard.assertErrorResult(adjustOrderLine);
    expect(adjustOrderLine.message).toBe(
      "An error occurred when attempting to modify the Order",
    );
    expect(adjustOrderLine.interceptorError).toBe(
      "Quantity must be at least 2",
    );
  });
  it("item was not adjusted", async () => {
    const { activeOrder } =
      await shopClient.query<CodegenShop.GetActiveOrderQuery>(GET_ACTIVE_ORDER);
    orderResultGuard.assertSuccess(activeOrder);
    expect(activeOrder.lines.length).toBe(1);
    expect(activeOrder.lines[0].quantity).toBe(2);
  });
  it("adjust item that passes interceptor check", async () => {
    const { adjustOrderLine } = await shopClient.query<
      CodegenShop.AdjustItemQuantityMutation,
      CodegenShop.AdjustItemQuantityMutationVariables
    >(ADJUST_ORDER_LINE, {
      orderLineId: "T_2",
      quantity: 5,
    });
    orderResultGuard.assertSuccess(adjustOrderLine);
    expect(adjustOrderLine.lines.length).toBe(1);
    expect(adjustOrderLine.lines[0].quantity).toBe(5);
  });
  it("willRemoveItemFromOrder with error", async () => {
    const { removeOrderLine } = await shopClient.query<
      CodegenShop.RemoveItemFromOrderMutation,
      CodegenShop.RemoveItemFromOrderMutationVariables
    >(REMOVE_ITEM_FROM_ORDER, {
      orderLineId: "T_2",
    });
    orderResultGuard.assertErrorResult(removeOrderLine);
    expect(removeOrderLine.message).toBe(
      "An error occurred when attempting to modify the Order",
    );
    expect(removeOrderLine.interceptorError).toBe("Cannot remove this item");
  });
  it("item was not removed", async () => {
    const { activeOrder } =
      await shopClient.query<CodegenShop.GetActiveOrderQuery>(GET_ACTIVE_ORDER);
    orderResultGuard.assertSuccess(activeOrder);
    expect(activeOrder.lines.length).toBe(1);
    expect(activeOrder.lines[0].quantity).toBe(5);
  });
  it("remove item that passes interceptor check", async () => {
    const { removeOrderLine } = await shopClient.query<
      CodegenShop.RemoveItemFromOrderMutation,
      CodegenShop.RemoveItemFromOrderMutationVariables
    >(
      REMOVE_ITEM_FROM_ORDER,
      {
        orderLineId: "T_2",
      },
      {
        overridden: 1,
      },
    );
    orderResultGuard.assertSuccess(removeOrderLine);
    expect(removeOrderLine.lines.length).toBe(0);
  });
  it("item was removed", async () => {
    const { activeOrder } =
      await shopClient.query<CodegenShop.GetActiveOrderQuery>(GET_ACTIVE_ORDER);
    orderResultGuard.assertSuccess(activeOrder);
    expect(activeOrder.lines.length).toBe(0);
  });
});
