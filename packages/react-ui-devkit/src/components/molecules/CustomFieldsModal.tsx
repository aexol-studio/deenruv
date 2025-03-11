'use client';

import {
    AssetUploadButton,
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    ImagePlaceholder,
    Label,
    ScrollArea,
} from '@/components/atoms';
import { SearchInput } from '@/components/molecules/SearchInput';
import { useCustomFields } from '@/custom_fields';
import { cn } from '@/lib';
import type { CustomFieldSelectorsType } from '@/selectors';
import { Check, ImageIcon } from 'lucide-react';
import React from 'react';
import { type Dispatch, type SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type CF = CustomFieldSelectorsType;

type CommonFields = { [K in keyof CF]: CF[K] }[keyof CF];
const withAsset = ['Asset', 'Product', 'ProductVariant'];

interface CustomFieldsModal {
    modalOpened: boolean;
    setModalOpened: Dispatch<SetStateAction<boolean>>;
    onOpenChange: (value: boolean) => void;
    searchString: string;
    setSearchString: Dispatch<SetStateAction<string>>;
    entityName: string;
    entities: CommonFields[] | undefined;
    selected: CommonFields | undefined;
    setSelected: Dispatch<SetStateAction<CommonFields | undefined>>;
    Paginate: React.ReactNode;
    refetch: () => void;
}

export const CustomFieldsModal: React.FC<CustomFieldsModal> = ({
    refetch,
    Paginate,
    selected,
    setSelected,
    entities,
    modalOpened,
    setModalOpened,
    onOpenChange,
    entityName,
    searchString,
    setSearchString,
}) => {
    const { t } = useTranslation('common');

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

    const { disabled, value, label, field, setValue } = useCustomFields<CommonFields | undefined>();

    const img = useMemo(() => getImg(value), [value]); // Updated to include entityName as a dependency

    return (
        <Dialog open={modalOpened} onOpenChange={onOpenChange}>
            <div className="flex flex-col gap-3">
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label || field?.name}
                </Label>
                {field && 'entity' in field && field?.entity && withAsset.includes(field?.entity) ? (
                    <>
                        {!value ? (
                            <div className="border border-dashed border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                                <ImagePlaceholder />
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                <div className="bg-white dark:bg-gray-800 rounded-md shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
                                    <div className="h-32 w-32 relative">
                                        {!img ? (
                                            <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                                                <ImageIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                                            </div>
                                        ) : (
                                            <img
                                                src={img || '/placeholder.svg'}
                                                alt={value.name}
                                                className="object-cover h-full w-full"
                                            />
                                        )}
                                    </div>
                                    <div className="p-2">
                                        {isProduct(value) && (
                                            <span className="text-sm font-medium">{value.name}</span>
                                        )}
                                        {isProductVariant(value) && (
                                            <>
                                                <p className="text-sm font-medium truncate">{value.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {value.sku}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {!value ? (
                            <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                                {t('noValue')}
                            </span>
                        ) : (
                            <span className="text-sm font-medium px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-md">
                                {'name' in value ? value.name : `Cannot parse ${entityName} value`}
                            </span>
                        )}
                    </>
                )}
                {!field?.readonly && (
                    <div className="flex gap-2">
                        {!value ? (
                            <>
                                {!disabled ? (
                                    <DialogTrigger asChild>
                                        <Button
                                            disabled={disabled}
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => setModalOpened(true)}
                                            className="transition-all hover:bg-gray-200 dark:hover:bg-gray-700"
                                        >
                                            {t(`custom-fields.${entityName.toLowerCase()}.pick`)}
                                        </Button>
                                    </DialogTrigger>
                                ) : null}
                            </>
                        ) : (
                            <Button
                                disabled={disabled}
                                variant="destructive"
                                size="sm"
                                onClick={() => setValue(undefined)}
                                className="transition-all hover:bg-red-600"
                            >
                                {t('remove')}
                            </Button>
                        )}
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
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {entities?.map(entity => {
                                const isSelected = selected?.id === entity.id;
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
                                        onClick={() => setSelected(entity)}
                                    >
                                        <div className="relative">
                                            {withAsset.includes(entityName) && (
                                                <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative">
                                                    {entityImg ? (
                                                        <img
                                                            src={entityImg || '/placeholder.svg'}
                                                            alt={entity.name}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center">
                                                            <ImageIcon className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                                                        </div>
                                                    )}
                                                    {isSelected && (
                                                        <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                                                            <div className="bg-primary-500 text-white p-1 rounded-full">
                                                                <Check className="h-5 w-5" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="p-3">
                                                <span className="text-sm font-medium line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                                                    {entity.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {entities?.length === 0 && (
                                <div className="col-span-full flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                                    No items found
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
                <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex w-full flex-col gap-3">
                        <div className="flex-1">{Paginate}</div>
                        <div className="flex justify-end gap-3">
                            {isAsset(value) && (
                                <AssetUploadButton refetch={refetch}>{t('upload')}</AssetUploadButton>
                            )}
                            <Button
                                onClick={() => {
                                    if (selected) setValue(selected);
                                    onOpenChange(false);
                                }}
                                variant={selected ? 'action' : 'secondary'}
                                disabled={!selected || disabled}
                                size="lg"
                                className={cn(
                                    'transition-all',
                                    selected
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
