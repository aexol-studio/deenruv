import {
  CustomCard,
  useDetailView,
  useLazyQuery,
} from "@deenruv/react-ui-devkit";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { GetReviewInfoForProductQuery } from "../graphql";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "../constants";

export const ReviewProductSidebar = () => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE, {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  const { entity } = useDetailView("products-detail-view");
  const [getInfo, { data }] = useLazyQuery(GetReviewInfoForProductQuery);
  useEffect(() => {
    if (entity?.id) {
      getInfo({ productId: entity.id });
    }
  }, [entity]);
  return (
    <CustomCard title="Opinie o produkcie" color="amber">
      <div className="text-sm mb-2">
        {data?.getReviewInfoForProduct?.averageRating
          ? `${t("productReviewSidebar.averageRating")}: ${data.getReviewInfoForProduct.averageRating.toFixed(1)}`
          : t("productReviewSidebar.noAverageRating")}
      </div>
      <div className="text-sm mb-2">
        {data?.getReviewInfoForProduct?.totalReviews
          ? `${t("productReviewSidebar.totalReviews")}: ${data.getReviewInfoForProduct.totalReviews}`
          : t("productReviewSidebar.noTotalReviews")}
      </div>
      <div className="text-sm mb-2">
        {data?.getReviewInfoForProduct?.totalRatings
          ? `${t("productReviewSidebar.totalRatings")}: ${data.getReviewInfoForProduct.totalRatings}`
          : t("productReviewSidebar.noTotalRatings")}
      </div>
      <Link
        to={`/admin-ui/extensions/reviews-plugin-ui?filter=%7B"productId"%3A%7B"eq"%3A"${entity?.id}"%7D%7D`}
        className="text-sm text-blue-500 hover:underline"
      >
        {t("productReviewSidebar.viewAllReviews")}
      </Link>
    </CustomCard>
  );
};
