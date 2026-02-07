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
  const isNarrowColumn = ["select-id", "select", "actions"].includes(column.id);
  const columnWidth = isNarrowColumn ? narrowColumnWidth : undefined;

  const styles = {
    left: isPinned === "left" ? `${column.getStart("left")}px` : "unset",
    right: isPinned === "right" ? `${column.getAfter("right")}px` : "unset",
    boxShadow: "unset",
    opacity: isPinned ? 0.95 : 1,
    position: isPinned ? ("sticky" as const) : ("relative" as const),
    minWidth: columnWidth,
    maxWidth: column.id === "id" ? idColumnMaxWidth : columnWidth,
    width: column.id === "id" ? idColumnWidth : columnWidth,
    zIndex: isPinned ? 1 : 0,
  };

  if (showPinned) {
    styles.boxShadow = isLastLeftPinnedColumn
      ? "-1px 0 1px -1px gray inset"
      : isFirstRightPinnedColumn
        ? "1px 0 1px -1px gray inset"
        : "unset";
  }

  return styles;
};

const getCommonClassNameStyles = <T,>(column: Column<T>): string => {
  const isPinned = column.getIsPinned();
  if (!isPinned) return "";
  return cn("bg-background");
};

const TABLE_HEADER_HEIGHT = 48;
const MINIMUM_ROW_HEIGHT = 30;
const WIDTH_TRUNCATE_BREAKPOINT = 200;

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
    const scrollArea = document.getElementById("scrollArea");
    if (!scrollArea || !tableWrapperRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry.contentRect.width;
      tableWrapperRef.current!.style.maxWidth =
        width - PADDING_X_VALUE / 2 + "px";
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
        className={`bg-background w-full h-full overflow-auto rounded-md border scroll-thin`}
      >
        <Table
          className={cn("w-full")}
          {...(!table.getRowModel().rows?.length && {
            containerClassName: "flex",
          })}
        >
          <TableHeader className="bg-background sticky top-0 z-20">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow noHover key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
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
                        "relative",
                        getCommonClassNameStyles(header.column),
                      )}
                      style={{
                        ...getCommonPinningStyles(header.column, showPinned),
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(component, header.getContext())}

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
                    ref={(el) => {
                      rowRefs.current[idx] = el;
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const columnWidth = cell.column.getSize();

                      return (
                        <TableCell
                          key={cell.id}
                          className={cn(
                            "whitespace-nowrap",
                            columnWidth > WIDTH_TRUNCATE_BREAKPOINT &&
                              "truncate",
                            getCommonClassNameStyles(cell.column),
                          )}
                          style={{
                            ...getCommonPinningStyles(cell.column, showPinned),
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
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
      <div className="flex items-center justify-end space-x-2 py-2">
        <div className="text-muted-foreground flex-1 text-sm">
          {t("selectedValue", {
            from: table.getFilteredSelectedRowModel().rows.length,
            to: table.getFilteredRowModel().rows.length,
          })}
        </div>
        <div className="space-x-2">{Paginate}</div>
      </div>
    </>
  );
}
