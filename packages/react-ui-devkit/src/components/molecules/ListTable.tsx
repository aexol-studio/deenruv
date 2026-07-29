import {
  Column,
  ColumnDef,
  Table as ReactTable,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ListViewMarker,
  TableLabel,
} from "@/components";
import {
  CSSProperties,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import React from "react";
import { cn } from "@/lib";
import { LocationKeys } from "@/types/types.js";
import { EmptyState } from "@/universal_components/EmptyState.js";
import { useTranslation } from "@/hooks/useTranslation.js";

interface ListTableProps<TData, TValue> {
  tableId: LocationKeys;
  columns: ColumnDef<TData, TValue>[];
  isFiltered: boolean;
  table: ReactTable<TData>;
  Paginate: ReactNode;
}

const NARROW_COLUMN_IDS = ["select-id", "select", "actions"];
const SELECTION_COLUMN_IDS = ["select-id", "select"];
const MAXIMUM_COLUMN_WIDTH = 320;

const isSelectionColumn = (columnId: string) =>
  SELECTION_COLUMN_IDS.includes(columnId);

const getCommonPinningStyles = <T,>(
  column: Column<T>,
  showPinned: boolean,
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left");
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right");
  const narrowColumnWidth = 35;
  const idColumnMaxWidth = 350;
  const idColumnWidth = 100;
  const isNarrowColumn = NARROW_COLUMN_IDS.includes(column.id);
  const columnWidth = isNarrowColumn ? narrowColumnWidth : undefined;
  const columnMinWidth =
    column.id === "id"
      ? undefined
      : (columnWidth ?? Math.min(column.getSize(), MAXIMUM_COLUMN_WIDTH));
  const columnMaxWidth =
    column.id === "id"
      ? idColumnMaxWidth
      : (columnWidth ?? MAXIMUM_COLUMN_WIDTH);

  const styles = {
    left: isPinned === "left" ? `${column.getStart("left")}px` : "unset",
    right: isPinned === "right" ? `${column.getAfter("right")}px` : "unset",
    boxShadow: "unset",
    opacity: 1,
    position: isPinned ? ("sticky" as const) : ("relative" as const),
    minWidth: columnMinWidth,
    maxWidth: columnMaxWidth,
    width: column.id === "id" ? idColumnWidth : columnWidth,
    zIndex: isPinned ? 2 : 0,
  };

  if (showPinned) {
    styles.boxShadow = isLastLeftPinnedColumn
      ? "-10px 0 14px -14px color-mix(in srgb, var(--foreground) 45%, transparent) inset"
      : isFirstRightPinnedColumn
        ? "10px 0 14px -14px color-mix(in srgb, var(--foreground) 45%, transparent) inset"
        : "unset";
  }

  return styles;
};

const getCommonClassNameStyles = <T,>(column: Column<T>): string => {
  const isPinned = column.getIsPinned();
  if (!isPinned) return "";
  return cn(
    "bg-card group-hover:bg-muted/40 group-data-[state=selected]:bg-primary/10",
  );
};

const TABLE_HEADER_HEIGHT = 40;
const MINIMUM_ROW_HEIGHT = 30;

export function ListTable<TData, TValue>({
  table,
  columns,
  isFiltered,
  Paginate,
  tableId,
}: ListTableProps<TData, TValue>) {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const { t } = useTranslation("common");
  const [showPinned, setShowPinned] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (!tableWrapperRef.current || !rowRefs.current?.[0]) return;

      const { scrollWidth: wrapperWidth } = tableWrapperRef.current;
      const { scrollWidth: rowWidth } = rowRefs.current[0];

      setShowPinned(rowWidth > wrapperWidth);
    };

    const resizeObserver = new ResizeObserver(checkScroll);
    if (tableWrapperRef.current) {
      resizeObserver.observe(tableWrapperRef.current);
      tableWrapperRef.current.addEventListener("scroll", checkScroll);
    }

    checkScroll();

    return () => {
      resizeObserver.disconnect();
      tableWrapperRef.current?.removeEventListener("scroll", checkScroll);
    };
  }, [rowRefs.current.length, tableWrapperRef.current]);

  useLayoutEffect(() => {
    if (rowRefs.current.length && tableWrapperRef.current) {
      const tbodyHeight =
        tableWrapperRef.current?.clientHeight - TABLE_HEADER_HEIGHT;
      const rowHeight = tbodyHeight / 10;
      const finalRowHeight =
        rowHeight >= MINIMUM_ROW_HEIGHT ? rowHeight : MINIMUM_ROW_HEIGHT;

      rowRefs.current.forEach((row) => {
        if (row) {
          row.style.height = `${finalRowHeight}px`;
        }
      });
    }
  }, [
    table.getRowModel().rows.length,
    rowRefs.current,
    table.getState().pagination.pageIndex,
  ]);

  useEffect(() => {
    const PADDING_X_VALUE = 64;
    const tableWrapper = tableWrapperRef.current;
    const scrollArea = tableWrapper?.closest(
      "[data-deenruv-scroll-area-viewport]",
    );
    if (!scrollArea || !tableWrapper) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry.contentRect.width;
      tableWrapper.style.maxWidth = width - PADDING_X_VALUE / 2 + "px";
    });

    observer.observe(scrollArea);

    return () => {
      observer.disconnect();
    };
  }, [tableWrapperRef]);

  return (
    <>
      <div
        ref={tableWrapperRef}
        className="h-full w-full min-w-0 max-w-full overflow-auto border border-border/80 bg-card"
      >
        <Table
          className={cn("w-full")}
          containerClassName={cn(
            "min-w-0 max-w-full",
            !table.getRowModel().rows?.length && "flex min-h-[22rem]",
          )}
        >
          <TableHeader className="sticky top-0 z-20 border-b border-border/80 bg-card/95 backdrop-blur">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow noHover key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isSelectionHeader = isSelectionColumn(header.column.id);
                  const isNarrowHeader = NARROW_COLUMN_IDS.includes(
                    header.column.id,
                  );
                  const component =
                    typeof header.column.columnDef.header === "string" ? (
                      <TableLabel>{header.column.columnDef.header}</TableLabel>
                    ) : (
                      header.column.columnDef.header
                    );
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "relative border-b border-border/80 bg-card/95 last:pr-4",
                        !isSelectionHeader && "first:pl-4",
                        getCommonClassNameStyles(header.column),
                      )}
                      style={{
                        ...getCommonPinningStyles(header.column, showPinned),
                      }}
                    >
                      <div
                        className={cn(
                          "flex min-h-10 items-center gap-2",
                          isSelectionHeader
                            ? "justify-center"
                            : "justify-between",
                        )}
                      >
                        {header.isPlaceholder ? null : isNarrowHeader ? (
                          flexRender(component, header.getContext())
                        ) : (
                          <div
                            className="min-w-0 truncate"
                            style={{ maxWidth: MAXIMUM_COLUMN_WIDTH }}
                          >
                            {flexRender(component, header.getContext())}
                          </div>
                        )}

                        <ListViewMarker
                          column={header.column}
                          position={tableId}
                        />
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, idx) => {
                rowRefs.current = [];
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group border-b border-border/50 transition-colors last:border-b-0 hover:bg-muted/40 data-[state=selected]:bg-primary/10"
                    ref={(el) => {
                      rowRefs.current[idx] = el;
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isSelectionCell = isSelectionColumn(cell.column.id);
                      const isNarrowCell = NARROW_COLUMN_IDS.includes(
                        cell.column.id,
                      );
                      const cellValue = cell.getValue();
                      const renderedCell = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      );
                      const cellTitle =
                        typeof renderedCell === "string" &&
                        renderedCell.length > 0
                          ? renderedCell
                          : typeof cellValue === "string" &&
                              cellValue.length > 0
                            ? cellValue
                            : undefined;

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "whitespace-nowrap border-b border-border/50 last:pr-4",
                            !isSelectionCell && "first:pl-4",
                            idx === table.getRowModel().rows.length - 1 &&
                              "border-b-0",
                            !isNarrowCell && "overflow-hidden",
                            getCommonClassNameStyles(cell.column),
                          )}
                          style={{
                            ...getCommonPinningStyles(cell.column, showPinned),
                          }}
                        >
                          {isNarrowCell ? (
                            renderedCell
                          ) : (
                            <div
                              className="min-w-0 truncate"
                              style={{ maxWidth: MAXIMUM_COLUMN_WIDTH }}
                              title={cellTitle}
                            >
                              {renderedCell}
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <EmptyState
                columnsLength={columns.length}
                filtered={isFiltered}
                title={t(
                  `emptyState.default.${isFiltered ? "filtered" : "empty"}.title`,
                )}
                description={t(
                  `emptyState.default.${isFiltered ? "filtered" : "empty"}.text`,
                )}
              />
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-2 flex flex-col gap-2 border border-border/70 bg-card/80 px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex h-7 w-fit items-center border border-border/70 bg-muted/30 px-3 text-xs font-medium text-muted-foreground">
          {t("selectedValue", {
            from: table.getFilteredSelectedRowModel().rows.length,
            to: table.getFilteredRowModel().rows.length,
          })}
        </div>
        <div className="flex w-full justify-end sm:w-auto">{Paginate}</div>
      </div>
    </>
  );
}
