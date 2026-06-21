import { useMemo } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationPrevious,
  PaginationItem,
  PaginationEllipsis,
  PaginationLink,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  SimpleSelect,
} from "@/components";
import { arrayRange, ItemsPerPageType, SearchParamKey } from "./types";
import React from "react";
import { cn } from "@/lib";
import { PaginationInput } from "@/types";
import { useTranslation } from "@/hooks/useTranslation.js";

export const Paginate = ({
  itemsPerPage,
  searchParamValues,
  total,
  totalPages,
  searchParams,
  setSearchParams,
}: {
  itemsPerPage: ItemsPerPageType;
  searchParamValues: PaginationInput;
  total: number;
  totalPages: number;
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
}) => {
  const { t } = useTranslation("common");
  const pagesToShow: (number | string)[] = useMemo(
    () =>
      totalPages <= 7
        ? arrayRange(1, totalPages)
        : searchParamValues.page < 4
          ? [...arrayRange(1, 5), "ellipsis", totalPages]
          : searchParamValues.page >= totalPages - 2
            ? [1, "ellipsis", ...arrayRange(totalPages - 4, totalPages)]
            : [
                1,
                "ellipsis",
                ...arrayRange(
                  searchParamValues.page - 1,
                  searchParamValues.page + 1,
                ),
                "ellipsis",
                totalPages,
              ],
    [totalPages, searchParamValues],
  );

  return (
    <div className="flex w-full flex-wrap items-center justify-end gap-2 text-xs text-muted-foreground lg:gap-3">
      <div className="flex items-center gap-2 border border-border/60 bg-muted/30 px-2 py-1">
        <span className="whitespace-nowrap">{t("rowsPerPage")}</span>
        <SimpleSelect
          options={itemsPerPage.map((i) => ({
            value: i.value.toString(),
            label: t(`perPage.${i.name}`),
          }))}
          value={itemsPerPage
            .find((i) => i.value === searchParamValues.perPage)
            ?.value.toString()}
          onValueChange={(e) => {
            searchParams.set(SearchParamKey.PER_PAGE, e);
            searchParams.set(SearchParamKey.PAGE, "1");
            setSearchParams(searchParams);
          }}
          className="h-7 w-[112px] bg-card text-xs"
        />
      </div>
      <div className="inline-flex h-7 items-center whitespace-nowrap border border-border/60 bg-card px-3 text-center text-xs font-medium text-foreground">
        {t("page", { current: searchParamValues.page, total: totalPages })}
      </div>
      <Pagination className="mx-0 w-auto justify-end">
        <PaginationContent className="gap-0.5">
          <PaginationFirst
            className={cn(
              "h-7 min-w-7 border-border/70 bg-card px-0 opacity-100 hover:border-primary/30 hover:text-primary",
              searchParamValues.page === 1 && "cursor-not-allowed opacity-50",
            )}
            isActive={searchParamValues.page !== 1}
            onClick={() => {
              if (searchParamValues.page === 1) return;
              searchParams.set(SearchParamKey.PAGE, "1");
              setSearchParams(searchParams);
            }}
          />
          <PaginationPrevious
            className={cn(
              "h-7 min-w-7 border-border/70 bg-card px-0 opacity-100 hover:border-primary/30 hover:text-primary",
              searchParamValues.page === 1 && "cursor-not-allowed opacity-50",
            )}
            isActive={searchParamValues.page !== 1}
            onClick={() => {
              if (searchParamValues.page === 1) return;
              searchParams.set(
                SearchParamKey.PAGE,
                (searchParamValues.page - 1).toString(),
              );
              setSearchParams(searchParams);
            }}
          />
          {pagesToShow.map((i, index) => (
            <PaginationItem
              key={index}
              className={cn(
                "hidden min-w-7 select-none",
                i !== (searchParamValues.page - 1).toString() && "md:block",
              )}
            >
              {i === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  className="h-7 min-w-7 border-border/70 bg-card px-2 text-xs hover:border-primary/30 hover:text-primary"
                  isActive={i === searchParamValues.page}
                  onClick={() => {
                    searchParams.set(SearchParamKey.PAGE, i.toString());
                    setSearchParams(searchParams);
                  }}
                >
                  {i}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationNext
            className={cn(
              "h-7 min-w-7 border-border/70 bg-card px-0 opacity-100 hover:border-primary/30 hover:text-primary",
              searchParamValues.page === totalPages &&
                "cursor-not-allowed opacity-50",
            )}
            isActive={searchParamValues.page !== totalPages}
            onClick={() => {
              if (searchParamValues.page === totalPages) return;
              searchParams.set(
                SearchParamKey.PAGE,
                (searchParamValues.page + 1).toString(),
              );
              setSearchParams(searchParams);
            }}
          />
          <PaginationLast
            className={cn(
              "h-7 min-w-7 border-border/70 bg-card px-0 opacity-100 hover:border-primary/30 hover:text-primary",
              searchParamValues.page === totalPages &&
                "cursor-not-allowed opacity-50",
            )}
            isActive={searchParamValues.page !== totalPages}
            onClick={() => {
              if (searchParamValues.page === totalPages) return;
              searchParams.set(SearchParamKey.PAGE, totalPages.toString());
              setSearchParams(searchParams);
            }}
          />
        </PaginationContent>
      </Pagination>
    </div>
  );
};
