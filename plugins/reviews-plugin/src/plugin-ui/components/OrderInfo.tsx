import React from "react";
import { ReviewDetail } from "../graphql";
import {
  Card,
  CardContent,
  CardHeader,
  priceFormatter,
  Routes,
} from "@deenruv/react-ui-devkit";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "../constants";
export const OrderInfo = ({ review }: { review: ReviewDetail }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE, {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  if (!review.order) return null;
  return (
    <Card className="w-full">
      <CardHeader>
        <p>{t("orderInfo.orderReview")}</p>
        <Link target="_blank" to={Routes.orders.to(review.order.id)}>
          <span className="text-sm text-blue-500 hover:underline">
            {t("orderInfo.viewOrder")}
          </span>
        </Link>
      </CardHeader>
      <CardContent>
        <p>
          <strong>{t("orderInfo.orderId")}:</strong> {review.order.id}
        </p>
        <p>
          <strong>{t("orderInfo.orderCode")}:</strong> {review.order.code}
        </p>
        <p>
          <strong>{t("orderInfo.orderTotal")}:</strong>{" "}
          {priceFormatter(review.order.totalWithTax, review.order.currencyCode)}
        </p>
        <p>
          <strong>{t("orderInfo.totalItems")}:</strong>{" "}
          {review.order.totalQuantity}
        </p>
      </CardContent>
    </Card>
  );
};
