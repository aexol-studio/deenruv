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
  useTranslation,
} from "@deenruv/react-ui-devkit";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useMemo, useState } from "react";

interface OrderStatesSelectProps {
  additionalOrderStates?: string[];
  selectedOrderStates: string[];
  onSelectedOrderStatesChange: (value: string) => void;
}

export const OrderStatesSelect: React.FC<OrderStatesSelectProps> = ({
  additionalOrderStates,
  onSelectedOrderStatesChange,
  selectedOrderStates,
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { t } = useTranslation("dashboard-widgets-plugin");
  const allStates = useMemo(
    () =>
      [...Object.values(ORDER_STATE), ...(additionalOrderStates || [])]
        .filter((i, index, arr) => arr.indexOf(i) === index)
        .sort((a, b) => a.localeCompare(b)),
    [additionalOrderStates],
  );
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
              {allStates.map((value) => (
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
