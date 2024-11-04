import { Button, DialogTitle, Dialog, DialogContent, DialogFooter, DialogClose, DialogDescription } from '@/components';
import { useTranslation } from 'react-i18next';

type ConfirmationDialogProps<T extends { id: string; name: string }> = {
  onConfirm: () => void;
  title: string;
  description: string;
  onOpenChange: (e: boolean) => void;
  deletingItems: T[];
  open: boolean;
};

export function DeleteDialog<T extends { id: string; name: string }>({
  onConfirm,
  title,
  description,
  onOpenChange,
  open,
  deletingItems,
}: ConfirmationDialogProps<T>) {
  const { t } = useTranslation('common');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle> {title}</DialogTitle>
        <div className="flex max-h-[50vh] flex-col gap-2">
          <DialogDescription className="text-primary text-lg">{description}</DialogDescription>
          <DialogDescription>
            {deletingItems.map((n) => (
              <div key={n.id}>{n.name}</div>
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
}
