import {
  Button,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogDescription,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import React from 'react';

interface ConfirmationDialogProps {
  onConfirm: () => void;
  title: string;
  description: string;
  onOpenChange: (e: boolean) => void;
  deletedNames: string[];
  open: boolean;
}

export const DeleteDialog: React.FC<ConfirmationDialogProps> = ({
  onConfirm,
  title,
  description,
  onOpenChange,
  open,
  deletedNames,
}) => {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle> {title}</DialogTitle>
        <div className="flex max-h-[50vh] flex-col gap-2">
          <DialogDescription className="text-primary text-lg">{description}</DialogDescription>
          <DialogDescription>
            {deletedNames.map((n) => (
              <div key={n}>{n}</div>
            ))}
          </DialogDescription>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">{t('confirmationDialog.cancelBtn')}</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            {t('confirmationDialog.confirmBtn')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
