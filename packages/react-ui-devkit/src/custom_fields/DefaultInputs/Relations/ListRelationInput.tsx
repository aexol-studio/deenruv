'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/atoms/dialog';
import { AssetUploadButton, Button, ImagePlaceholder, Label, ScrollArea, SearchInput } from '@/components';
import { cn } from '@/lib/utils';
import { CircleX, ImageIcon, Plus, Search, Trash2 } from 'lucide-react';
import { useCustomFields } from '@/custom_fields';
import { useList } from '@/useList';
import { useTranslation } from 'react-i18next';
import type { ResolverInputTypes } from '@deenruv/admin-types';
import { type CustomFieldSelectorsType, customFieldSelectors } from '@/selectors';
import { apiClient } from '@/zeus_client';
import { useDebounce } from '@/hooks';
import React from 'react';

type CF = CustomFieldSelectorsType;

type CommonFields = {
    [K in keyof CF]: CF[K];
}[keyof CF];

export const ListRelationInput = <K extends keyof CF>({ entityName }: { entityName: K }) => {
    const { t } = useTranslation('common');
    const [modalOpened, setModalOpened] = useState(false);
    const [selected, setSelected] = useState<CommonFields[]>([]);
    const [searchString, setSearchString] = useState<string>('');
    const debouncedSearch = useDebounce(searchString, 500);
    const { disabled, value, label, field, setValue } = useCustomFields<CommonFields[]>();

    const {
        objects: entities,
        Paginate,
        refetch,
        setFilterField,
    } = useList({
        route: async ({ page, perPage, filter }) => {
            const entities = await getEntities({
                skip: (page - 1) * perPage,
                take: perPage,
                ...(filter && { filter }),
            });
            return { items: entities.items, totalItems: entities.totalItems };
        },
        listType: `modal-assets-list`,
        options: { skip: !modalOpened },
    });

    const isAsset = (_value?: CommonFields): _value is CF['Asset'] => entityName === 'Asset';
    const isProduct = (_value?: CommonFields): _value is CF['Product'] => entityName === 'Product';
    const isProductVariant = (_value?: CommonFields): _value is CF['ProductVariant'] =>
        entityName === 'ProductVariant';

    const getImg = (value?: CommonFields) => {
        if (isAsset(value)) return value?.preview;
        if (isProduct(value)) return value?.featuredAsset?.preview;
        if (isProductVariant(value))
            return value?.featuredAsset?.preview || value?.product?.featuredAsset?.preview;
    };

    const selectedIds = useMemo(() => selected?.map(el => el.id), [selected]);

    useEffect(() => {
        if (debouncedSearch.length < 1) return;
        setFilterField('name', { contains: debouncedSearch });
    }, [debouncedSearch, setFilterField]);

    const onOpenChange = (open: boolean) => {
        setSelected(value || []);
        setModalOpened(open);
    };

    const getEntities = async (options: ResolverInputTypes['AssetListOptions']) => {
        const responseEntityField = entityName.charAt(0).toLowerCase() + entityName.slice(1) + 's';

        const { [responseEntityField]: response } = await apiClient('query')({
            [responseEntityField]: [
                { options },
                {
                    totalItems: true,
                    items: customFieldSelectors[entityName],
                },
            ],
            // eslint-disable-next-line
        } as any);
        return response as { items: CommonFields[]; totalItems: number };
    };

    return (
        <Dialog open={modalOpened} onOpenChange={onOpenChange}>
            <div className="flex flex-col gap-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label || field?.name}
                </Label>
                {!value?.length ? (
                    <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                        <ImagePlaceholder />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {value.map(el => {
                            const img = getImg(el);
                            return (
                                <div
                                    key={el.id}
                                    className="group relative bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md"
                                >
                                    <div className="aspect-square relative">
                                        {!field?.readonly && (
                                            <button
                                                type="button"
                                                className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    setValue(value.filter(el2 => el.id !== el2.id));
                                                }}
                                                aria-label="Remove item"
                                            >
                                                <CircleX size={16} className="text-red-500" />
                                            </button>
                                        )}
                                        {!img ? (
                                            <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                <ImageIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                                            </div>
                                        ) : (
                                            <img
                                                src={img || '/placeholder.svg'}
                                                alt={el.name}
                                                className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
                                            />
                                        )}
                                    </div>
                                    <div className="p-2">
                                        {isProduct(el) && (
                                            <span className="text-sm font-medium line-clamp-1">
                                                {el.name}
                                            </span>
                                        )}
                                        {isProductVariant(el) && (
                                            <>
                                                <p className="text-sm font-medium line-clamp-1">{el.name}</p>
                                                <p className="text-xs text-muted-foreground line-clamp-1">
                                                    {el.sku}
                                                </p>
                                            </>
                                        )}
                                        {isAsset(el) && (
                                            <span className="text-sm font-medium line-clamp-1">
                                                {el.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                {!field?.readonly && (
                    <div className="flex gap-2">
                        {!!value?.length && (
                            <Button
                                disabled={disabled}
                                variant="destructive"
                                size="sm"
                                onClick={() => setValue([])}
                                className="flex items-center gap-1"
                            >
                                <Trash2 className="h-4 w-4" />
                                {t('custom-fields.clear')}
                            </Button>
                        )}
                        <DialogTrigger asChild>
                            <Button
                                disabled={disabled}
                                variant="secondary"
                                size="sm"
                                onClick={() => setModalOpened(true)}
                                className="flex items-center gap-1"
                            >
                                <Plus className="h-4 w-4" />
                                {t(`custom-fields.${entityName.toLowerCase()}.pick`)}
                            </Button>
                        </DialogTrigger>
                    </div>
                )}
            </div>
            <DialogContent className="max-h-[90vh] max-w-[70vw] md:max-w-[60vw] lg:max-w-[50vw] overflow-hidden rounded-lg border-0 shadow-lg">
                <DialogHeader className="pb-4 border-b border-gray-200 dark:border-gray-700">
                    <DialogTitle className="text-xl font-semibold">
                        {t(`custom-fields.${entityName.toLowerCase()}.title`)}
                    </DialogTitle>
                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                        {t(`custom-fields.${entityName.toLowerCase()}.description`)}
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <SearchInput
                        searchString={searchString}
                        setSearchString={setSearchString}
                        placeholder={t('search.AssetFilterParameter.placeholder')}
                    />
                    <ScrollArea className="h-[50vh] pr-4">
                        {!entities || entities.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-40 text-center">
                                <ImageIcon className="h-12 w-12 text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">No {entityName.toLowerCase()} found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {entities?.map(entity => {
                                    const isSelected = selectedIds?.includes(entity.id);
                                    const entityImg = getImg(entity);

                                    return (
                                        <div
                                            key={entity.id}
                                            className={cn(
                                                'group cursor-pointer rounded-lg overflow-hidden border transition-all duration-200',
                                                'hover:shadow-md hover:border-primary-400 dark:hover:border-primary-500',
                                                isSelected
                                                    ? 'border-primary-500 dark:border-primary-400 shadow-sm ring-2 ring-primary-200 dark:ring-primary-900'
                                                    : 'border-gray-200 dark:border-gray-700',
                                            )}
                                            onClick={() => {
                                                if (isSelected)
                                                    setSelected(prev =>
                                                        prev?.filter(el => el.id !== entity.id),
                                                    );
                                                else setSelected(prev => [...prev, entity]);
                                            }}
                                        >
                                            <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                                                {entityImg ? (
                                                    <img
                                                        src={entityImg || '/placeholder.svg'}
                                                        alt={entity.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center">
                                                        <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                                    </div>
                                                )}
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                                                        <div className="bg-primary-500 text-white p-1 rounded-full">
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width="14"
                                                                height="14"
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="3"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="text-white"
                                                            >
                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-2">
                                                <span className="text-sm font-medium line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                                    {entity.name}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </div>
                <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex w-full flex-col gap-3">
                        <div className="flex justify-center">{Paginate}</div>
                        <div className="flex justify-end gap-3">
                            {entityName === 'Asset' && (
                                <AssetUploadButton refetch={refetch}>
                                    <Plus className="h-4 w-4" />
                                    {t('upload')}
                                </AssetUploadButton>
                            )}
                            <Button
                                onClick={() => {
                                    if (selected) setValue(selected);
                                    onOpenChange(false);
                                }}
                                variant={selected.length ? 'action' : 'secondary'}
                                disabled={disabled}
                                size="lg"
                                className={cn(
                                    'transition-all min-w-[100px]',
                                    selected.length
                                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                                        : 'hover:bg-gray-200 dark:hover:bg-gray-700',
                                )}
                            >
                                {t('save')}
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
