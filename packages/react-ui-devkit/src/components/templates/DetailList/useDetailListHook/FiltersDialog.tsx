import { Badge } from "@/components/atoms/badge.js";
import { Button } from "@/components/atoms/button.js";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/atoms/command.js";
import { Option } from "@/components/atoms/multiple-selector.js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/atoms/popover.js";
import { SimpleSelect } from "@/components/molecules/SimpleSelect.js";
import { SimpleTooltip } from "@/components/molecules/SimpleTooltip.js";
import { FilterInputTypeUnion } from "@/components/templates/DetailList/_components/types.js";
import { OperatorValue } from "@/components/templates/DetailList/useDetailListHook/OperatorValue.js";
import {
  ListTypeKeys,
  ListType,
} from "@/components/templates/DetailList/useDetailListHook/types.js";
import { useTranslation } from "@/hooks/useTranslation.js";
import { cn } from "@/lib/utils.js";
import { ModelTypes } from "@deenruv/admin-types";
import { Check, ChevronsUpDown, ListFilter, Trash2 } from "lucide-react";
import React, { useCallback, useMemo, useState } from "react";

const joinOperatorOptions: Option[] = [
  { label: "and", value: "and" },
  { label: "or", value: "or" },
];

export const FiltersDialog = <T extends keyof ListType>({
  filterLabels,
  filter,
  setFilterField,
  removeFilterField,
  resetFilterFields,
}: {
  filterLabels: {
    name: string | number | symbol;
    translation?: string;
    type?: string;
    component?: React.ComponentType<any>;
  }[];
  filter: ModelTypes[(typeof ListTypeKeys)[T]] | undefined;
  setFilterField: (
    field: keyof ModelTypes[(typeof ListTypeKeys)[T]],
    value: FilterInputTypeUnion | undefined,
  ) => void;
  removeFilterField: (
    field: keyof ModelTypes[(typeof ListTypeKeys)[T]],
  ) => void;
  resetFilterFields: () => void;
  changeFilterField: (
    index: number,
    field: keyof ModelTypes[(typeof ListTypeKeys)[T]],
  ) => void;
}) => {
  const { t } = useTranslation("table");
  const [filtersArray, setFiltersArray] = useState(() =>
    Object.entries(filter || {}),
  );
  const [joinOperator, setJoinOperator] = useState<string>(
    joinOperatorOptions[0].value,
  );
  const appliedFilterFieldsLength = useMemo(
    () => filtersArray.length,
    [filtersArray],
  );
  const allFiltersApplied = appliedFilterFieldsLength === filterLabels.length;

  const addFilter = useCallback(() => {
    const appliedFiltersNames = filtersArray.map(([key]) => key);
    const unappliedFilterNames = filterLabels
      .map((l) => l.name)
      .filter((n) => !appliedFiltersNames.includes(n.toString()));

    if (unappliedFilterNames.length) {
      setFiltersArray((prev) => [
        ...prev,
        [unappliedFilterNames[0] as string, {}],
      ]);
    }
  }, [filtersArray]);

  const handleOpen = useCallback(
    (open: boolean) => {
      if (open && !filtersArray.length) addFilter(); // add initial filter on dialog open
    },
    [filtersArray],
  );

  const applyFilters = useCallback(() => {
    resetFilterFields();
    filtersArray.forEach((f) => {
      setFilterField(f[0] as keyof ModelTypes[(typeof ListTypeKeys)[T]], f[1]);
    });
  }, [filtersArray]);

  return (
    <Popover onOpenChange={handleOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2 border-transparent bg-transparent px-3 py-0 text-muted-foreground hover:border-border hover:bg-card hover:text-foreground"
          aria-label={t("filterDialog.title")}
        >
          <ListFilter className="size-4" aria-hidden="true" />
          {t("filterDialog.title")}
          {Object.keys(filter || {}).length > 0 && (
            <Badge
              variant="secondary"
              className="h-[1.14rem] px-[0.32rem] font-mono text-[0.65rem] font-normal"
            >
              {Object.keys(filter || {}).length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        collisionPadding={16}
        className={cn(
          "flex w-[calc(100vw-3rem)] min-w-[60vw] origin-[var(--radix-popover-content-transform-origin)] flex-col border-border/80 bg-card p-4 sm:w-[38rem]",
          filtersArray.length > 0 ? "gap-3.5" : "gap-2",
        )}
      >
        {filtersArray.length > 0 ? (
          <h4 className="font-medium leading-none">
            {t("filterDialog.title")}
          </h4>
        ) : (
          <div className="flex flex-col gap-1">
            <h4 className="font-medium leading-none">
              {t("filterDialog.noFiltersApplied")}
            </h4>
            <p className="text-muted-foreground text-sm">
              {t("filterDialog.emptyState")}
            </p>
          </div>
        )}
        <div className="flex max-h-[12.5rem] min-w-[50vw] flex-col gap-2 py-1 pr-1">
          {filtersArray.map(([filterKey], index) => {
            const filter = filterLabels.find(
              (field) => field.name === filterKey,
            );
            return (
              <div
                key={`${filterKey}-${index}`}
                className="flex min-w-0 items-start gap-2 border border-border/60 bg-muted/20 p-2"
              >
                <div className="flex items-center gap-2">
                  <div className="min-w-[4.5rem] text-center">
                    {index === 0 ? (
                      <span className="text-muted-foreground text-sm">
                        {t("filterDialog.where")}
                      </span>
                    ) : index === 1 ? (
                      <SimpleSelect
                        disabled
                        value={joinOperator}
                        onValueChange={setJoinOperator}
                        options={joinOperatorOptions}
                        className="h-8 lowercase"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        {joinOperator}
                      </span>
                    )}
                  </div>
                </div>
                <Popover modal>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      role="combobox"
                      className="focus:ring-ring h-8 w-32 max-w-[109px] justify-between gap-2 bg-card focus:outline-none focus:ring-1 focus-visible:ring-0"
                    >
                      <span className="overflow-hidden truncate">
                        {filter?.translation
                          ? filter?.translation
                          : filter?.name
                            ? t("columns." + filter?.name.toString())
                            : "Select field"}
                      </span>
                      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="w-64 border-border/80 p-0"
                  >
                    <Command>
                      <CommandInput
                        placeholder={t("filterDialog.searchFields")}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {t("filterDialog.noFieldsFound")}
                        </CommandEmpty>
                        <CommandGroup>
                          {filterLabels.map((field) => (
                            <CommandItem
                              key={field.name.toString()}
                              value={field.name.toString()}
                              onSelect={(value) => {
                                setFiltersArray((prev) => {
                                  const newArray = [...prev];
                                  newArray[index][0] = value.toString();
                                  newArray[index][1] = {};
                                  return newArray;
                                });
                              }}
                            >
                              <span className="mr-1.5 truncate">
                                {field.translation
                                  ? field.translation
                                  : t("columns." + field.name.toString())}
                              </span>
                              <Check
                                className={cn(
                                  "ml-auto size-4 shrink-0",
                                  field.name.toString() === filterKey
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {filter?.type ? (
                  <OperatorValue
                    currentValue={filtersArray[index][1]}
                    filterType={filter?.type}
                    onChange={(value) => {
                      setFiltersArray((prev) => {
                        const newFilters = [...prev];
                        newFilters[index] = [filterKey, value];
                        return newFilters;
                      });
                    }}
                  />
                ) : filter?.component ? (
                  React.createElement(filter?.component, {
                    key: filterKey,
                    value: filtersArray[index][1],
                    onChange: (value: any) => {
                      setFiltersArray((prev) => {
                        const newFilters = [...prev];
                        if (value === null || value === undefined) {
                          return newFilters.filter(
                            ([key]) => key !== filterKey,
                          );
                        }
                        newFilters[index] = [filterKey, value];
                        return newFilters;
                      });
                    },
                  })
                ) : null}
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={`Remove filter ${index + 1}`}
                  className="size-8 shrink-0 bg-card text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    setFiltersArray((prev) =>
                      prev.filter(([key]) => key !== filterKey),
                    );
                    removeFilterField(
                      filterKey as keyof ModelTypes[(typeof ListTypeKeys)[T]],
                    );
                  }}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" />
                </Button>
              </div>
            );
          })}
        </div>
        <div className="flex w-full flex-wrap items-center gap-2">
          <SimpleTooltip
            content={
              allFiltersApplied
                ? t("filterDialog.allFiltersApplied")
                : undefined
            }
          >
            <Button
              size="sm"
              className="h-[1.85rem]"
              onClick={addFilter}
              disabled={allFiltersApplied}
            >
              {t("filterDialog.add")}
            </Button>
          </SimpleTooltip>
          {filtersArray.length > 0 ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setFiltersArray([]);
                resetFilterFields();
              }}
            >
              {t("filterDialog.reset")}
            </Button>
          ) : null}
          <Button
            size="sm"
            className="ml-auto h-[1.85rem]"
            onClick={applyFilters}
            disabled={filtersArray.length === 0}
          >
            {t("filterDialog.apply")}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
