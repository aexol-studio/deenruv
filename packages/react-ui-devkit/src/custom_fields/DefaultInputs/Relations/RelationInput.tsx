import { useMemo, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/atoms/dialog';
import { AssetUploadButton, Button, ImagePlaceholder, Label, ScrollArea } from '@/components';
import { cn } from '@/lib/utils';
import { useCustomFields } from '@/custom_fields';
import { useList } from '@/useList';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { type ResolverInputTypes } from '@deenruv/admin-types';
import { apiClient } from '@/zeus-client';
import { CustomFieldSelectorsType, customFieldSelectors } from '@/selectors';

type CF = CustomFieldSelectorsType;

type CommonFields = {
    [K in keyof CF]: CF[K];
}[keyof CF];

export const RelationInput = <K extends keyof CF>({ entityName }: { entityName: K }) => {
    const { value, label, field, setValue } = useCustomFields<
        'RelationCustomFieldConfig',
        CommonFields | undefined
    >();
    const [modalOpened, setModalOpened] = useState(false);
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

    const img = useMemo(() => getImg(value), [value]);

    const [selected, setSelected] = useState<typeof value>();

    const onOpenChange = (open: boolean) => {
        value && setSelected(value);
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
        } as any);
        return response as { items: CommonFields[]; totalItems: number };
    };

    const {
        objects: entities,
        Paginate,
        refetch,
    } = useList({
        route: async ({ page, perPage }) => {
            const entities = await getEntities({ skip: (page - 1) * perPage, take: perPage });
            return { items: entities.items, totalItems: entities.totalItems };
        },
        listType: `modal-assets-list`,
        options: {
            skip: !modalOpened,
        },
    });

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
            </div>
            <DialogContent className="max-h-[80vh] max-w-[80vw] overflow-auto">
                <DialogHeader>
                    <DialogTitle>{t(`custom-fields.${entityName.toLowerCase()}.title`)}</DialogTitle>
                    <DialogDescription>
                        {t(`custom-fields.${entityName.toLowerCase()}.description`)}
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[50vh] p-2">
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
                                    selected && setValue(selected);
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
