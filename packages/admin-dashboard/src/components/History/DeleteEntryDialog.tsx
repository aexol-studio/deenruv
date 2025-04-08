'use client';

import type React from 'react';

import type { OrderHistoryEntryType } from '@/graphql/draft_order';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { Trash } from 'lucide-react';

interface DeleteEntryDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedNote: OrderHistoryEntryType | undefined;
  onConfirm: (id: string) => void;
}

export const DeleteEntryDialog: React.FC<DeleteEntryDialogProps> = ({ isOpen, setIsOpen, selectedNote, onConfirm }) => {
  const { t } = useTranslation('common');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!selectedNote) return;

    setIsDeleting(true);
    try {
      onConfirm(selectedNote.id);
      setIsOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-red-600">
            <Trash className="size-5" />
            {t('history.deleteNoteHeader', 'Delete Note')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t(
              'history.deleteConfirmation',
              'Are you sure you want to delete this note? This action cannot be undone.',
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {selectedNote?.data?.note && (
          <div className="bg-muted/30 my-4 max-h-[200px] overflow-y-auto rounded-md border p-3 text-sm">
            <div className="whitespace-pre-wrap">{selectedNote.data.note as string}</div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{t('history.cancel', 'Cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            {isDeleting ? (
              <span className="flex items-center gap-2">
                <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                {t('history.deleting', 'Deleting...')}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Trash className="size-4" />
                {t('history.delete', 'Delete')}
              </span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
