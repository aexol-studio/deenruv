import { describe, expect, it, vi } from "vitest";
import {
  allocateRefund,
  assertMutationSuccess,
  buildRefundMutationInputs,
  buildCancellationMutationInput,
  executeCancellationAndRefunds,
  getRefundedQuantities,
  getRefundablePayments,
  getOrderRefundOutcome,
  planOrderRefund,
} from "./order-refund.js";

const lines = [
  {
    id: "b",
    maxRefundQuantity: 3,
    maxCancelQuantity: 3,
    unitPriceWithTax: 200,
  },
  {
    id: "a",
    maxRefundQuantity: 2,
    maxCancelQuantity: 2,
    unitPriceWithTax: 100,
  },
];

describe("order refund planning", () => {
  it("uses IDs rather than selection order and adds shipping", () => {
    const plan = planOrderRefund({
      lines,
      selections: {
        a: { refundQuantity: 2, cancelQuantity: 0 },
        b: { refundQuantity: 1, cancelQuantity: 1 },
      },
      shippingAmount: 50,
      cancelShipping: false,
      reason: "Customer request",
      capacities: [{ paymentId: "p1", capacity: 1000 }],
    });
    expect(plan.itemAmount).toBe(400);
    expect(plan.totalAmount).toBe(450);
    expect(plan.refundLines).toEqual([
      { orderLineId: "b", quantity: 1 },
      { orderLineId: "a", quantity: 2 },
    ]);
    expect(plan.cancelLines).toEqual([{ orderLineId: "b", quantity: 1 }]);
  });

  it("supports cancellation-only and refund-only plans", () => {
    expect(
      planOrderRefund({
        lines,
        selections: { a: { refundQuantity: 0, cancelQuantity: 1 } },
        shippingAmount: 0,
        cancelShipping: false,
        reason: "reason",
        capacities: [],
      }).allocations,
    ).toEqual([]);
    expect(
      planOrderRefund({
        lines,
        selections: { b: { refundQuantity: 1, cancelQuantity: 0 } },
        shippingAmount: 0,
        cancelShipping: false,
        reason: "reason",
        capacities: [{ paymentId: "p", capacity: 200 }],
      }).cancelLines,
    ).toEqual([]);
  });

  it("rejects shipping cancellation without cancellation lines", () => {
    expect(() =>
      planOrderRefund({
        lines,
        selections: {},
        shippingAmount: 0,
        cancelShipping: true,
        reason: "reason",
        capacities: [],
      }),
    ).toThrow("Select at least one line");
  });

  it("subtracts non-failed refunds and allocates deterministically across settled payments", () => {
    const capacities = getRefundablePayments([
      {
        id: "p1",
        amount: 500,
        state: "Settled",
        refunds: [{ state: "Settled", total: 300 }],
      },
      {
        id: "p2",
        amount: 400,
        state: "Settled",
        refunds: [{ state: "Failed", total: 400 }],
      },
      { id: "p3", amount: 900, state: "Authorized", refunds: [] },
    ]);
    expect(capacities).toEqual([
      { paymentId: "p1", capacity: 200 },
      { paymentId: "p2", capacity: 400 },
    ]);
    expect(allocateRefund(550, capacities)).toEqual([
      { paymentId: "p1", amount: 200 },
      { paymentId: "p2", amount: 350 },
    ]);
  });

  it("counts refunded line quantities by ID and ignores failed refunds", () => {
    expect(
      getRefundedQuantities([
        {
          refunds: [
            { state: "Settled", lines: [{ orderLineId: "a", quantity: 2 }] },
            { state: "Failed", lines: [{ orderLineId: "a", quantity: 10 }] },
          ],
        },
      ]),
    ).toEqual({ a: 2 });
  });

  it("validates quantities, capacity, reason, and explicit allocations", () => {
    expect(() =>
      allocateRefund(101, [{ paymentId: "p", capacity: 100 }]),
    ).toThrow("capacity");
    expect(() =>
      allocateRefund(
        100,
        [{ paymentId: "p", capacity: 100 }],
        [{ paymentId: "p", amount: 99 }],
      ),
    ).toThrow("equal");
    expect(() =>
      planOrderRefund({
        lines,
        selections: { a: { refundQuantity: 2.5, cancelQuantity: 0 } },
        shippingAmount: 0,
        cancelShipping: false,
        reason: " ",
        capacities: [],
      }),
    ).toThrow("reason");
    expect(() =>
      planOrderRefund({
        lines,
        selections: { a: { refundQuantity: 2.5, cancelQuantity: 0 } },
        shippingAmount: 0,
        cancelShipping: false,
        reason: "reason",
        capacities: [{ paymentId: "p", capacity: 1000 }],
      }),
    ).toThrow("whole numbers");
  });
});

describe("order refund execution", () => {
  it("rejects empty cancellation lines and preserves supported line cancellation", () => {
    expect(() =>
      buildCancellationMutationInput({
        cancelShipping: true,
        cancelLines: [],
        reason: "reason",
      }),
    ).toThrow("Select at least one line");
    expect(
      buildCancellationMutationInput({
        cancelShipping: true,
        cancelLines: [{ orderLineId: "line", quantity: 2 }],
        reason: "reason",
      }),
    ).toEqual({
      cancelShipping: true,
      lines: [{ orderLineId: "line", quantity: 2 }],
      reason: "reason",
    });
  });

  it("passes supported line and shipping cancellation through execution", async () => {
    const cancel = vi.fn(async () => "cancelled");
    const cancellationInput = buildCancellationMutationInput({
      cancelShipping: true,
      cancelLines: [{ orderLineId: "line", quantity: 1 }],
      reason: "reason",
    });
    await executeCancellationAndRefunds({
      cancel: () => cancel(cancellationInput),
      refunds: [],
    });
    expect(cancel).toHaveBeenCalledWith({
      cancelShipping: true,
      lines: [{ orderLineId: "line", quantity: 1 }],
      reason: "reason",
    });
  });

  it("derives cancellation-only, refund-only, and combined outcomes", () => {
    expect(
      getOrderRefundOutcome({ hasCancellation: true, hasRefund: false }),
    ).toBe("cancellation");
    expect(
      getOrderRefundOutcome({ hasCancellation: false, hasRefund: true }),
    ).toBe("refund");
    expect(
      getOrderRefundOutcome({ hasCancellation: true, hasRefund: true }),
    ).toBe("combined");
  });
  it("persists aggregate line, shipping, and adjustment metadata exactly once", () => {
    expect(
      buildRefundMutationInputs({
        allocations: [
          { paymentId: "p1", amount: 200 },
          { paymentId: "p2", amount: 350 },
        ],
        refundLines: [{ orderLineId: "line", quantity: 2 }],
        reason: "reason",
        shipping: 50,
        adjustment: 25,
      }),
    ).toEqual([
      {
        paymentId: "p1",
        amount: 200,
        lines: [{ orderLineId: "line", quantity: 2 }],
        reason: "reason",
        shipping: 50,
        adjustment: 25,
      },
      {
        paymentId: "p2",
        amount: 350,
        lines: [],
        reason: "reason",
        shipping: 0,
        adjustment: 0,
      },
    ]);
  });
  it("rejects every application-error union result", () => {
    expect(() =>
      assertMutationSuccess(
        { __typename: "QuantityTooGreatError", message: "too many" },
        "Order",
      ),
    ).toThrow("too many");
    expect(assertMutationSuccess({ __typename: "Refund" }, "Refund")).toEqual({
      __typename: "Refund",
    });
  });
  it("runs cancellation before refunds and stops after cancellation failure", async () => {
    const refund = vi.fn(async () => "refund");
    await expect(
      executeCancellationAndRefunds({
        cancel: async () => {
          throw new Error("cancel failed");
        },
        refunds: [refund],
      }),
    ).rejects.toThrow("cancel failed");
    expect(refund).not.toHaveBeenCalled();
  });

  it("runs combined operations sequentially", async () => {
    const order: string[] = [];
    await executeCancellationAndRefunds({
      cancel: async () => (order.push("cancel"), "cancel"),
      refunds: [
        async () => (order.push("refund-1"), "refund-1"),
        async () => (order.push("refund-2"), "refund-2"),
      ],
    });
    expect(order).toEqual(["cancel", "refund-1", "refund-2"]);
  });
});
