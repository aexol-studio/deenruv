import { OrderHistoryEntryType } from '@/graphql/draft_order';
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
} from '@deenruv/react-ui-devkit';
import { Checkbox } from '@radix-ui/react-checkbox';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

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

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="min-w-min">
        <AlertDialogHeader>
          <AlertDialogTitle>{t('history.editNoteHeader')}</AlertDialogTitle>
        </AlertDialogHeader>
        <Textarea
          onChange={(e) =>
            setSelectedNote((p) => (p ? { ...p, data: { ...p?.data, note: e.currentTarget.value } } : undefined))
          }
          value={(selectedNote?.data.note as string) || ''}
          className="h-[60vh] w-auto min-w-[50vh] resize-none overflow-auto rounded-md p-2"
        />
        <div className="flex items-center gap-2 pb-4">
          <Checkbox
            id="isPublicEdit"
            name="isPublicEdit"
            checked={!selectedNote?.isPublic}
            onClick={() => setSelectedNote((p) => (p ? { ...p, isPublic: !p.isPublic } : undefined))}
          />
          <Label htmlFor="isPublicEdit" className="cursor-pointer">
            {t('history.isPrivate')}
            <span className="ml-2 text-gray-500">{t('history.isPrivateDescription')}</span>
          </Label>
          <Label className={cn('ml-auto', !selectedNote?.isPublic ? 'text-green-600' : 'text-yellow-600')}>
            {t(!selectedNote?.isPublic ? 'history.toAdmins' : 'history.toAdminsAndCustomer')}
          </Label>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('history.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            disabled={(selectedNote?.data.note as string) === ''}
            onClick={() =>
              selectedNote &&
              onConfirm({
                noteId: selectedNote.id,
                isPublic: selectedNote.isPublic,
                note: selectedNote.data.note as string,
              })
            }
          >
            {t('history.edit')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
