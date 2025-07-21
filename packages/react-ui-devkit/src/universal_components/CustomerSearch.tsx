"use client";
import React from "react";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { LogicalOperator } from "@deenruv/admin-types";
import {
  Search,
  User,
  Mail,
  Phone,
  UserCheck,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation.js";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";
import {
  Input,
  Label,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  cn,
  Checkbox,
  Badge,
} from "@/index.js";
import {
  CustomerSearchSelector,
  type CustomerSearchType,
} from "@/selectors/CustomerSearchSelector.js";

interface Props {
  /** Callback when a customer is selected */
  onSelect: (selected: CustomerSearchType | CustomerSearchType[]) => void;
  /** Currently selected customer(s) */
  selectedCustomer?: CustomerSearchType | CustomerSearchType[];
  /** Enable multiple selection */
  multiple?: boolean;
  /** Maximum number of results to display */
  maxResults?: number;
  /** Custom placeholder text */
  placeholder?: string;
  /** Disable the search input */
  disabled?: boolean;
  /** Callback when search starts */
  onSearchStart?: () => void;
  /** Callback when search completes */
  onSearchComplete?: (results: CustomerSearchType[], query: string) => void;
  /** Callback when search encounters an error */
  onSearchError?: (error: Error) => void;
  /** Custom debounce delay in milliseconds */
  debounceDelay?: number;
  /** Show clear button when there's text */
  showClearButton?: boolean;
  /** Custom CSS class for the container */
  className?: string;
  /** Maximum number of customers that can be selected (only for multiple mode) */
  maxSelections?: number;
}

const DEFAULT_MAX_RESULTS = 10;
const DEFAULT_DEBOUNCE_DELAY = 500;

export const CustomerSearch: React.FC<Props> = ({
  onSelect,
  selectedCustomer,
  multiple = false,
  maxResults = DEFAULT_MAX_RESULTS,
  placeholder,
  disabled = false,
  onSearchStart,
  onSearchComplete,
  onSearchError,
  debounceDelay = DEFAULT_DEBOUNCE_DELAY,
  showClearButton = true,
  className,
  maxSelections,
}) => {
  const { t } = useTranslation("orders");
  const inputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounce(value, debounceDelay);
  const [results, setResults] = useState<CustomerSearchType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Normalize selected customers to always be an array for internal use
  const selectedCustomers = useMemo(() => {
    if (!selectedCustomer) return [];
    return Array.isArray(selectedCustomer)
      ? selectedCustomer
      : [selectedCustomer];
  }, [selectedCustomer]);

  // Check if a customer is selected
  const isCustomerSelected = useCallback(
    (customer: CustomerSearchType) => {
      return selectedCustomers.some((selected) => selected.id === customer.id);
    },
    [selectedCustomers],
  );

  // Get selection state for checkbox
  const getSelectionState = useCallback(() => {
    if (results.length === 0) return "none";
    const selectedCount = results.filter(isCustomerSelected).length;
    if (selectedCount === 0) return "none";
    if (selectedCount === results.length) return "all";
    return "partial";
  }, [results, isCustomerSelected]);

  // Memoized search filter logic
  const createSearchFilter = useMemo(() => {
    return (searchTerm: string) => {
      const terms = searchTerm.split(" ").filter(Boolean);
      if (terms.length > 1) {
        return {
          OR: [
            { firstName: { contains: terms[0] } },
            { lastName: { contains: terms[1] } },
            { emailAddress: { contains: searchTerm } },
            { id: { eq: searchTerm } },
          ],
        };
      }
      return {
        firstName: { contains: searchTerm },
        lastName: { contains: searchTerm },
        emailAddress: { contains: searchTerm },
        id: { eq: searchTerm },
      };
    };
  }, []);

  // Enhanced search function with better error handling
  const performSearch = useCallback(
    async (searchTerm: string) => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      setIsSearching(true);
      setHasSearched(true);
      setError(null);
      setSelectedIndex(-1);
      onSearchStart?.();

      try {
        const filter = createSearchFilter(searchTerm);
        const data = await apiClient("query")({
          customers: [
            {
              options: {
                take: maxResults,
                ...(searchTerm && {
                  filter,
                  filterOperator: LogicalOperator.OR,
                }),
              },
            },
            { items: CustomerSearchSelector },
          ],
        });

        if (!abortControllerRef.current?.signal.aborted) {
          const searchResults = data.customers.items;
          setResults(searchResults);
          onSearchComplete?.(searchResults, searchTerm);
        }
      } catch (err) {
        if (!abortControllerRef.current?.signal.aborted) {
          const errorMessage =
            err instanceof Error ? err.message : "Search failed";
          setError(errorMessage);
          setResults([]);
          onSearchError?.(err instanceof Error ? err : new Error(errorMessage));
        }
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          setIsSearching(false);
        }
      }
    },
    [
      createSearchFilter,
      maxResults,
      onSearchStart,
      onSearchComplete,
      onSearchError,
    ],
  );

  // Search effect
  useEffect(() => {
    if (debouncedValue.trim()) {
      performSearch(debouncedValue);
    } else {
      setResults([]);
      setHasSearched(false);
      setError(null);
      setSelectedIndex(-1);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [debouncedValue, performSearch]);

  // Handle customer selection
  const handleCustomerSelect = useCallback(
    (customer: CustomerSearchType, index: number) => {
      setSelectedIndex(index);

      if (multiple) {
        const isSelected = isCustomerSelected(customer);
        let newSelection: CustomerSearchType[];

        if (isSelected) {
          // Remove from selection
          newSelection = selectedCustomers.filter((c) => c.id !== customer.id);
        } else {
          // Add to selection (check max limit)
          if (maxSelections && selectedCustomers.length >= maxSelections) {
            return; // Don't add if at max limit
          }
          newSelection = [...selectedCustomers, customer];
        }

        onSelect(newSelection);
      } else {
        onSelect(customer);
      }
    },
    [multiple, isCustomerSelected, selectedCustomers, onSelect, maxSelections],
  );

  // Handle select all/none for multiple mode
  const handleSelectAll = useCallback(() => {
    if (!multiple) return;

    const selectionState = getSelectionState();
    if (selectionState === "all" || selectionState === "partial") {
      // Deselect all visible results
      const newSelection = selectedCustomers.filter(
        (selected) => !results.some((result) => result.id === selected.id),
      );
      onSelect(newSelection);
    } else {
      // Select all visible results (respecting max limit)
      const unselectedResults = results.filter(
        (result) => !isCustomerSelected(result),
      );
      let toAdd = unselectedResults;

      if (maxSelections) {
        const remainingSlots = maxSelections - selectedCustomers.length;
        toAdd = unselectedResults.slice(0, remainingSlots);
      }

      const newSelection = [...selectedCustomers, ...toAdd];
      onSelect(newSelection);
    }
  }, [
    multiple,
    getSelectionState,
    selectedCustomers,
    results,
    onSelect,
    isCustomerSelected,
    maxSelections,
  ]);

  // Remove a selected customer (for multiple mode)
  const handleRemoveCustomer = useCallback(
    (customerId: string) => {
      if (!multiple) return;
      const newSelection = selectedCustomers.filter((c) => c.id !== customerId);
      onSelect(newSelection);
    },
    [multiple, selectedCustomers, onSelect],
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleCustomerSelect(results[selectedIndex], selectedIndex);
          }
          break;
        case "Escape":
          e.preventDefault();
          setValue("");
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
        case " ":
          if (multiple && selectedIndex >= 0 && results[selectedIndex]) {
            e.preventDefault();
            handleCustomerSelect(results[selectedIndex], selectedIndex);
          }
          break;
      }
    },
    [disabled, results, selectedIndex, handleCustomerSelect, multiple],
  );

  // Clear search
  const handleClear = useCallback(() => {
    setValue("");
    setResults([]);
    setHasSearched(false);
    setError(null);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  // Focus management for keyboard navigation
  useEffect(() => {
    if (selectedIndex >= 0 && tableRef.current) {
      const selectedRow = tableRef.current.querySelector(
        `[data-index="${selectedIndex}"]`,
      );
      selectedRow?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  const defaultPlaceholder = t(
    "create.selectCustomer.placeholder",
    multiple
      ? "Search customers to select..."
      : "Search by name, email, or ID...",
  );

  const selectionState = getSelectionState();

  return (
    <div className={cn("flex h-full flex-col gap-4 py-2", className)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="customer-search" className="text-sm font-medium">
          {t("create.selectCustomer.inputLabel", "Search for customers")}
          {multiple && selectedCustomers.length > 0 && (
            <span className="ml-2 text-xs text-muted-foreground">
              ({selectedCustomers.length} selected
              {maxSelections ? ` / ${maxSelections}` : ""})
            </span>
          )}
        </Label>

        {/* Selected customers display for multiple mode */}
        {multiple && selectedCustomers.length > 0 && (
          <div className="flex flex-wrap gap-1 p-2 bg-muted/30 rounded-md">
            {selectedCustomers.map((customer) => (
              <Badge
                key={customer.id}
                variant="secondary"
                className="flex items-center gap-1 pr-1"
              >
                <span className="text-xs">
                  {customer.firstName} {customer.lastName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleRemoveCustomer(customer.id)}
                  aria-label={`Remove ${customer.firstName} ${customer.lastName}`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        <div className="relative">
          <Input
            id="customer-search"
            placeholder={placeholder || defaultPlaceholder}
            ref={inputRef}
            value={value}
            className="pl-9 pr-9"
            disabled={disabled}
            onChange={(e) => setValue(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            aria-expanded={results.length > 0}
            aria-haspopup="listbox"
            aria-describedby={error ? "search-error" : undefined}
            role="combobox"
            aria-autocomplete="list"
            aria-activedescendant={
              selectedIndex >= 0 ? `customer-${selectedIndex}` : undefined
            }
          />
          <div className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
            {isSearching ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
          </div>
          {showClearButton && value && !disabled && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-transparent"
              onClick={handleClear}
              aria-label="Clear search"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
        {error && (
          <p id="search-error" className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>

      {isSearching ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500"></div>
          <p className="text-muted-foreground mt-4 text-sm">
            {t("create.selectCustomer.searching", "Searching for customers...")}
          </p>
        </div>
      ) : results.length > 0 ? (
        <div className="rounded-md border">
          <ScrollArea className="h-[calc(80vh-330px)]" ref={tableRef}>
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0">
                <TableRow noHover className="hover:bg-transparent">
                  {multiple && (
                    <TableHead className="w-12 py-3">
                      <Checkbox
                        checked={selectionState === "all"}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all customers"
                        disabled={
                          !!maxSelections &&
                          selectedCustomers.length >= maxSelections &&
                          selectionState === "none"
                        }
                      />
                    </TableHead>
                  )}
                  <TableHead className="py-3 font-semibold">
                    {t("create.selectCustomer.name", "Name")}
                  </TableHead>
                  <TableHead className="py-3 font-semibold">
                    {t("create.selectCustomer.email", "Email")}
                  </TableHead>
                  <TableHead className="py-3 font-semibold">
                    {t("create.selectCustomer.phoneNumber", "Phone")}
                  </TableHead>
                  <TableHead className="py-3 font-semibold">
                    {t("create.selectCustomer.id", "ID")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody role="listbox">
                {results.map((customer, index) => {
                  const isSelected = isCustomerSelected(customer);

                  const isAtMaxLimit =
                    !!maxSelections &&
                    selectedCustomers.length >= maxSelections &&
                    !isSelected;

                  return (
                    <TableRow
                      key={customer.id}
                      id={`customer-${index}`}
                      data-index={index}
                      className={cn(
                        "cursor-pointer transition-colors",
                        isSelected
                          ? "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30"
                          : selectedIndex === index
                            ? "bg-muted/70 hover:bg-muted"
                            : "hover:bg-muted/50",
                        isAtMaxLimit && "opacity-50 cursor-not-allowed",
                      )}
                      onClick={() =>
                        !isAtMaxLimit && handleCustomerSelect(customer, index)
                      }
                      role="option"
                      aria-selected={isSelected}
                      tabIndex={-1}
                    >
                      {multiple && (
                        <TableCell className="py-3">
                          <Checkbox
                            checked={isSelected}
                            disabled={isAtMaxLimit}
                            aria-label={`Select ${customer.firstName} ${customer.lastName}`}
                          />
                        </TableCell>
                      )}
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          {!multiple && isSelected ? (
                            <UserCheck className="size-4 text-indigo-500" />
                          ) : (
                            <User className="text-muted-foreground size-4" />
                          )}
                          <div className="font-medium">
                            {customer.firstName} {customer.lastName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        <div className="flex items-center gap-2">
                          <Mail className="text-muted-foreground size-4" />
                          <span>{customer.emailAddress}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3">
                        {customer.phoneNumber ? (
                          <div className="flex items-center gap-2">
                            <Phone className="text-muted-foreground size-4" />
                            <span>{customer.phoneNumber}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground py-3 font-mono text-xs">
                        {customer.id}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/30">
            <AlertCircle className="size-6 text-red-500" />
          </div>
          <div>
            <p className="font-medium">
              {t("create.selectCustomer.searchError", "Search Error")}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">{error}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 bg-transparent"
              onClick={() => performSearch(debouncedValue)}
            >
              {t("create.selectCustomer.retry", "Try Again")}
            </Button>
          </div>
        </div>
      ) : hasSearched ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
            <AlertCircle className="size-6 text-amber-500" />
          </div>
          <div>
            <p className="font-medium">
              {t("create.selectCustomer.noResults", "No customers found")}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {t(
                "create.selectCustomer.tryDifferent",
                "Try a different search term or create a new customer",
              )}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/30">
            <Search className="size-6 text-indigo-500" />
          </div>
          <div>
            <p className="font-medium">
              {t("create.selectCustomer.searchPrompt", "Search for customers")}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {t(
                "create.selectCustomer.searchHint",
                multiple
                  ? "Enter a name, email, or ID to find customers to select"
                  : "Enter a name, email, or ID to find customers",
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
