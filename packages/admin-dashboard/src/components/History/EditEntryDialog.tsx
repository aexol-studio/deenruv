'use client';

import type React from 'react';

import type { OrderHistoryEntryType } from '@/graphql/draft_order';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Label,
  Textarea,
  cn,
  Badge,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { Checkbox } from '@radix-ui/react-checkbox';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { Pencil, MessageCircle, ShieldCheck, Save } from 'lucide-react';

interface onConfirmProps {
  noteId: string;
  isPublic: boolean;
  note: string;
}

interface EditEntryDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedNote: Dispatch<SetStateAction<OrderHistoryEntryType | undefined>>;
  selectedNote: OrderHistoryEntryType | undefined;
  onConfirm: (props: onConfirmProps) => void;
}

export const EditEntryDialog: React.FC<EditEntryDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedNote,
  onConfirm,
  setSelectedNote,
}) => {
  const { t } = useTranslation('common');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    if (!selectedNote || (selectedNote?.data.note as string) === '') return;

    setIsUpdating(true);
    try {
      await onConfirm({
        noteId: selectedNote.id,
        isPublic: selectedNote.isPublic,
        note: selectedNote.data.note as string,
      });
      setIsOpen(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="min-w-min">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Pencil className="size-5 text-blue-500" />
            {t('history.editNoteHeader', 'Edit Note')}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="my-4">
          <Textarea
            onChange={(e) =>
              setSelectedNote((p) => (p ? { ...p, data: { ...p?.data, note: e.currentTarget.value } } : undefined))
            }
            value={(selectedNote?.data.note as string) || ''}
            className="h-[200px] w-full min-w-[400px] resize-none overflow-auto rounded-md p-3"
            placeholder={t('history.notePlaceholder', 'Enter your note here...')}
          />
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="isPublicEdit"
              name="isPublicEdit"
              checked={!selectedNote?.isPublic}
              onClick={() => setSelectedNote((p) => (p ? { ...p, isPublic: !p.isPublic } : undefined))}
            />
            <Label htmlFor="isPublicEdit" className="flex cursor-pointer items-center gap-1 text-sm">
              <ShieldCheck
                className={cn('h-4 w-4', !selectedNote?.isPublic ? 'text-emerald-500' : 'text-muted-foreground')}
              />
              {t('history.isPrivate', 'Private note')}
              <span className="ml-1 text-xs text-muted-foreground">
                {t('history.isPrivateDescription', '(visible only to admins)')}
              </span>
            </Label>
          </div>

          <Badge
            variant={!selectedNote?.isPublic ? 'outline' : 'secondary'}
            className={cn(
              'gap-1',
              selectedNote?.isPublic
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                : 'border-emerald-200 text-emerald-800 dark:border-emerald-800 dark:text-emerald-300',
            )}
          >
            {selectedNote?.isPublic ? (
              <>
                <MessageCircle className="size-3" />
                {t('history.toAdminsAndCustomer', 'Visible to customer')}
              </>
            ) : (
              <>
                <ShieldCheck className="size-3" />
                {t('history.toAdmins', 'Admin only')}
              </>
            )}
          </Badge>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isUpdating}>{t('history.cancel', 'Cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            disabled={(selectedNote?.data.note as string) === '' || isUpdating}
            className="gap-2"
          >
            {isUpdating ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                {t('history.updating', 'Updating...')}
              </>
            ) : (
              <>
                <Save className="size-4" />
                {t('history.save', 'Save Changes')}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
