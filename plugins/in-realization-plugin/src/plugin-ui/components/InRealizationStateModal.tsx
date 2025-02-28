import {
    Button,
    cn,
    Label,
    ModalLocationsTypes,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Calendar,
    Textarea,
    ImageWithPreview,
    AssetsModalInput,
    useMutation,
} from '@deenruv/react-ui-devkit';
import { CalendarIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { DO_REALIZATION } from '../graphql/mutations.js';

const REALIZATION_STATE = 'InRealization';
const COLORS = ['BIAŁA', 'ŻÓŁTA', 'POMARAŃCZOWA', 'RÓŻOWA', 'ZIELONA', 'CZERWONA'];
const DEADLINE_DAYS = 7;
const DAY = 24 * 60 * 60 * 1000;

export const InRealizationStateModal = ({
    data: { state, order, beforeSubmit },
}: {
    data: ModalLocationsTypes['manual-order-state'];
}) => {
    const [mutate] = useMutation(DO_REALIZATION);
    const { t } = useTranslation('orders');
    const [form, setForm] = useState<{
        plannedDate: Date | undefined;
        deadlineDate: Date | undefined;
        color: string;
        note: string;
        selectedAsset: { id: string; orderLineID: string; preview: string }[];
    }>({
        plannedDate: new Date(),
        deadlineDate: new Date(new Date().getTime() + DEADLINE_DAYS * DAY),
        color: COLORS[0],
        note: '',
        selectedAsset:
            order?.lines.map(line => ({
                id:
                    line.productVariant.featuredAsset?.id ||
                    line.productVariant.product.featuredAsset?.id ||
                    '',
                orderLineID: line.id,
                preview:
                    line.productVariant.featuredAsset?.preview ||
                    line.productVariant.product.featuredAsset?.preview ||
                    '',
            })) || [],
    });

    const addRealization = async () => {
        if (!order || !form.deadlineDate || !form.plannedDate) return;
        const { registerRealization } = await mutate({
            input: {
                orderID: order.id,
                color: form.color,
                finalPlannedAt: format(form.deadlineDate, 'yyyy-MM-dd'),
                plannedAt: format(form.plannedDate, 'yyyy-MM-dd'),
                assets: form.selectedAsset,
                note: form.note,
            },
        });
        if (!registerRealization?.url) {
            toast.error('Error');
            return;
        }
        window.open(registerRealization.url, '_blank');
    };

    useEffect(() => {
        if (state !== REALIZATION_STATE) return;
        beforeSubmit.current = addRealization;
        return () => {
            beforeSubmit.current = undefined;
        };
    }, [state]);
    if (state !== REALIZATION_STATE) return null;

    return (
        <div className="flex max-h-[60vh] w-auto  min-w-[60vw] max-w-[95vw] flex-col gap-2 overflow-y-auto pr-1">
            <div className="flex gap-4">
                <div className="flex w-[280px] flex-col gap-4">
                    <div>
                        <Label>{t('changeStatus.planned')}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className={cn(
                                        'w-[280px] justify-start text-left font-normal',
                                        !form.plannedDate && 'text-muted-foreground',
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {form.plannedDate ? (
                                        format(form.plannedDate, 'PPP')
                                    ) : (
                                        <span>{t('changeStatus.datePlaceholder')}</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={form.plannedDate}
                                    onSelect={date => setForm(prev => ({ ...prev, plannedDate: date }))}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Label>{t('changeStatus.deadline')}</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className={cn(
                                        'w-[280px] justify-start text-left font-normal',
                                        !form.plannedDate && 'text-muted-foreground',
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {form.deadlineDate ? (
                                        format(form.deadlineDate, 'PPP')
                                    ) : (
                                        <span>{t('changeStatus.datePlaceholder')}</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={form.deadlineDate}
                                    onSelect={date => setForm(prev => ({ ...prev, deadlineDate: date }))}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div>
                        <Label>{t('changeStatus.color')}</Label>
                        <Select
                            name="color"
                            value={form.color}
                            onValueChange={e => setForm(prev => ({ ...prev, color: e }))}
                        >
                            <SelectTrigger className=" w-[280px] ">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {COLORS.map(c => (
                                        <SelectItem key={c} value={c}>
                                            {c}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>{t('changeStatus.info')}</Label>
                        <Textarea
                            className="h-[60px] w-[280px]  resize-none"
                            maxLength={64}
                            value={form.note}
                            onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))}
                        />
                        <Label className="text-muted-foreground text-xs ">
                            {t('changeStatus.charLeft', { value: 64 - form.note.length })}
                        </Label>
                    </div>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                    <Label>{t('changeStatus.selectImages')}</Label>
                    <div className="flex max-h-[calc(60vh-70px)] flex-1 flex-col gap-2 overflow-y-auto pr-2">
                        {order?.lines.map(line => {
                            const onAssetChange = (image?: { id: string; preview: string }) => {
                                setForm(prev => {
                                    const selectedAsset = prev.selectedAsset.map(asset => {
                                        if (asset.orderLineID === line.id) {
                                            return {
                                                orderLineID: asset.orderLineID,
                                                id: image?.id || '',
                                                preview: image?.preview || '',
                                            };
                                        }
                                        return asset;
                                    });
                                    return { ...prev, selectedAsset };
                                });
                            };
                            return (
                                <Line
                                    key={line.id}
                                    line={line}
                                    asset={form.selectedAsset.find(a => a.orderLineID === line.id)}
                                    onAssetChange={onAssetChange}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Line: React.FC<{
    line: ModalLocationsTypes['manual-order-state']['order']['lines'][number];
    asset?: { id: string; preview: string };
    onAssetChange: (asset?: { id: string; preview: string }) => void;
}> = ({ line, asset, onAssetChange }) => {
    return (
        <div key={line.id} className="flex items-center gap-4">
            <ImageWithPreview
                src={asset?.preview}
                imageClassName="h-20 w-20 object-contain"
                alt={asset?.id || line.id}
            />
            <span className="flex-1">{line.productVariant?.name || line.productVariant?.product?.name}</span>
            <AssetsModalInput value={asset} setValue={onAssetChange} />
        </div>
    );
};
