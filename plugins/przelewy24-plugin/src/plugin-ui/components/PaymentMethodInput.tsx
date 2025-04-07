import React, { useMemo } from "react";
import {
  useCustomFields,
  useLazyQuery,
  useOrder,
} from "@deenruv/react-ui-devkit";
import { toast } from "sonner";
import { REMINDER } from "../graphql/queries.js";

export const PaymentMethodInput = () => {
  const { label, value, field } = useCustomFields();
  const { order } = useOrder();
  const [remind] = useLazyQuery(REMINDER);

  const paymentURL = useMemo(() => {
    if (!value) return;
    const payment = order?.payments?.find(
      (payment) => payment.method === "przelewy-24",
    );
    if (!payment || !payment.metadata || payment.metadata.public) return null;
    return "paymentUrl" in payment.metadata.public
      ? payment.metadata.public.paymentUrl
      : null;
  }, [order?.payments]);

  const copyToClipboard = () => {
    try {
      if (!paymentURL) {
        throw new Error("No payment URL");
      }
      navigator.clipboard.writeText(paymentURL);
      toast.success("Link płatności został skopiowany");
    } catch (e) {
      toast.error("Nie udało się skopiować linku płatności");
    }
  };

  const reminder = async () => {
    try {
      if (!order?.id) {
        throw new Error("No order ID");
      }
      const { remindPrzelewy24 } = await remind({ orderId: order.id });
      if (!remindPrzelewy24) {
        throw new Error("No reminder");
      }
      toast.success("Przypomnienie zostało wysłane");
    } catch (error) {
      toast.error("Nie udało się wysłać przypomnienia");
    }
  };

  if (!field || !order) {
    return null;
  }

  if (!paymentURL) {
    return (
      <div className="flex flex-col gap-2">
        <span>{label}</span>
        <span>Brak linku płatności</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div style={{ width: "100%" }} className="flex flex-col gap-2">
        <div
          style={{
            padding: "0.5rem",
            backgroundColor: "#f0f0f0",
            borderRadius: "4px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {paymentURL}
        </div>
        <div className="flex justify-end">
          <button
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="button primary"
            onClick={copyToClipboard}
          >
            Skopiuj link płatności
          </button>
        </div>
        <div
          style={{ width: "100%" }}
          className="flex flex-col gap-2 border border-[var(--color-card-border)] p-2"
        >
          <span>Poinformuj klienta o zaległej lub nieopłaconej płatności</span>
          <div className="flex justify-start">
            <button
              onClick={reminder}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              className="button primary"
            >
              Wyślij email z przypomnieniem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
