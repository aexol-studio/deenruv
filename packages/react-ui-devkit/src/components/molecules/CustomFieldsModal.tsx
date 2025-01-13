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
import { CustomFieldSelectorsType } from '@/selectors';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

type CF = CustomFieldSelectorsType;

type CommonFields = {
    [K in keyof CF]: CF[K];
}[keyof CF];

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

    const { value, label, field, setValue } = useCustomFields<
        'RelationCustomFieldConfig',
        CommonFields | undefined
    >();

    const img = useMemo(() => getImg(value), [value]);

    return (
        <Dialog open={modalOpened} onOpenChange={onOpenChange}>
            <div className="flex flex-col gap-2">
                <Label>{label || field?.name}</Label>
                {!value ? (
                    <ImagePlaceholder />
                ) : (
                    <div className="flex flex-wrap gap-3">
                        <div>
                            <div className="h-32 w-32 relative">
                                {!img ? (
                                    <ImagePlaceholder />
                                ) : (
                                    <img src={img} alt={value.name} className="object-fill h-full w-full" />
                                )}
                            </div>
                            {isProduct(value) && <span>{value.name}</span>}
                            {isProductVariant(value) && (
                                <>
                                    <p>{value.name}</p>
                                    <p className="text-sm text-muted-foreground">{value.sku}</p>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {!field?.readonly && (
                    <div className="flex gap-2">
                        {!value ? (
                            <DialogTrigger asChild>
                                <Button variant="secondary" size="sm" onClick={() => setModalOpened(true)}>
                                    {t(`custom-fields.${entityName.toLowerCase()}.pick`)}
                                </Button>
                            </DialogTrigger>
                        ) : (
                            <Button variant="destructive" size="sm" onClick={() => setValue(undefined)}>
                                {t('remove')}
                            </Button>
                        )}
                    </div>
                )}
            </div>
            <DialogContent className="max-h-[80vh] max-w-[80vw] overflow-auto">
                <DialogHeader>
                    <DialogTitle>{t(`custom-fields.${entityName.toLowerCase()}.title`)}</DialogTitle>
                    <DialogDescription>
                        {t(`custom-fields.${entityName.toLowerCase()}.description`)}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[60vh] p-2">
                    <SearchInput
                        searchString={searchString}
                        setSearchString={setSearchString}
                        placeholder={t('search.AssetFilterParameter.placeholder')}
                    />

                    <div className="flex flex-wrap">
                        {entities?.map(entity => {
                            return (
                                <div
                                    key={entity.id}
                                    className={cn(
                                        'w-1/4 cursor-pointer border-2 p-2',
                                        selected?.id === entity.id && 'border-blue-500',
                                    )}
                                    onClick={() => setSelected(entity)}
                                >
                                    <img
                                        src={getImg(entity)}
                                        alt={entity.name}
                                        className="h-32 w-full object-contain"
                                    />
                                    <span>{entity.name}</span>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <div className="flex w-full flex-col gap-2">
                        {Paginate}
                        <div className="flex justify-end gap-2">
                            {isAsset(value) && (
                                <AssetUploadButton refetch={refetch}>{t('upload')}</AssetUploadButton>
                            )}
                            <Button
                                onClick={() => {
                                    if (selected) setValue(selected);
                                    onOpenChange(false);
                                }}
                                variant={selected ? 'action' : 'secondary'}
                                disabled={!selected}
                                size="lg"
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
