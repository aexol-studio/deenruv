"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/atoms/dialog";
import {
  AssetUploadButton,
  Button,
  ImagePlaceholder,
  Label,
  ScrollArea,
  SearchInput,
} from "@/components";
import { cn } from "@/lib/utils";
import { CircleX, ImageIcon, Plus, Search, Trash2 } from "lucide-react";
import { useCustomFields } from "@/custom_fields";
import { useList } from "@/hooks/useList";
import type { ResolverInputTypes } from "@deenruv/admin-types";
import {
  type CustomFieldSelectorsType,
  customFieldSelectors,
} from "@/selectors";
import { apiClient } from "@/zeus_client";
import { useDebounce, useTranslation } from "@/hooks";
import React from "react";

type CF = CustomFieldSelectorsType;

type CommonFields = {
  [K in keyof CF]: CF[K];
}[keyof CF];

export const ListRelationInput = <K extends keyof CF>({
  entityName,
}: {
  entityName: K;
}) => {
  const { t } = useTranslation("common");
  const [modalOpened, setModalOpened] = useState(false);
  const [selected, setSelected] = useState<CommonFields[]>([]);
  const [searchString, setSearchString] = useState<string>("");
  const debouncedSearch = useDebounce(searchString, 500);
  const { disabled, value, label, field, setValue } =
    useCustomFields<CommonFields[]>();

  const {
    objects: entities,
    Paginate,
    refetch,
    setFilterField,
  } = useList({
    route: async ({ page, perPage, filter }) => {
      const entities = await getEntities({
        skip: (page - 1) * perPage,
        take: perPage,
        ...(filter && { filter }),
      });
      return { items: entities.items, totalItems: entities.totalItems };
    },
    listType: `modal-assets-list`,
    options: { skip: !modalOpened },
  });

  const isAsset = (_value?: CommonFields): _value is CF["Asset"] =>
    entityName === "Asset";
  const isProduct = (_value?: CommonFields): _value is CF["Product"] =>
    entityName === "Product";
  const isProductVariant = (
    _value?: CommonFields,
  ): _value is CF["ProductVariant"] => entityName === "ProductVariant";

  const getImg = (value?: CommonFields) => {
    if (isAsset(value)) return value?.preview;
    if (isProduct(value)) return value?.featuredAsset?.preview;
    if (isProductVariant(value))
      return (
        value?.featuredAsset?.preview || value?.product?.featuredAsset?.preview
      );
  };

  const selectedIds = useMemo(() => selected?.map((el) => el.id), [selected]);

  useEffect(() => {
    if (debouncedSearch.length < 1) return;
    setFilterField("name", { contains: debouncedSearch });
  }, [debouncedSearch, setFilterField]);

  const onOpenChange = (open: boolean) => {
    setSelected(value || []);
    setModalOpened(open);
  };

  const getEntities = async (
    options: ResolverInputTypes["AssetListOptions"],
  ) => {
    const responseEntityField =
      entityName.charAt(0).toLowerCase() + entityName.slice(1) + "s";

    const { [responseEntityField]: response } = await apiClient("query")({
      [responseEntityField]: [
        { options },
        {
          totalItems: true,
          items: customFieldSelectors[entityName],
        },
      ],
      // eslint-disable-next-line
        } as any);
    return response as { items: CommonFields[]; totalItems: number };
  };

  return (
    <Dialog open={modalOpened} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label || field?.name}
        </Label>
        {!value?.length ? (
          <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
            <ImagePlaceholder />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {value.map((el) => {
              const img = getImg(el);
              return (
                <div
                  key={el.id}
                  className="group relative overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="relative aspect-square">
                    {!field?.readonly && (
                      <button
                        type="button"
                        className="absolute right-2 top-2 z-10 rounded-full bg-white p-1 opacity-0 shadow-md transition-opacity group-hover:opacity-100 dark:bg-gray-800"
                        onClick={(e) => {
                          e.stopPropagation();
                          setValue(value.filter((el2) => el.id !== el2.id));
                        }}
                        aria-label="Remove item"
                      >
                        <CircleX size={16} className="text-red-500" />
                      </button>
                    )}
                    {!img ? (
                      <div className="flex size-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <ImageIcon className="size-10 text-gray-400 dark:text-gray-500" />
                      </div>
                    ) : (
                      <img
                        src={img || "/placeholder.svg"}
                        alt={el.name}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-2">
                    {isProduct(el) && (
                      <span className="line-clamp-1 text-sm font-medium">
                        {el.name}
                      </span>
                    )}
                    {isProductVariant(el) && (
                      <>
                        <p className="line-clamp-1 text-sm font-medium">
                          {el.name}
                        </p>
                        <p className="line-clamp-1 text-xs text-muted-foreground">
                          {el.sku}
                        </p>
                      </>
                    )}
                    {isAsset(el) && (
                      <span className="line-clamp-1 text-sm font-medium">
                        {el.name}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {!field?.readonly && (
          <div className="flex gap-2">
            {!!value?.length && (
              <Button
                disabled={disabled}
                variant="destructive"
                size="sm"
                onClick={() => setValue([])}
                className="flex items-center gap-1"
              >
                <Trash2 className="size-4" />
                {t("custom-fields.clear")}
              </Button>
            )}
            <DialogTrigger asChild>
              <Button
                disabled={disabled}
                variant="secondary"
                size="sm"
                onClick={() => setModalOpened(true)}
                className="flex items-center gap-1"
              >
                <Plus className="size-4" />
                {t(`custom-fields.${entityName.toLowerCase()}.pick`)}
              </Button>
            </DialogTrigger>
          </div>
        )}
      </div>
      <DialogContent className="max-h-[90vh] max-w-[70vw] overflow-hidden rounded-lg border-0 shadow-lg md:max-w-[60vw] lg:max-w-[50vw]">
        <DialogHeader className="border-b border-gray-200 pb-4 dark:border-gray-700">
          <DialogTitle className="text-xl font-semibold">
            {t(`custom-fields.${entityName.toLowerCase()}.title`)}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            {t(`custom-fields.${entityName.toLowerCase()}.description`)}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <SearchInput
            searchString={searchString}
            setSearchString={setSearchString}
            placeholder={t("search.AssetFilterParameter.placeholder")}
          />
          <ScrollArea className="h-[50vh] pr-4">
            {!entities || entities.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <ImageIcon className="mb-2 size-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No {entityName.toLowerCase()} found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {entities?.map((entity) => {
                  const isSelected = selectedIds?.includes(entity.id);
                  const entityImg = getImg(entity);

                  return (
                    <div
                      key={entity.id}
                      className={cn(
                        "group cursor-pointer rounded-lg overflow-hidden border transition-all duration-200",
                        "hover:shadow-md hover:border-primary-400 dark:hover:border-primary-500",
                        isSelected
                          ? "border-primary-500 dark:border-primary-400 shadow-sm ring-2 ring-primary-200 dark:ring-primary-900"
                          : "border-gray-200 dark:border-gray-700",
                      )}
                      onClick={() => {
                        if (isSelected)
                          setSelected((prev) =>
                            prev?.filter((el) => el.id !== entity.id),
                          );
                        else setSelected((prev) => [...prev, entity]);
                      }}
                    >
                      <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                        {entityImg ? (
                          <img
                            src={entityImg || "/placeholder.svg"}
                            alt={entity.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center">
                            <ImageIcon className="size-8 text-gray-400 dark:text-gray-500" />
                          </div>
                        )}
                        {isSelected && (
                          <div className="bg-primary-500/20 absolute inset-0 flex items-center justify-center">
                            <div className="bg-primary-500 rounded-full p-1 text-white">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-white"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <span className="group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 text-sm font-medium">
                          {entity.name}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </div>
        <DialogFooter className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex w-full flex-col gap-3">
            <div className="flex justify-center">{Paginate}</div>
            <div className="flex justify-end gap-3">
              {entityName === "Asset" && (
                <AssetUploadButton refetch={refetch}>
                  <Plus className="size-4" />
                  {t("upload")}
                </AssetUploadButton>
              )}
              <Button
                onClick={() => {
                  if (selected) setValue(selected);
                  onOpenChange(false);
                }}
                variant={selected.length ? "action" : "secondary"}
                disabled={disabled}
                size="lg"
                className={cn(
                  "transition-all min-w-[100px]",
                  selected.length
                    ? "bg-primary-600 hover:bg-primary-700 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700",
                )}
              >
                {t("save")}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
