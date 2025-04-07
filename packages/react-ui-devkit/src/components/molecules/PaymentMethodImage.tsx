import { useTranslation } from "@/hooks/useTranslation.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "..";
import { Banknote, CircleDollarSign, CreditCard } from "lucide-react";
import React, { useMemo } from "react";

export const PaymentMethodImage: React.FC<{ paymentType: string }> = ({
  paymentType,
}) => {
  const { t } = useTranslation("common");

  const paymentIcon = useMemo(() => {
    switch (paymentType) {
      case "transfer":
        return <CreditCard />;
      case "standard-payment":
        return <Banknote />;
      default:
        return <CircleDollarSign />;
    }
  }, [paymentType]);

  return paymentType ? (
    <Tooltip>
      <TooltipTrigger>{paymentIcon}</TooltipTrigger>
      <TooltipContent>{t(`paymentMethods.${paymentType}`)}</TooltipContent>
    </Tooltip>
  ) : (
    <></>
  );
};
