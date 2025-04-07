import {
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  ORDER_STATE,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@deenruv/react-ui-devkit";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface OrderStatesSelectProps {
  selectedOrderStates: string[];
  onSelectedOrderStatesChange: (value: string) => void;
}

export const OrderStatesSelect: React.FC<OrderStatesSelectProps> = ({
  onSelectedOrderStatesChange,
  selectedOrderStates,
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
          className="h-[30px] w-full max-w-[240px] justify-between py-0 font-normal"
        >
          {selectedOrderStates.length
            ? `${t("selectedOrderStates")} (${selectedOrderStates.length})`
            : t("selectOrderStates")}
          <ChevronsUpDown size={16} className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-max p-0">
        <Command>
          <div className="relative">
            <CommandInput
              className="border-none"
              placeholder={t("searchOrderStates")}
            />
          </div>
          <CommandList>
            <CommandEmpty>{t("noOrderStatesFound")}</CommandEmpty>
            <CommandGroup>
              {Object.values(ORDER_STATE).map((value) => (
                <CommandItem
                  className="cursor-pointer"
                  key={value}
                  value={value}
                  onSelect={() => onSelectedOrderStatesChange(value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedOrderStates.includes(value)
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  <span className="shrink-0">{value}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
