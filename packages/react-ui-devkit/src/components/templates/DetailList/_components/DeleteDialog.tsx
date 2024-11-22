import {
    Button,
    DialogTitle,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from '@/components';
import React from 'react';
import { useTranslation } from 'react-i18next';

type ConfirmationDialogProps<T extends { id: string; name: string }> = {
    onConfirmDelete: () => void;
    setDeleteDialogOpened: (e: boolean) => void;
    itemsToDelete: T[];
    deleteDialogOpened: boolean;
};

export function DeleteDialog<T extends { id: string; name: string }>({
    onConfirmDelete,
    setDeleteDialogOpened,
    deleteDialogOpened,
    itemsToDelete,
}: ConfirmationDialogProps<T>) {
    const { t } = useTranslation('table');

    return (
        <Dialog open={deleteDialogOpened} onOpenChange={setDeleteDialogOpened}>
            <DialogContent>
                <DialogTitle>{t('bulk.delete.title')}</DialogTitle>
                <div className="flex max-h-[50vh] flex-col gap-2">
                    <DialogDescription className="text-primary text-lg">
                        {t('bulk.delete.description')}
                    </DialogDescription>
                    <DialogDescription>
                        {itemsToDelete.map(n => (
                            <div key={n.id}>{n.name}</div>
                        ))}
                    </DialogDescription>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost">{t('bulk.delete.cancel')}</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={onConfirmDelete}>
                        {t('bulk.delete.confirm', { amount: itemsToDelete.length })}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
