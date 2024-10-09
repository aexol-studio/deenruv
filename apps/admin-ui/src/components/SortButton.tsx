import React, { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { PaginationInput } from '@/lists/models';
import { SortOrder } from '@/zeus';

export const SortButton: React.FC<
  PropsWithChildren<{ sortKey: string; currSort: PaginationInput['sort']; onClick: () => void }>
> = ({ currSort, onClick, children, sortKey }) => {
  return (
    <Button className=" px-0" variant="ghost" onClick={onClick}>
      {children}
      {currSort && currSort.key === sortKey ? (
        currSort.sortDir === SortOrder.ASC ? (
          <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
          <ArrowDown className="ml-2 h-4 w-4" />
        )
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
};
