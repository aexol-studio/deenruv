"use client";

import {
  AssetUploadButton,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ImagePlaceholder,
  Label,
  ScrollArea,
} from "@/components/atoms";
import { SearchInput } from "@/components/molecules/SearchInput";
import { useCustomFields } from "@/custom_fields";
import { useTranslation } from "@/hooks/useTranslation.js";
import { cn } from "@/lib";
import type { CustomFieldSelectorsType } from "@/selectors";
import { Check, ImageIcon } from "lucide-react";
import React from "react";
import { type Dispatch, type SetStateAction, useMemo } from "react";

type CF = CustomFieldSelectorsType;

type CommonFields = { [K in keyof CF]: CF[K] }[keyof CF];
const withAsset = ["Asset", "Product", "ProductVariant"];

interface CustomFieldsModal {
  modalOpened: boolean;
  setModalOpened: Dispatch<SetStateAction<boolean>>;
  onOpenChange: (value: boolean) => void;
  searchString: string;
  setSearchString: Dispatch<SetStateAction<string>>;
  entityName: string;
  entities: CommonFields[] | undefined;
  selected: CommonFields | undefined;
  setSelected: Dispatch<SetStateAction<CommonFields | undefined>>;
  Paginate: React.ReactNode;
  refetch: () => void;
}

export const CustomFieldsModal: React.FC<CustomFieldsModal> = ({
  refetch,
  Paginate,
  selected,
  setSelected,
  entities,
  modalOpened,
  setModalOpened,
  onOpenChange,
  entityName,
  searchString,
  setSearchString,
}) => {
  const { t } = useTranslation("common");

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

  const { disabled, value, label, field, setValue } = useCustomFields<
    CommonFields | undefined
  >();

  const img = useMemo(() => getImg(value), [value]); // Updated to include entityName as a dependency

  return (
    <Dialog open={modalOpened} onOpenChange={onOpenChange}>
      <div className="flex flex-col gap-3">
        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label || field?.name}
        </Label>
        {field &&
        "entity" in field &&
        field?.entity &&
        withAsset.includes(field?.entity) ? (
          <>
            {!value ? (
              <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-800">
                <ImagePlaceholder />
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
                  <div className="relative size-32">
                    {!img ? (
                      <div className="flex size-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <ImageIcon className="size-10 text-gray-400 dark:text-gray-500" />
                      </div>
                    ) : (
                      <img
                        src={img || "/placeholder.svg"}
                        alt={value.name}
                        className="size-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-2">
                    {isProduct(value) && (
                      <span className="text-sm font-medium">{value.name}</span>
                    )}
                    {isProductVariant(value) && (
                      <>
                        <p className="truncate text-sm font-medium">
                          {value.name}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {value.sku}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {!value ? (
              <span className="text-sm italic text-gray-500 dark:text-gray-400">
                {t("noValue")}
              </span>
            ) : (
              <span className="bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-md px-2 py-1 text-sm font-medium">
                {"name" in value
                  ? value.name
                  : `Cannot parse ${entityName} value`}
              </span>
            )}
          </>
        )}
        {!field?.readonly && (
          <div className="flex gap-2">
            {!value ? (
              <>
                {!disabled ? (
                  <DialogTrigger asChild>
                    <Button
                      disabled={disabled}
                      variant="secondary"
                      size="sm"
                      onClick={() => setModalOpened(true)}
                      className="transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {t(`custom-fields.${entityName.toLowerCase()}.pick`)}
                    </Button>
                  </DialogTrigger>
                ) : null}
              </>
            ) : (
              <Button
                disabled={disabled}
                variant="destructive"
                size="sm"
                onClick={() => setValue(undefined)}
                className="transition-all hover:bg-red-600"
              >
                {t("remove")}
              </Button>
            )}
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
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {entities?.map((entity) => {
                const isSelected = selected?.id === entity.id;
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
                    onClick={() => setSelected(entity)}
                  >
                    <div className="relative">
                      {withAsset.includes(entityName) && (
                        <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                          {entityImg ? (
                            <img
                              src={entityImg || "/placeholder.svg"}
                              alt={entity.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center">
                              <ImageIcon className="size-10 text-gray-400 dark:text-gray-500" />
                            </div>
                          )}
                          {isSelected && (
                            <div className="bg-primary-500/20 absolute inset-0 flex items-center justify-center">
                              <div className="bg-primary-500 rounded-full p-1 text-white">
                                <Check className="size-5" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="p-3">
                        <span className="group-hover:text-primary-600 dark:group-hover:text-primary-400 line-clamp-2 text-sm font-medium">
                          {entity.name}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {entities?.length === 0 && (
                <div className="col-span-full flex h-32 items-center justify-center text-gray-500 dark:text-gray-400">
                  No items found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex w-full flex-col gap-3">
            <div className="flex-1">{Paginate}</div>
            <div className="flex justify-end gap-3">
              {isAsset(value) && (
                <AssetUploadButton refetch={refetch}>
                  {t("upload")}
                </AssetUploadButton>
              )}
              <Button
                onClick={() => {
                  if (selected) setValue(selected);
                  onOpenChange(false);
                }}
                variant={selected ? "action" : "secondary"}
                disabled={!selected || disabled}
                size="lg"
                className={cn(
                  "transition-all",
                  selected
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
