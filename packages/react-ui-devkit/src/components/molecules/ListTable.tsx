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
    const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');
    const selectIdColumnWidth = 28;

    return {
        boxShadow: isLastLeftPinnedColumn
            ? '-4px 0 4px -4px gray inset'
            : isFirstRightPinnedColumn
              ? '4px 0 4px -4px gray inset'
              : undefined,
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        opacity: isPinned ? 0.95 : 1,
        position: isPinned ? 'sticky' : 'relative',
        width: column.id === 'select-id' ? selectIdColumnWidth : column.getSize(),
        zIndex: isPinned ? 1 : 0,
    };
};

const getCommonClassNameStyles = <T,>(column: Column<T>): string => {
    const isPinned = column.getIsPinned();
    if (!isPinned) return '';
    return isPinned ? cn('bg-primary-foreground') : '';
};

export function ListTable<TData, TValue>({
    table,
    columns,
    isFiltered,
    Paginate,
}: ListTableProps<TData, TValue>) {
    const tableWrapperRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation('common');

    useEffect(() => {
        const PADDING_X_VALUE = 64;
        const updateSize = () => {
            setTimeout(() => {
                if (tableWrapperRef.current) {
                    const wrapperWidth = document.getElementById('scrollArea')?.getBoundingClientRect().width;
                    if (wrapperWidth)
                        tableWrapperRef.current.style.maxWidth = wrapperWidth - PADDING_X_VALUE + 'px';
                }
            }, 0);
        };

        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, [tableWrapperRef]);

    return (
        <>
            <div ref={tableWrapperRef} className={`h-full overflow-auto rounded-md border`}>
                <Table
                    className="w-full"
                    {...(!table.getRowModel().rows?.length && { containerClassName: 'flex' })}
                >
                    <TableHeader className="bg-primary-foreground sticky top-0 z-20">
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
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
                            table.getRowModel().rows.map(row => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell
                                            key={cell.id}
                                            className={getCommonClassNameStyles(cell.column)}
                                            style={{ ...getCommonPinningStyles(cell.column) }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
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
            <div className="flex items-center justify-end space-x-2 py-4">
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
