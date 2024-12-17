import { OrderHistoryEntryType } from '@/graphql/draft_order';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@deenruv/react-ui-devkit';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

interface DeleteEntryDialogProps {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedNote: OrderHistoryEntryType | undefined;
  onConfirm: (id: string) => void;
}

export const DeleteEntryDialog: React.FC<DeleteEntryDialogProps> = ({ isOpen, setIsOpen, selectedNote, onConfirm }) => {
  const { t } = useTranslation('common');

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('history.deleteNoteHeader')}</AlertDialogTitle>
          <AlertDialogDescription className="max-h-[60vh] overflow-y-auto whitespace-pre">
            {selectedNote?.data?.note as string}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('history.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={() => selectedNote && onConfirm(selectedNote.id)}>
            {t('history.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
