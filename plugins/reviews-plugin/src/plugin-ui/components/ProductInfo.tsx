import React from "react";
import { ReviewDetail } from "../graphql";
import {
  Card,
  CardContent,
  CardHeader,
  Routes,
} from "@deenruv/react-ui-devkit";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "../constants";

export const ProductInfo = ({ review }: { review: ReviewDetail }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE, {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  if (!review.productVariant) return null;
  return (
    <Card className="w-full">
      <CardHeader>
        <p>{t("productInfo.productReview")}</p>
        <Link
          target="_blank"
          to={Routes.products.to(review.productVariant.product.id)}
        >
          <span className="text-sm text-blue-500 hover:underline">
            {t("productInfo.viewProduct")}
          </span>
        </Link>
      </CardHeader>
      <CardContent>
        <p>
          <strong>{t("productInfo.productId")}:</strong>{" "}
          {review.productVariant.product.id}
        </p>
        <p>
          <strong>{t("productInfo.productName")}:</strong>{" "}
          {review.productVariant.product.name}
        </p>
        <p>
          <strong>{t("productInfo.variantName")}:</strong>{" "}
          {review.productVariant.name}
        </p>
      </CardContent>
    </Card>
  );
};
