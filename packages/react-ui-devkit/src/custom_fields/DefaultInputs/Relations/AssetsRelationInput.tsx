import { useState } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button, Label, ScrollArea } from '@/components';
import { cn } from '@/lib/utils';
import { ImageOff, ImageUp } from 'lucide-react';
import { useCustomFields } from '@/custom_fields';
import { useList } from '@/useList';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { $, type ResolverInputTypes } from '@deenruv/admin-types';
import { client, uploadClient } from '@/zeus-client';

const getAssets = async (options: ResolverInputTypes['AssetListOptions']) => {
    const response = await client('query')({
        assets: [
            { options },
            {
                totalItems: true,
                items: {
                    id: true,
                    preview: true,
                    name: true,
                },
            },
        ],
    });
    return response.assets;
};

export function AssetsRelationInput() {
    const { value, label, field, setValue } = useCustomFields<'RelationCustomFieldConfig'>();
    const [modalOpened, setModalOpened] = useState(false);
    const { t } = useTranslation('common');

    const [selected, setSelected] = useState<NonNullable<typeof assets>[number] | null>(null);

    const onOpenChange = (open: boolean) => {
        setSelected(null);
        setModalOpened(open);
    };

    const {
        objects: assets,
        Paginate,
        refetch,
    } = useList({
        route: async ({ page, perPage }) => {
            const assets = await getAssets({ skip: (page - 1) * perPage, take: perPage });
            return { items: assets.items, totalItems: assets.totalItems };
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
                <div className="w-32 h-32">
                    {!value ? (
                        <div className="flex flex-col items-center justify-center bg-muted p-3 h-full w-full">
                            <ImageOff size={60} />
                        </div>
                    ) : (
                        <img src={value.preview} alt={value.name} className="object-fill h-full w-full" />
                    )}
                </div>
                <div>
                    {!value ? (
                        <DialogTrigger asChild>
                            <Button variant="secondary" size="sm" onClick={() => setModalOpened(true)}>
                                {t('asset.dialogButton')}
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
                    <DialogTitle>{t('menu.assets')}</DialogTitle>
                    <DialogDescription>{t('asset.description')}</DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[50vh] p-2">
                    <div className="flex flex-wrap">
                        {assets?.map(asset => (
                            <div
                                key={asset.id}
                                className={cn(
                                    'w-1/4 cursor-pointer border-2 p-2',
                                    selected?.id === asset.id && 'border-blue-500',
                                )}
                                onClick={() => {
                                    setSelected(asset);
                                }}
                            >
                                <img
                                    src={asset.preview}
                                    alt={asset.name}
                                    className="h-32 w-full object-contain"
                                />
                                <span>{asset.name}</span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <DialogFooter>
                    <div className="flex w-full flex-col gap-2">
                        {Paginate}
                        <div className="flex justify-end gap-2">
                            <Button
                                size="lg"
                                variant="secondary"
                                className="flex items-center gap-2"
                                onClick={() => {
                                    const fileInput = document.createElement('input');
                                    fileInput.type = 'file';
                                    fileInput.accept = 'image/*';
                                    fileInput.onchange = async e => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (!file) return;

                                        await uploadClient('mutation')(
                                            {
                                                createAssets: [
                                                    { input: $('input', '[CreateAssetInput!]!') },
                                                    {
                                                        __typename: true,
                                                        '...on Asset': { id: true },
                                                        '...on MimeTypeError': {
                                                            fileName: true,
                                                            mimeType: true,
                                                            errorCode: true,
                                                            message: true,
                                                        },
                                                    },
                                                ],
                                            },
                                            { variables: { input: [{ file }] } },
                                        );
                                        refetch();
                                    };
                                    fileInput.click();
                                }}
                            >
                                <ImageUp className="h-4 w-4" />
                                <span>{t('upload')}</span>
                            </Button>
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
