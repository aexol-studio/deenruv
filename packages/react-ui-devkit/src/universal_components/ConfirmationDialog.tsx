import { Button } from '@/components/atoms/button.js';
import {
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogFooter,
} from '@/components/atoms/alert-dialog.js';
import React, { PropsWithChildren, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmationDialogProps {
    onConfirm: () => void;
    title?: string;
    description?: string;
}

/**
 * A modal that asks the user to confirm an action.
 *
 * @param {() => void} onConfirm - Callback invoked when the user confirms the action.
 * @param {string} title - The title of the dialog.
 * @param {string} description - The description of the dialog.
 * @param {ReactNode} children - The trigger element that opens the dialog.
 */
export const ConfirmationDialog: React.FC<PropsWithChildren<ConfirmationDialogProps>> = ({
    children,
    onConfirm,
    title,
    description,
}) => {
    const { t } = useTranslation('common');
    const [open, setOpen] = useState(false);

    const handleConfirm = useCallback(() => {
        onConfirm();
        setOpen(false);
    }, [onConfirm, setOpen]);

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title ? title : t('confirmationDialog.title')}</AlertDialogTitle>
                </AlertDialogHeader>
                <div className="flex flex-col gap-3">
                    {description ? description : t('confirmationDialog.description')}
                </div>
                <AlertDialogFooter className="mt-2">
                    <Button onClick={() => setOpen(false)}>{t('confirmationDialog.cancelBtn')}</Button>
                    <Button onClick={handleConfirm}>{t('confirmationDialog.confirmBtn')}</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
