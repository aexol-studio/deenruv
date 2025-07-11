import {
  Badge,
  CLOSED_WITHOUT_RESOLUTION,
  createDialogFromComponent,
  DetailList,
  formatDate,
  useDetailView,
  useLazyQuery,
  useMutation,
} from "@deenruv/react-ui-devkit";
import React from "react";
import {
  ChangeReviewsStateMutation,
  ChangeReviewStateMutation,
  ListReviewQuery,
} from "../graphql";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "../constants.js";
import { REVIEWS_ROUTES } from "../index.js";
import { ReplaceAllIcon, ReplaceIcon } from "lucide-react";
import { ReviewState, SortOrder } from "../zeus";
import { UniversalSelectDialog } from "./UniversalSelectDialog";

export const ReviewCustomer = () => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE, {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  const [fetch] = useLazyQuery(ListReviewQuery);
  const [changeReviewState] = useMutation(ChangeReviewStateMutation);
  const [changeReviewsState] = useMutation(ChangeReviewsStateMutation);
  const { id } = useDetailView("customers-detail-view");
  return (
    <DetailList
      entityName="Review"
      tableId="reviews-list-view"
      filterFields={[
        {
          key: "productId",
          operator: "IDOperators",
          translation: t("list.productId"),
        },
        {
          key: "orderId",
          operator: "IDOperators",
          translation: t("list.orderId"),
        },
      ]}
      createPermissions={[]}
      deletePermissions={[]}
      detailLinkColumn={"id"}
      noCreateButton
      route={REVIEWS_ROUTES}
      hideColumns={["product", "order"]}
      suggestedOrderColumns={{
        reviewFor: 1,
        rating: 2,
        state: 3,
      }}
      additionalBulkActions={[
        {
          label: t("list.bulkStateChange"),
          icon: <ReplaceAllIcon className="w-4 h-4" />,
          onClick: async ({ table }) => {
            try {
              const ids = Object.entries(table.getState().rowSelection)
                .map(([key, value]) => {
                  if (value) return key;
                })
                .filter(Boolean) as string[];
              if (ids.length === 0) {
                throw new Error(t("dialog.bulkStateChangeNoSelection"));
              }
              const { value } = await createDialogFromComponent(
                UniversalSelectDialog<ReviewState>,
                {
                  title: t("dialog.bulkStateChangeTitle"),
                  description: t("dialog.bulkStateChangeDescription"),
                  selectLabel: t("dialog.bulkStateChangeSelectLabel"),
                  selectPlaceholder: t(
                    "dialog.bulkStateChangeSelectPlaceholder",
                  ),
                  options: [
                    { label: t("state.accepted"), value: ReviewState.ACCEPTED },
                    { label: t("state.declined"), value: ReviewState.DECLINED },
                  ],
                },
              );
              await changeReviewsState({
                input: ids.map((id) => ({ id, state: value })),
              });
              return { success: t("dialog.bulkStateChangeSuccess") };
            } catch (e) {
              const message = e instanceof Error ? e.message : e;
              if (
                typeof message === "string" &&
                message.includes(CLOSED_WITHOUT_RESOLUTION)
              ) {
                return { info: t("dialog.bulkStateChangeCancelled") };
              }
              return { error: t("dialog.bulkStateChangeError") };
            }
          },
        },
      ]}
      additionalRowActions={[
        {
          label: t("list.stateChange"),
          icon: <ReplaceIcon className="w-4 h-4" />,
          onClick: async ({ row }) => {
            try {
              if (!row.original.id) {
                throw new Error(t("dialog.singleStateChangeNoSelection"));
              }
              const { value } = await createDialogFromComponent(
                UniversalSelectDialog<ReviewState>,
                {
                  title: t("dialog.singleStateChangeTitle"),
                  description: t("dialog.singleStateChangeDescription"),
                  selectLabel: t("dialog.singleStateChangeSelectLabel"),
                  selectPlaceholder: t(
                    "dialog.singleStateChangeSelectPlaceholder",
                  ),
                  options: [
                    { label: t("state.accepted"), value: ReviewState.ACCEPTED },
                    { label: t("state.declined"), value: ReviewState.DECLINED },
                  ],
                },
              );
              await changeReviewState({
                input: { id: row.original.id, state: value },
              });
              return { success: t("dialog.singleStateChangeSuccess") };
            } catch (e) {
              const message = e instanceof Error ? e.message : e;
              if (
                typeof message === "string" &&
                message.includes(CLOSED_WITHOUT_RESOLUTION)
              ) {
                return { info: t("dialog.singleStateChangeCancelled") };
              }
              return { error: t("dialog.singleStateChangeError") };
            }
          },
        },
      ]}
      additionalColumns={[
        {
          accessorKey: "reviewFor",
          header: t("list.reviewFor"),
          cell: ({ row }) => {
            const product = row.original.product;
            const order = row.original.order;
            return (
              <div>
                {product ? (
                  <Badge variant="secondary">{product.name}</Badge>
                ) : order ? (
                  <Badge variant="secondary">
                    {t("list.orderReview", { orderId: order.id })}
                  </Badge>
                ) : (
                  <Badge>{t("list.shopReview")}</Badge>
                )}
              </div>
            );
          },
        },
        {
          accessorKey: "responseCreatedAt",
          header: t("list.responseCreatedAt"),
          cell: ({ row }) => {
            const responseCreatedAt = row.original.responseCreatedAt;
            return (
              <div>
                {responseCreatedAt
                  ? t("list.responseCreatedAtValue", {
                      date: formatDate(responseCreatedAt),
                    })
                  : t("list.noResponse")}
              </div>
            );
          },
        },
        {
          accessorKey: "state",
          header: t("list.state"),
          cell: ({ row }) => {
            let variant: "default" | "success" | "destructive" = "default";
            if (row.original.state === ReviewState.ACCEPTED) {
              variant = "success";
            }
            if (row.original.state === ReviewState.DECLINED) {
              variant = "destructive";
            }
            return (
              <Badge variant={variant}>
                {t(`state.${row.original.state.toLowerCase()}`)}
              </Badge>
            );
          },
        },
        {
          accessorKey: "rating",
          header: t("list.rating"),
          cell: ({ row }) => {
            const rating = row.original.rating;
            return (
              <div>
                {Array.from({ length: 5 }, (_, index) => (
                  <span
                    key={index}
                    style={{ color: index < rating ? "gold" : "gray" }}
                  >
                    ★
                  </span>
                ))}
              </div>
            );
          },
        },
      ]}
      fetch={async ({
        page,
        perPage,
        filter,
        filterOperator: operator,
        sort,
      }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filterOperator = operator as any;
        const { listReviews } = await fetch({
          options: {
            take: perPage,
            skip: (page - 1) * perPage,
            sort: sort
              ? { [sort.key]: sort.sortDir }
              : { createdAt: SortOrder.DESC },
            ...(filterOperator && { filterOperator }),
            filter: { ...filter, customerId: { eq: id } },
          },
        });
        return listReviews;
      }}
    />
  );
};
