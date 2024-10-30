import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button, ImagePlaceholder, Label, ScrollArea } from '@/components';
import { cn } from '@/lib/utils';
import { useCustomFields } from '@/custom_fields';
import { useList } from '@/useList';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { type ResolverInputTypes } from '@deenruv/admin-types';
import { client } from '@/zeus-client';
import { CustomFieldSelectorsType, customFieldSelectors } from '@/selectors';

const getProducts = async (options: ResolverInputTypes['ProductListOptions']) => {
    const response = await client('query')({
        products: [
            { options },
            {
                totalItems: true,
                items: customFieldSelectors['Product'],
            },
        ],
    });
    return response.products;
};

export function ProductRelationInput() {
    const { value, label, field, setValue } = useCustomFields<
        'RelationCustomFieldConfig',
        CustomFieldSelectorsType['Product'] | null
    >();
    const [modalOpened, setModalOpened] = useState(false);
    const { t } = useTranslation('common');

    const [selected, setSelected] = useState<typeof value>(null);

    const onOpenChange = (open: boolean) => {
        setSelected(null);
        setModalOpened(open);
    };

    const { objects: products, Paginate } = useList({
        route: async ({ page, perPage }) => {
            const products = await getProducts({ skip: (page - 1) * perPage, take: perPage });
            return { items: products.items, totalItems: products.totalItems };
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
                <div className="flex flex-col gap-2">
                    {(!value || !value?.featuredAsset?.preview) && <ImagePlaceholder />}
                    {value?.featuredAsset?.preview && (
                        <img
                            src={value.featuredAsset.preview}
                            alt={value.name}
                            className="object-fill h-32 w-fit"
                        />
                    )}
                    {value && <span className="text-xs">{value.name}</span>}
                </div>
                <div>
                    {!value ? (
                        <DialogTrigger asChild>
                            <Button variant="secondary" size="sm" onClick={() => setModalOpened(true)}>
                                {t('product.dialogButton')}
                            </Button>
                        </DialogTrigger>
                    ) : (
                        <Button variant="destructive" size="sm" onClick={() => setValue(null)}>
                            {t('remove')}
                        </Button>
                    )}
                </div>
            </div>
            <DialogContent className="max-h-[80vh] max-w-[80vw] overflow-auto">
                <DialogHeader>
                    <DialogTitle>{t('product.dialogTitle')}</DialogTitle>
                    {/* <DialogDescription>{t('product.description')}</DialogDescription> */}
                </DialogHeader>
                <ScrollArea className="h-[50vh] p-2">
                    <div className="flex flex-wrap">
                        {products?.map(product => (
                            <div
                                key={product.id}
                                className={cn(
                                    'w-1/4 cursor-pointer border-2 p-2',
                                    selected?.id === product.id && 'border-blue-500',
                                )}
                                onClick={() => {
                                    setSelected(product);
                                }}
                            >
                                <div className="flex justify-center items-center">
                                    {product.featuredAsset?.preview ? (
                                        <img
                                            src={product.featuredAsset?.preview}
                                            alt={product.name}
                                            className="h-32 w-full object-contain"
                                        />
                                    ) : (
                                        <ImagePlaceholder />
                                    )}
                                </div>
                                <span>{product.name}</span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <div className="flex w-full flex-col gap-2">
                        {Paginate}
                        <div className="flex justify-end gap-2">
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
}
