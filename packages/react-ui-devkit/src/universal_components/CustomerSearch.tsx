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
} from "@/index.js";
import {
  CustomerSearchSelector,
  type CustomerSearchType,
} from "@/selectors/CustomerSearchSelector.js";

interface Props {
  /** Callback when a customer is selected */
  onSelect: (selected: CustomerSearchType) => void;
  /** Currently selected customer */
  selectedCustomer?: CustomerSearchType;
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
}

const DEFAULT_MAX_RESULTS = 10;
const DEFAULT_DEBOUNCE_DELAY = 500;

export const CustomerSearch: React.FC<Props> = ({
  onSelect,
  selectedCustomer,
  maxResults = DEFAULT_MAX_RESULTS,
  placeholder,
  disabled = false,
  onSearchStart,
  onSearchComplete,
  onSearchError,
  debounceDelay = DEFAULT_DEBOUNCE_DELAY,
  showClearButton = true,
  className,
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
            onSelect(results[selectedIndex]);
          }
          break;
        case "Escape":
          e.preventDefault();
          setValue("");
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    },
    [disabled, results, selectedIndex, onSelect],
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

  // Handle customer selection
  const handleCustomerSelect = useCallback(
    (customer: CustomerSearchType, index: number) => {
      setSelectedIndex(index);
      onSelect(customer);
    },
    [onSelect],
  );

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
    "Search by name, email, or ID...",
  );

  return (
    <div className={cn("flex h-full flex-col gap-4 py-2", className)}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="customer-search" className="text-sm font-medium">
          {t("create.selectCustomer.inputLabel", "Search for customers")}
        </Label>
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
                {results.map((customer, index) => (
                  <TableRow
                    key={customer.id}
                    id={`customer-${index}`}
                    data-index={index}
                    className={cn(
                      "cursor-pointer transition-colors",
                      customer.id === selectedCustomer?.id
                        ? "bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30"
                        : selectedIndex === index
                          ? "bg-muted/70 hover:bg-muted"
                          : "hover:bg-muted/50",
                    )}
                    onClick={() => handleCustomerSelect(customer, index)}
                    role="option"
                    aria-selected={customer.id === selectedCustomer?.id}
                    tabIndex={-1}
                  >
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        {customer.id === selectedCustomer?.id ? (
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
                ))}
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
                "Enter a name, email, or ID to find customers",
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
