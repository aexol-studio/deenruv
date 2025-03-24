import { Column, ColumnDef, Table as ReactTable, flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, EmptyState } from '@/components';
import { CSSProperties, ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { cn } from '@/lib';

interface ListTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    isFiltered: boolean;
    table: ReactTable<TData>;
    Paginate: ReactNode;
}

const getCommonPinningStyles = <T,>(column: Column<T>): CSSProperties => {
    const isPinned = column.getIsPinned();
    const narrowColumnWidth = 35;
    const idColumnMaxWidth = 100;
    const isNarrowColumn = ['select-id', 'select', 'actions'].includes(column.id);
    const columnWidth = isNarrowColumn ? narrowColumnWidth : undefined;

    return {
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        opacity: isPinned ? 0.95 : 1,
        position: isPinned ? 'sticky' : 'relative',
        minWidth: columnWidth,
        maxWidth: column.id === 'id' ? idColumnMaxWidth : columnWidth,
        width: column.id === 'id' ? idColumnMaxWidth : columnWidth,
        zIndex: isPinned ? 1 : 0,
    };
};

const getCommonClassNameStyles = <T,>(column: Column<T>): string => {
    const isPinned = column.getIsPinned();
    if (!isPinned) return '';
    return isPinned ? cn('bg-background') : '';
};

const TABLE_HEADER_HEIGHT = 48;
const MINIMUM_ROW_HEIGHT = 30;
const WIDTH_TRUNCATE_BREAKPOINT = 200;

export function ListTable<TData, TValue>({
    table,
    columns,
    isFiltered,
    Paginate,
}: ListTableProps<TData, TValue>) {
    const tableWrapperRef = useRef<HTMLDivElement>(null);
    const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
    const { t } = useTranslation('common');

    useEffect(() => {
        if (rowRefs.current.length && tableWrapperRef.current) {
            const tbodyHeight = tableWrapperRef.current?.clientHeight - TABLE_HEADER_HEIGHT;
            const rowHeight = tbodyHeight / 10;
            const finalRowHeight = rowHeight >= MINIMUM_ROW_HEIGHT ? rowHeight : MINIMUM_ROW_HEIGHT;

            rowRefs.current.forEach(row => {
                if (row) row.style.height = `${finalRowHeight}px`;
            });
        }
    }, [table.getRowModel().rows.length]);

    // useEffect(() => {
    //     const PADDING_X_VALUE = 64;
    //     const updateSize = () => {
    //         setTimeout(() => {
    //             if (tableWrapperRef.current) {
    //                 const wrapperWidth = document.getElementById('scrollArea')?.getBoundingClientRect().width;
    //                 if (wrapperWidth)
    //                     tableWrapperRef.current.style.maxWidth = wrapperWidth - PADDING_X_VALUE + 'px';
    //             }
    //         }, 0);
    //     };

    //     window.addEventListener('resize', updateSize);
    //     updateSize();
    //     return () => window.removeEventListener('resize', updateSize);
    // }, [tableWrapperRef]);

    return (
        <>
            <div ref={tableWrapperRef} className={`h-full overflow-auto rounded-md border bg-background`}>
                <Table
                    className={cn('w-full')}
                    {...(!table.getRowModel().rows?.length && { containerClassName: 'flex' })}
                >
                    <TableHeader className="sticky top-0 z-20 bg-background">
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow noHover key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={getCommonClassNameStyles(header.column)}
                                            style={{ ...getCommonPinningStyles(header.column) }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, idx) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                    ref={el => (rowRefs.current[idx] = el)}
                                >
                                    {row.getVisibleCells().map(cell => {
                                        const columnWidth = cell.column.getSize();

                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={cn(
                                                    'whitespace-nowrap',
                                                    columnWidth > WIDTH_TRUNCATE_BREAKPOINT && 'truncate',
                                                    getCommonClassNameStyles(cell.column),
                                                )}
                                                style={{ ...getCommonPinningStyles(cell.column) }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <EmptyState
                                columnsLength={columns.length}
                                filtered={isFiltered}
                                title={t(`emptyState.default.${isFiltered ? 'filtered' : 'empty'}.title`)}
                                description={t(
                                    `emptyState.default.${isFiltered ? 'filtered' : 'empty'}.text`,
                                )}
                            />
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-2">
                <div className="text-muted-foreground flex-1 text-sm">
                    {t('selectedValue', {
                        from: table.getFilteredSelectedRowModel().rows.length,
                        to: table.getFilteredRowModel().rows.length,
                    })}
                </div>
                <div className="space-x-2">{Paginate}</div>
            </div>
        </>
    );
}
