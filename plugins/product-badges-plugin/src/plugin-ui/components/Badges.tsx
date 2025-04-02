import React, { useState, type MouseEvent, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { FromSelector } from '../zeus';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Dialog,
    DialogTrigger,
    useLazyQuery,
    useMutation,
    useSettings,
} from '@deenruv/react-ui-devkit';
import { useLocation } from 'react-router-dom';
import { BadgesModal } from './BadgesModal';
import { translationNS } from '../translation-ns';
import { ProductBadgesQuery } from '../graphql/queries';
import { BadgeSelector } from '../graphql/selectors';
import { RemoveBadgeMutation } from '../graphql/mutations';

export type BadgeType = FromSelector<typeof BadgeSelector, 'Badge'>;

export const Badges = () => {
    const [editedBadge, setEditedBadge] = useState<BadgeType>();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation(translationNS);
    const { pathname } = useLocation();
    const [removeBadge] = useMutation(RemoveBadgeMutation);
    const contentLng = useSettings(p => p.translationsLanguage);

    console.log('ącontentLng', contentLng);

    const productId = useMemo(() => pathname.match(/\/products\/(\d+)(\/.*)?$/)?.[1] || '', [pathname]);

    const [fetchBadges, { data: badgesData }] = useLazyQuery(ProductBadgesQuery);

    const badges = badgesData?.getProductBadges || [];

    const closeHandler = () => {
        setOpen(false);
        setEditedBadge(undefined);
    };

    const editHandler = (e: MouseEvent<HTMLButtonElement>) => (badge: BadgeType) => {
        setEditedBadge(badge);
        setOpen(true);
        e.stopPropagation();
    };

    const removeHandler = async (id: string) => {
        try {
            setLoading(true);
            await removeBadge({ id });

            await fetchBadges({ productId });
            toast.success(t('modal.remove.success'));
        } catch (err) {
            console.log(err);
            toast.error(t('modal.remove.error'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBadges({ productId });
    }, [contentLng]);

    if (!productId) return null;
    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                            <CardTitle>{t('title')}</CardTitle>
                            <CardDescription>{t('description')}</CardDescription>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <Dialog
                                open={open}
                                onOpenChange={open => {
                                    if (!open) closeHandler();
                                    if (open) setOpen(true);
                                }}
                            >
                                <DialogTrigger asChild>
                                    <Button size="sm" className="h-10">
                                        <Plus />
                                    </Button>
                                </DialogTrigger>
                                {open && (
                                    <BadgesModal
                                        closeHandler={() => setOpen(false)}
                                        productId={productId}
                                        badge={editedBadge}
                                        onSuccess={() => fetchBadges({ productId })}
                                    />
                                )}
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        {!badges.length && <span>{t('not-found')}</span>}
                        <div className="flex flex-col gap-1 mt-2">
                            {badges.map((el, idx) => (
                                <div key={el.id} className="flex flex-col gap-1">
                                    {idx !== 0 && <hr />}
                                    <div className="flex items-center justify-between gap-2">
                                        <span
                                            className="py-1 px-2 text-white font-semibold"
                                            style={{ backgroundColor: el.color }}
                                        >
                                            {el.name}
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                disabled={loading}
                                                onClick={e => editHandler(e)(el)}
                                            >
                                                <Info size={18} />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                disabled={loading}
                                                onClick={() => removeHandler(el.id)}
                                            >
                                                <Trash size={18} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};
