import React, { useState } from "react";
import { ChartMetricType } from "../../zeus";
import {
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@deenruv/react-ui-devkit";
import { Check, ChevronsUpDown } from "lucide-react";
import { sortBySelected } from "../../utils";
import { useTranslation } from "react-i18next";

interface ProductSelectProps {
  metricType: ChartMetricType;
  selectedAvailableProducts: { id: string; color: string }[];
  allAvailableProducts: { id: string; name: string }[];
  onSelectedAvailableProductsChange: (id: string) => void;
  clearSelectedProducts: () => void;
}

export const ProductSelector: React.FC<ProductSelectProps> = ({
  metricType,
  allAvailableProducts,
  selectedAvailableProducts,
  onSelectedAvailableProductsChange,
  clearSelectedProducts,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { t } = useTranslation("dashboard-widgets-plugin", {
    i18n: window.__DEENRUV_SETTINGS__.i18n,
  });
  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="h-[30px] w-full max-w-[240px] justify-between py-0"
        >
          {selectedAvailableProducts.length
            ? `${t("selectedProducts")} (${selectedAvailableProducts.length})`
            : t("selectProducts")}
          <ChevronsUpDown size={16} className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max p-0">
        <Command>
          <div className="relative">
            <CommandInput
              className="border-none"
              placeholder={t("searchProducts")}
            />
            {selectedAvailableProducts.length ? (
              <Button
                onClick={clearSelectedProducts}
                variant="ghost"
                size="sm"
                className="text-primary absolute right-1 top-1/2 -translate-y-1/2"
              >
                {t("clearSelected")}
              </Button>
            ) : null}
          </div>
          <CommandList>
            <CommandEmpty> {t("noProductsFound")}</CommandEmpty>

            <CommandGroup>
              {allAvailableProducts
                .sort(
                  sortBySelected(selectedAvailableProducts.map((p) => p.id)),
                )
                .map((product) => (
                  <CommandItem
                    key={product.id}
                    value={`${product.name} ${product.id}`}
                    onSelect={() =>
                      onSelectedAvailableProductsChange(product.id)
                    }
                  >
                    <div className="flex w-full cursor-pointer justify-between gap-2">
                      <span className="shrink-0">{product.name}</span>
                      <div className="flex">
                        <span className="shrink-0 pr-1 opacity-50">{`(variant ID: ${product.id})`}</span>{" "}
                        <Check
                          style={{
                            color:
                              selectedAvailableProducts.find(
                                (p) => p.id === product.id,
                              )?.color ?? "",
                          }}
                          className={cn(
                            "ml-auto",
                            selectedAvailableProducts.some(
                              (p) => p.id === product.id,
                            )
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </div>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
