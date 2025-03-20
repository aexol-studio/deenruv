import React, { PropsWithChildren } from 'react';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { SortOrder } from '@deenruv/admin-types';
import { PaginationInput } from '@/types/models';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../../../atoms';
import { SelectIcon } from '@radix-ui/react-select';
import { cn } from '@/lib/utils.js';
import { TABLE_LABEL_STYLES } from '@/components/templates/DetailList/_components/TableLabel.js';

const DEFAULT_SORT = 'default';

export const SortSelect: React.FC<
    PropsWithChildren<{
        sortKey: string;
        currSort: PaginationInput['sort'];
        onClick: (sortDirection: SortOrder | undefined) => void;
        className?: string;
    }>
> = ({ currSort, onClick, children, sortKey, className }) => {
    const isCurrentSort = currSort?.key === sortKey;
    const value = isCurrentSort ? currSort?.sortDir : DEFAULT_SORT;

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Select
                value={value}
                onValueChange={direction => {
                    onClick(direction === DEFAULT_SORT ? undefined : (direction as SortOrder));
                }}
            >
                <SelectTrigger
                    className={cn(
                        '-ml-3 h-8 w-fit border-none text-xs hover:bg-accent data-[state=open]:bg-accent [&>svg:last-child]:hidden',
                        TABLE_LABEL_STYLES,
                    )}
                >
                    {children}
                    <SelectIcon asChild>
                        {!isCurrentSort ? (
                            <ChevronsUpDown className="ml-2.5 size-4" aria-hidden="true" />
                        ) : currSort?.sortDir === SortOrder.ASC ? (
                            <ArrowUp className="ml-2.5 size-4" aria-hidden="true" />
                        ) : currSort?.sortDir === SortOrder.DESC ? (
                            <ArrowDown className="ml-2.5 size-4" aria-hidden="true" />
                        ) : (
                            <ChevronsUpDown className="ml-2.5 size-4" aria-hidden="true" />
                        )}
                    </SelectIcon>
                </SelectTrigger>
                <SelectContent align="start">
                    <>
                        <SelectItem value={SortOrder.ASC} checkmarkAtEnd>
                            <span className="flex items-center">
                                <ArrowUp
                                    className="mr-2 size-3.5 text-muted-foreground/70"
                                    aria-hidden="true"
                                />
                                Asc
                            </span>
                        </SelectItem>
                        <SelectItem value={SortOrder.DESC} checkmarkAtEnd>
                            <span className="flex items-center">
                                <ArrowDown
                                    className="mr-2 size-3.5 text-muted-foreground/70"
                                    aria-hidden="true"
                                />
                                Desc
                            </span>
                        </SelectItem>
                        <SelectItem value={DEFAULT_SORT} checkmarkAtEnd>
                            <span className="flex items-center">
                                <ChevronsUpDown
                                    className="mr-2 size-3.5 text-muted-foreground/70"
                                    aria-hidden="true"
                                />
                                Default
                            </span>
                        </SelectItem>
                    </>
                </SelectContent>
            </Select>
        </div>
    );
};
