import {
  Button,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  Stack,
} from '@/components';
import React, { PropsWithChildren, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmationDialogProps {
  onConfirm: () => void;
  title?: string;
  description?: string;
}

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ? title : t('confirmationDialog.title')}</DialogTitle>
        </DialogHeader>
        <Stack column className="gap-3">
          {description ? description : t('confirmationDialog.description')}
        </Stack>
        <DialogFooter className="mt-2">
          <Button onClick={() => setOpen(false)}>{t('confirmationDialog.cancelBtn')}</Button>
          <Button variant={'action'} onClick={handleConfirm}>
            {t('confirmationDialog.confirmBtn')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
