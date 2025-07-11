import {
  CardContent,
  CardHeader,
  CardTitle,
  CustomCard,
  formatDate,
  useLazyQuery,
  Badge,
  useOrder,
} from "@deenruv/react-ui-devkit";
import React, { useEffect } from "react";
import { GetReviewForOrderQuery } from "../graphql";
import { Calendar, MessageSquare, Star } from "lucide-react";
import { ReviewState } from "../zeus";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "../constants";

const StarRating = ({
  rating,
  maxRating = 5,
}: {
  rating: number;
  maxRating?: number;
}) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxRating }, (_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        {rating} / {maxRating}
      </span>
    </div>
  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case ReviewState.ACCEPTED:
      return "bg-green-100 text-green-800 border-green-200";
    case ReviewState.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case ReviewState.DECLINED:
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const ReviewOrder = () => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE, {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  const { order } = useOrder();
  const [getReviewForOrder, { data }] = useLazyQuery(GetReviewForOrderQuery);

  useEffect(() => {
    if (!order) return;
    getReviewForOrder({ orderId: order.id });
  }, [order]);

  if (!order || !data?.getReviewForOrder) return null;

  return (
    <CustomCard
      title={t("reviewOrder.title", { orderId: order.id })}
      color="orange"
    >
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-orange-500" />
              {t("reviewOrder.titleWithId", { orderId: order.id })}
            </CardTitle>
          </div>
          <Badge className={getStatusColor(data.getReviewForOrder.state)}>
            {data.getReviewForOrder.state}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 p-0">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <StarRating rating={data.getReviewForOrder.rating} />
          </div>

          <div className="space-y-2">
            <p className="text-sm leading-relaxed text-foreground">
              {data.getReviewForOrder.body}
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2 border-t text-xs text-muted-foreground">
            {data.getReviewForOrder.createdAt && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(data.getReviewForOrder.createdAt)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </CustomCard>
  );
};
