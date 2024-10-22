import { useEffect, useState } from 'react';
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
import { Button, ScrollArea } from '@/components';
import { Chain, ResolverInputTypes } from '@/zeus';
import { cn } from '@/lib/utils';
import { ImageOff, ImageUp } from 'lucide-react';
import { useCustomFields } from '@/custom_fields';

import { useList } from '@/useList';
import React from 'react';

const client = Chain('/admin-api', { credentials: 'include' });

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
    const { value, setValue } = useCustomFields();
    const [selectedAsset, setSelectedAsset] = useState<{
        id: string;
        preview: string;
        name: string;
    } | null>(null);
    const { objects: assets, Paginate } = useList({
        route: async ({ page, perPage }) => {
            const assets = await getAssets({ skip: (page - 1) * perPage, take: perPage });
            return { items: assets.items, totalItems: assets.totalItems };
        },
        listType: `modal-assets-list`,
    });

    useEffect(() => {
        if (value) {
            getAssets({ take: 1, filter: { id: { eq: value as string } } }).then(assets => {
                setSelectedAsset(assets.items[0] || null);
            });
        }
    }, [value]);

    return (
        <Dialog>
            <div>
                <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                        Pick assets
                    </Button>
                </DialogTrigger>
                <div>
                    {!selectedAsset ? (
                        <div className="flex flex-col items-center justify-center gap-2 bg-muted p-3 mt-2">
                            <ImageOff size={50} />
                        </div>
                    ) : (
                        <div>
                            <img
                                src={selectedAsset.preview}
                                alt={selectedAsset.name}
                                className="h-32 w-32 object-fill"
                            />
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    setSelectedAsset(null);
                                    setValue('');
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <DialogContent className="max-h-[80vh] max-w-[80vw] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Assets</DialogTitle>
                    <DialogDescription>
                        Upload and manage assets that can be used in your content.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[700px] p-2">
                    <div className="flex flex-wrap">
                        {assets?.map(asset => (
                            <div
                                key={asset.id}
                                className={cn(
                                    'w-1/4 cursor-pointer border-2 p-2',
                                    selectedAsset?.id === asset.id && 'border-blue-500',
                                )}
                                onClick={() => {
                                    setSelectedAsset(asset);
                                    setValue(asset.id);
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
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = async e => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (!file) return;
                                    };
                                    input.click();
                                }}
                            >
                                <ImageUp className="h-4 w-4" />
                                <span>Upload</span>
                            </Button>
                            <Button variant="secondary" size="lg">
                                <DialogClose>{selectedAsset ? 'Save' : 'Cancel'}</DialogClose>
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
