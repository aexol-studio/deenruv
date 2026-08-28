"use client";

import {
  buttonVariants,
  Card,
  CardContent,
  CardHeader,
  DialogProductPicker,
  Routes,
  ScrollArea,
  useDetailView,
  useLazyQuery,
  useMutation,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import React, { useEffect, useState } from "react";
import { QUERIES } from "../graphql/queries";
import { MUTATIONS } from "../graphql/mutations";
import { toast } from "sonner";
import { Loader2, PlusCircle, XIcon } from "lucide-react";
import { translationNS } from "../translation-ns";

export const UpsellSelect = () => {
  const { t } = useTranslation(translationNS);
  const { id } = useDetailView("products-detail-view");
  const [run, { data, loading }] = useLazyQuery(QUERIES["GET_UPSELLS"]);
  const [createUpsell] = useMutation(MUTATIONS["CREATE_UPSELL"]);
  const [deleteUpsell] = useMutation(MUTATIONS["DELETE_UPSELL"]);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const onSingleDelete = async (upsellProductID: string) => {
    if (!id) {
      toast.error(t("toast.noProduct"));
      return;
    }

    setDeletingIds((prev) => [...prev, upsellProductID]);

    try {
      await deleteUpsell({
        input: [{ baseProductID: id, upsellProductID }],
      });
      run({ productID: id });
      toast.success(t("toast.removed"));
    } catch {
      toast.error(t("toast.removeFailed"));
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== upsellProductID));
    }
  };

  useEffect(() => {
    if (id) run({ productID: id });
  }, [id]);

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t("title")}</h3>
          <DialogProductPicker
            initialValue={data?.upsellProducts.map((p) => p.id) || []}
            mode="product"
            multiple
            onSubmit={async (result) => {
              if (!id) {
                toast.error(t("toast.noProduct"));
                return;
              }
              if (!result) {
                toast.info(t("toast.selectionCanceled"));
                return;
              }
              const selectedIds = result.map((p) => p.productId);
              const toDelete = data?.upsellProducts
                .filter((p) => !selectedIds.includes(p.id))
                .map((p) => p.id);
              const toAdd = selectedIds.filter((id) =>
                data?.upsellProducts.every((p) => p.id !== id),
              );
              try {
                if (toDelete?.length) {
                  await deleteUpsell({
                    input: toDelete.map((upsellProductID) => ({
                      baseProductID: id,
                      upsellProductID,
                    })),
                  });
                }
                if (toAdd.length) {
                  await createUpsell({
                    input: toAdd.map((upsellProductID) => ({
                      baseProductID: id,
                      upsellProductID,
                    })),
                  });
                }
                toast.success(t("toast.updated"));
              } catch {
                toast.error(t("toast.updateFailed"));
              }
              run({ productID: id });
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading ? (
          <div
            className="flex h-[400px] items-center justify-center"
            role="status"
            aria-label={t("loading")}
          >
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            {data?.upsellProducts?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {data.upsellProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-md"
                  >
                    <div className="relative aspect-square overflow-hidden bg-muted/20">
                      {product.featuredAsset?.preview ? (
                        <img
                          src={
                            product.featuredAsset.preview || "/placeholder.svg"
                          }
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted/30 text-muted-foreground">
                          {t("noImage")}
                        </div>
                      )}
                      <button
                        className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-destructive opacity-0 shadow-sm transition-opacity hover:bg-destructive hover:text-destructive-foreground focus:opacity-100 group-hover:opacity-100"
                        onClick={() => onSingleDelete(product.id)}
                        disabled={deletingIds.includes(product.id)}
                        aria-label={t("removeAria")}
                      >
                        {deletingIds.includes(product.id) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XIcon className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex flex-1 flex-col p-3">
                      <h4
                        className="line-clamp-2 font-medium leading-tight text-sm mb-3"
                        title={product.name}
                      >
                        {product.name}
                      </h4>
                      <div className="mt-auto">
                        <a
                          href={Routes.products.to(product.id)}
                          target="_blank"
                          className={buttonVariants({
                            variant: "secondary",
                            size: "sm",
                            className: "w-full text-xs",
                          })}
                          rel="noreferrer"
                        >
                          {t("viewProduct")}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/20 p-8 text-center">
                <div className="rounded-full bg-muted/30 p-3">
                  <PlusCircle className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">{t("empty.title")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("empty.description")}
                </p>
              </div>
            )}
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
