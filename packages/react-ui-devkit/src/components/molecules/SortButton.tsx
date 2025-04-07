import React, { PropsWithChildren } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { SortOrder } from "@deenruv/admin-types";
import { PaginationInput } from "@/types/models";
import { Button } from "../atoms";

export const SortButton: React.FC<
  PropsWithChildren<{
    sortKey: string;
    currSort: PaginationInput["sort"];
    onClick: () => void;
  }>
> = ({ currSort, onClick, children, sortKey }) => {
  return (
    <Button className=" px-0" variant="ghost" onClick={onClick}>
      {children}
      {currSort && currSort.key === sortKey ? (
        currSort.sortDir === SortOrder.ASC ? (
          <ArrowUp className="ml-2 size-4" />
        ) : (
          <ArrowDown className="ml-2 size-4" />
        )
      ) : (
        <ArrowUpDown className="ml-2 size-4" />
      )}
    </Button>
  );
};
