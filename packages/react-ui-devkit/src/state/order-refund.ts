export interface RefundLineSource {
  id: string;
  maxRefundQuantity: number;
  maxCancelQuantity: number;
  unitPriceWithTax: number;
}

export interface RefundLineSelection {
  refundQuantity: number;
  cancelQuantity: number;
}

export interface RefundPaymentSource {
  id: string;
  amount: number;
  state: string;
  refunds: Array<{ state: string; total: number }>;
}

export interface RefundAllocation {
  paymentId: string;
  amount: number;
}

export interface OrderRefundPlan {
  cancelLines: Array<{ orderLineId: string; quantity: number }>;
  refundLines: Array<{ orderLineId: string; quantity: number }>;
  itemAmount: number;
  totalAmount: number;
  allocations: RefundAllocation[];
  cancelShipping: boolean;
}

export interface RefundMutationInput {
  paymentId: string;
  amount: number;
  lines: Array<{ orderLineId: string; quantity: number }>;
  reason: string;
  shipping: number;
  adjustment: number;
}

export type OrderRefundOutcome = "cancellation" | "refund" | "combined";

export interface CancellationMutationInput {
  cancelShipping: boolean;
  lines: Array<{ orderLineId: string; quantity: number }>;
  reason: string;
}

export const buildCancellationMutationInput = (input: {
  cancelShipping: boolean;
  cancelLines: Array<{ orderLineId: string; quantity: number }>;
  reason: string;
}): CancellationMutationInput => {
  if (input.cancelLines.length === 0) {
    throw new Error("Select at least one line before cancelling shipping");
  }
  return {
    cancelShipping: input.cancelShipping,
    lines: input.cancelLines,
    reason: input.reason,
  };
};

export const getOrderRefundOutcome = (input: {
  hasCancellation: boolean;
  hasRefund: boolean;
}): OrderRefundOutcome =>
  input.hasRefund
    ? input.hasCancellation
      ? "combined"
      : "refund"
    : "cancellation";

export const assertMutationSuccess = <
  T extends { __typename?: string; message?: string },
>(
  result: T,
  successType: string,
): T => {
  if (result.__typename !== successType) {
    throw new Error(
      result.message || `Unexpected ${result.__typename || "mutation"} result`,
    );
  }
  return result;
};

export const getRefundablePayments = (payments: RefundPaymentSource[]) =>
  payments
    .filter((payment) => payment.state === "Settled")
    .map((payment) => ({
      paymentId: payment.id,
      capacity: Math.max(
        0,
        payment.amount -
          payment.refunds
            .filter((refund) => refund.state !== "Failed")
            .reduce((total, refund) => total + refund.total, 0),
      ),
    }))
    .filter((payment) => payment.capacity > 0);

export const getRefundedQuantities = (
  payments: Array<{
    refunds: Array<{
      state: string;
      lines: Array<{ orderLineId: string; quantity: number }>;
    }>;
  }>,
): Record<string, number> => {
  const quantities: Record<string, number> = {};
  for (const payment of payments) {
    for (const refund of payment.refunds) {
      if (refund.state === "Failed") continue;
      for (const line of refund.lines) {
        quantities[line.orderLineId] =
          (quantities[line.orderLineId] ?? 0) + line.quantity;
      }
    }
  }
  return quantities;
};

export const allocateRefund = (
  amount: number,
  capacities: Array<{ paymentId: string; capacity: number }>,
  overrides?: RefundAllocation[],
): RefundAllocation[] => {
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Refund amount must be a positive integer");
  }
  const capacityByPayment = new Map(
    capacities.map((payment) => [payment.paymentId, payment.capacity]),
  );
  if (overrides) {
    const seen = new Set<string>();
    let allocated = 0;
    for (const allocation of overrides) {
      const capacity = capacityByPayment.get(allocation.paymentId);
      if (
        seen.has(allocation.paymentId) ||
        capacity === undefined ||
        !Number.isInteger(allocation.amount) ||
        allocation.amount <= 0 ||
        allocation.amount > capacity
      ) {
        throw new Error("Refund allocation exceeds payment capacity");
      }
      seen.add(allocation.paymentId);
      allocated += allocation.amount;
    }
    if (allocated !== amount)
      throw new Error("Refund allocations must equal the refund amount");
    return overrides.map((allocation) => ({ ...allocation }));
  }

  let remaining = amount;
  const allocations: RefundAllocation[] = [];
  for (const payment of capacities) {
    const allocated = Math.min(payment.capacity, remaining);
    if (allocated > 0)
      allocations.push({ paymentId: payment.paymentId, amount: allocated });
    remaining -= allocated;
    if (remaining === 0) break;
  }
  if (remaining > 0)
    throw new Error("Refund amount exceeds settled payment capacity");
  return allocations;
};

export const planOrderRefund = (input: {
  lines: RefundLineSource[];
  selections: Record<string, RefundLineSelection>;
  shippingAmount: number;
  cancelShipping: boolean;
  reason: string;
  capacities: Array<{ paymentId: string; capacity: number }>;
  amountOverride?: number;
  allocationOverrides?: RefundAllocation[];
}): OrderRefundPlan => {
  if (!input.reason.trim()) throw new Error("A reason is required");
  const cancelLines: OrderRefundPlan["cancelLines"] = [];
  const refundLines: OrderRefundPlan["refundLines"] = [];
  let itemAmount = 0;
  for (const line of input.lines) {
    const selection = input.selections[line.id] ?? {
      refundQuantity: 0,
      cancelQuantity: 0,
    };
    for (const [quantity, maximum] of [
      [selection.refundQuantity, line.maxRefundQuantity],
      [selection.cancelQuantity, line.maxCancelQuantity],
    ]) {
      if (!Number.isInteger(quantity) || quantity < 0 || quantity > maximum) {
        throw new Error(
          "Line quantities must be whole numbers within the available range",
        );
      }
    }
    if (selection.refundQuantity > 0) {
      refundLines.push({
        orderLineId: line.id,
        quantity: selection.refundQuantity,
      });
      itemAmount += line.unitPriceWithTax * selection.refundQuantity;
    }
    if (selection.cancelQuantity > 0) {
      cancelLines.push({
        orderLineId: line.id,
        quantity: selection.cancelQuantity,
      });
    }
  }
  if (!Number.isInteger(input.shippingAmount) || input.shippingAmount < 0) {
    throw new Error("Shipping refund must be a non-negative integer");
  }
  const totalAmount = input.amountOverride ?? itemAmount + input.shippingAmount;
  if (!Number.isInteger(totalAmount) || totalAmount < 0)
    throw new Error("Refund amount must be a non-negative integer");
  const allocations =
    totalAmount > 0
      ? allocateRefund(totalAmount, input.capacities, input.allocationOverrides)
      : [];
  if (input.cancelShipping && cancelLines.length === 0) {
    throw new Error("Select at least one line before cancelling shipping");
  }
  if (cancelLines.length === 0 && totalAmount === 0)
    throw new Error("Select a cancellation or refund");
  return {
    cancelLines,
    refundLines,
    itemAmount,
    totalAmount,
    allocations,
    cancelShipping: input.cancelShipping,
  };
};

export const buildRefundMutationInputs = (input: {
  allocations: RefundAllocation[];
  refundLines: Array<{ orderLineId: string; quantity: number }>;
  reason: string;
  shipping: number;
  adjustment: number;
}): RefundMutationInput[] =>
  input.allocations.map((allocation, index) => ({
    paymentId: allocation.paymentId,
    amount: allocation.amount,
    lines: index === 0 ? input.refundLines : [],
    reason: input.reason,
    shipping: index === 0 ? input.shipping : 0,
    adjustment: index === 0 ? input.adjustment : 0,
  }));

export const executeCancellationAndRefunds = async <T>(input: {
  cancel?: () => Promise<T>;
  refunds: Array<() => Promise<T>>;
}): Promise<T[]> => {
  const results: T[] = [];
  if (input.cancel) results.push(await input.cancel());
  for (const refund of input.refunds) results.push(await refund());
  return results;
};
