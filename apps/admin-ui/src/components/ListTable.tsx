import { ColumnDef, Table as ReactTable, flexRender } from '@tanstack/react-table';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { EmptyState } from '@/components';
import { ReactNode, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

interface ListTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  isFilterOn: boolean;
  table: ReactTable<TData>;
  Paginate: ReactNode;
}

export function ListTable<TData, TValue>({ table, columns, isFilterOn, Paginate }: ListTableProps<TData, TValue>) {
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation('common');

  useEffect(() => {
    const PADDING_X_VALUE = 64;
    const updateSize = () => {
      setTimeout(() => {
        if (tableWrapperRef.current) {
          const wrapperWidth = document.getElementById('scrollArea')?.getBoundingClientRect().width;
          if (wrapperWidth) tableWrapperRef.current.style.maxWidth = wrapperWidth - PADDING_X_VALUE + 'px';
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
        <Table className="w-full" {...(!table.getRowModel().rows?.length && { containerClassName: 'flex' })}>
          <TableHeader className="sticky top-0 bg-primary-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <EmptyState columnsLength={columns.length} filtered={isFilterOn} />
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
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
