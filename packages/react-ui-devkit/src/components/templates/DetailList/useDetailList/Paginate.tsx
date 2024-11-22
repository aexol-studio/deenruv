import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
    Pagination,
    PaginationContent,
    PaginationPrevious,
    PaginationItem,
    PaginationEllipsis,
    PaginationLink,
    PaginationNext,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components';
import { arrayRange, ItemsPerPageType, SearchParamKey } from './types';
import React from 'react';
import { cn } from '@/lib';
import { PaginationInput } from '@/types';

export const Paginate = ({
    itemsPerPage,
    searchParamValues,
    total,
    totalPages,
    searchParams,
    setSearchParams,
}: {
    itemsPerPage: ItemsPerPageType;
    searchParamValues: PaginationInput;
    total: number;
    totalPages: number;
    searchParams: URLSearchParams;
    setSearchParams: (searchParams: URLSearchParams) => void;
}) => {
    const { t } = useTranslation('common');
    const pagesToShow: (number | string)[] = useMemo(
        () =>
            totalPages <= 7
                ? arrayRange(1, totalPages)
                : searchParamValues.page < 4
                  ? [...arrayRange(1, 5), 'ellipsis', totalPages]
                  : searchParamValues.page >= totalPages - 2
                    ? [1, 'ellipsis', ...arrayRange(totalPages - 4, totalPages)]
                    : [
                          1,
                          'ellipsis',
                          ...arrayRange(searchParamValues.page - 1, searchParamValues.page + 1),
                          'ellipsis',
                          totalPages,
                      ],
        [totalPages, searchParamValues],
    );

    return (
        <div className="flex gap-4">
            <div className="m-auto whitespace-nowrap text-center">
                {(searchParamValues.page - 1) * searchParamValues.perPage + 1} -{' '}
                {searchParamValues.page * searchParamValues.perPage} of {total}
            </div>
            <div className="mx-auto">
                <Select
                    value={itemsPerPage.find(i => i.value === searchParamValues.perPage)?.value.toString()}
                    onValueChange={e => {
                        searchParams.set(SearchParamKey.PER_PAGE, e);
                        searchParams.set(SearchParamKey.PAGE, '1');
                        setSearchParams(searchParams);
                    }}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t('perPagePlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                        {itemsPerPage.map(i => (
                            <SelectItem key={i.name} value={i.value.toString()}>
                                {t(`perPage.${i.name}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Pagination>
                <PaginationContent>
                    <PaginationPrevious
                        className={cn(
                            'opacity-100',
                            searchParamValues.page === 1 && 'cursor-not-allowed opacity-50',
                        )}
                        isActive={searchParamValues.page !== 1}
                        onClick={() => {
                            if (searchParamValues.page === 1) return;
                            searchParams.set(SearchParamKey.PAGE, (searchParamValues.page - 1).toString());
                            setSearchParams(searchParams);
                        }}
                    />
                    {pagesToShow.map((i, index) => (
                        <PaginationItem
                            key={index}
                            className={cn(
                                'hidden',
                                i !== (searchParamValues.page - 1).toString() && 'md:block',
                            )}
                        >
                            {i === 'ellipsis' ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink
                                    isActive={i === searchParamValues.page}
                                    onClick={() => {
                                        searchParams.set(SearchParamKey.PAGE, i.toString());
                                        setSearchParams(searchParams);
                                    }}
                                >
                                    {i}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                    <PaginationNext
                        className={cn(
                            'opacity-100',
                            searchParamValues.page === totalPages && 'cursor-not-allowed opacity-50',
                        )}
                        isActive={searchParamValues.page !== totalPages}
                        onClick={() => {
                            if (searchParamValues.page === totalPages) return;
                            searchParams.set(SearchParamKey.PAGE, (searchParamValues.page + 1).toString());
                            setSearchParams(searchParams);
                        }}
                    />
                </PaginationContent>
            </Pagination>
        </div>
    );
};
