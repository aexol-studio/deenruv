import { useEffect, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { ChevronDown, CircleX } from 'lucide-react';
import { apiClient } from '@/zeus_client/deenruvAPICall.js';
import { cn } from '@/lib/utils.js';
import React from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Button,
    Input,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Label,
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    ImageWithPreview,
} from '@/components';

import { assetsSelector, AssetType } from '@/selectors/AssetsSelector.js';
import { ASSETS_ITEMS_PER_PAGE, ASSETS_PER_PAGE, useAssets } from '@/hooks/useAssets.js';
const arrayRange = (start: number, stop: number) =>
    Array.from({ length: stop - start + 1 }, (_, index) => start + index);

export interface AssetsModalChangeType {
    id: string;
    preview: string;
    source: string;
}

/**
 * A modal that allows the user to select an asset from a list of available assets.
 *
 * @param {AssetsModalChangeType} value - The currently selected asset.
 * @param {(value?: AssetsModalChangeType) => void} setValue - Callback invoked whenever the selected asset changes.
 */
export function AssetsModalInput({
    value,
    setValue,
}: {
    value?: { id: string; preview: string };
    setValue: (value?: { id: string; preview: string; source: string }) => void;
}) {
    const { t } = useTranslation('common');
    const [selectedAsset, setSelectedAsset] = useState<AssetType>();
    const [open, setOpen] = useState(false);
    const [tags, setTags] = useState<{ id: string; value: string }[]>([]);
    const {
        assets,
        error,
        isPending,
        totalItems,
        page,
        perPage,
        searchTags,
        searchTerm,
        setPage,
        setPerPage,
        setSearchTags,
        setSearchTerm,
        totalPages,
        setSkip,
    } = useAssets({ skip: true });

    useEffect(() => {
        if (value?.id) {
            apiClient('query')({
                assets: [
                    { options: { take: 1, filter: { id: { eq: value.id as string } } } },
                    { items: assetsSelector },
                ],
            }).then(({ assets }) => {
                setSelectedAsset(assets.items[0]);
            });
        }
    }, [value]);

    useEffect(() => {
        apiClient('query')({
            tags: [{}, { items: { id: true, value: true } }],
        }).then(({ tags }) => {
            setTags(tags.items);
        });
    }, []);

    const pagesToShow: (number | 'ellipsis')[] = useMemo(
        () =>
            totalPages <= 7
                ? arrayRange(1, totalPages)
                : page < 4
                  ? [...arrayRange(1, 5), 'ellipsis', totalPages]
                  : page >= totalPages - 2
                    ? [1, 'ellipsis', ...arrayRange(totalPages - 4, totalPages)]
                    : [1, 'ellipsis', ...arrayRange(page - 1, page + 1), 'ellipsis', totalPages],
        [totalPages, page],
    );

    useEffect(() => {
        setSkip(!open);
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                    {t('asset.dialogButton')}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-[80vw]">
                <DialogHeader>
                    <DialogTitle> {t('asset.dialogTitle')}</DialogTitle>
                </DialogHeader>
                <div className="flex h-[calc(90vh-140px)] w-full flex-col gap-2 ">
                    <div className=" flex gap-2">
                        <Input
                            className="w-80"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.currentTarget.value)}
                            placeholder={t('asset.dialogSearchPlaceholder')}
                        />
                        <div className="flex flex-wrap gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        {t('search.addFilter')} <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="max-h-[400px] overflow-y-auto">
                                    {tags
                                        .filter(i => !searchTags.some(a => a === i.value))
                                        .map(i => (
                                            <DropdownMenuItem
                                                key={i.id}
                                                onClick={() => setSearchTags(p => [...p, i.value])}
                                            >
                                                {i.value}
                                            </DropdownMenuItem>
                                        ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {searchTags.map(i => (
                                <div
                                    onClick={() => setSearchTags(p => p.filter(a => a !== i))}
                                    className=" border-1 flex h-[40px] cursor-pointer items-center gap-2 rounded border px-2 py-1 text-sm "
                                    key={i}
                                >
                                    {i}
                                    <CircleX size={14} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full flex-1 overflow-y-auto  pr-1">
                        {isPending ? (
                            <div className="flex h-full w-full items-center justify-center">
                                <div className="customSpinner" />
                            </div>
                        ) : error || assets.length === 0 ? (
                            <div className=" flex h-full w-full items-center justify-center">
                                <Label>{error || t('asset.noImages')}</Label>
                            </div>
                        ) : (
                            <div className="flex w-full flex-1 flex-wrap gap-2">
                                {assets.map(asset => (
                                    <div
                                        key={asset.id}
                                        className={cn(
                                            'h-[180px] grow basis-1/5  cursor-pointer overflow-hidden rounded border-2',
                                            selectedAsset?.id === asset.id && 'border-blue-500',
                                        )}
                                        onClick={() =>
                                            setSelectedAsset(p => (p?.id !== asset.id ? asset : undefined))
                                        }
                                    >
                                        <ImageWithPreview
                                            imageClassName="w-full h-[150px] object-cover"
                                            src={asset.preview}
                                            alt={asset.name}
                                        />
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <div className="max-w-[150px] truncate px-2 pt-1.5 text-xs">
                                                    {asset.name}
                                                </div>
                                            </HoverCardTrigger>
                                            <HoverCardContent
                                                className={cn('rounded border p-1 text-center text-xs')}
                                            >
                                                <div className="">{asset.name}</div>
                                            </HoverCardContent>
                                        </HoverCard>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="gap-2, flex w-full flex-wrap justify-between">
                        <div className="flex gap-2">
                            <div className="m-auto whitespace-nowrap text-center">
                                {(page - 1) * perPage + 1} - {page * perPage} of {totalItems}
                            </div>
                            <Select
                                value={perPage.toString()}
                                onValueChange={e => setPerPage(parseInt(e) as ASSETS_PER_PAGE)}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder={t('perPagePlaceholder')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {ASSETS_ITEMS_PER_PAGE.map(i => (
                                        <SelectItem key={i} value={i.toString()}>
                                            {t('asset.perPageValue', { value: i })}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Pagination>
                                <PaginationContent>
                                    <PaginationPrevious
                                        isActive={page !== 1}
                                        onClick={() => setPage(p => p - 1)}
                                    />
                                    {pagesToShow.map((i, index) => (
                                        <PaginationItem key={index}>
                                            {i === 'ellipsis' ? (
                                                <PaginationEllipsis />
                                            ) : (
                                                <PaginationLink
                                                    isActive={i === page}
                                                    onClick={() => setPage(i)}
                                                >
                                                    {i}
                                                </PaginationLink>
                                            )}
                                        </PaginationItem>
                                    ))}
                                    <PaginationNext
                                        isActive={page !== totalPages}
                                        onClick={() => setPage(p => p + 1)}
                                    />
                                </PaginationContent>
                            </Pagination>
                        </div>
                        <div className="flex flex-1 justify-end gap-2">
                            <DialogClose asChild>
                                <Button variant="ghost">{t('asset.cancel')}</Button>
                            </DialogClose>
                            <DialogClose asChild>
                                <Button
                                    disabled={!selectedAsset}
                                    onClick={() => {
                                        if (selectedAsset) setValue(selectedAsset);
                                        else setValue(undefined);
                                    }}
                                >
                                    {t('asset.confirmButton')}
                                </Button>
                            </DialogClose>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
