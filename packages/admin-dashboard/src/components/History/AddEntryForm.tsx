import { ModelTypes } from '@deenruv/admin-types';
import { Button, Checkbox, Label, Textarea, cn } from '@deenruv/react-ui-devkit';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface DeleteEntryDialogProps {
  newNote: string;
  isPrivate: boolean;
  setIsPrivate: Dispatch<SetStateAction<boolean>>;
  setNewNote: Dispatch<SetStateAction<string>>;
  onConfirm: (input: ModelTypes['AddNoteToOrderInput']) => void;
}

export const AddEntryForm: React.FC<DeleteEntryDialogProps> = ({
  newNote,
  isPrivate,
  setIsPrivate,
  setNewNote,
  onConfirm,
}) => {
  const { t } = useTranslation('common');
  const { id } = useParams();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="comment">{t('history.addCommentButton')}</Label>
      <div className="mb-2 flex flex-row gap-4">
        <Textarea
          id="comment"
          onKeyUp={(e) => {
            e.currentTarget.style.height = '1px';
            e.currentTarget.style.height = 12 + e.currentTarget.scrollHeight + 'px';
          }}
          value={newNote}
          onChange={(e) => setNewNote(e.currentTarget.value)}
          className="h-min max-h-[300px] min-h-[36px] w-full resize-none overflow-auto rounded-md p-2"
        />
        <Button
          disabled={newNote === ''}
          size="sm"
          onClick={() => onConfirm({ isPublic: !isPrivate, note: newNote, id: id! })}
        >
          {t('history.addComment')}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="isPublic" name="isPublic" checked={isPrivate} onClick={() => setIsPrivate((p) => !p)} />
        <Label htmlFor="isPublic" className="cursor-pointer">
          {t('history.isPrivate')}
          <span className="ml-2 text-gray-500">{t('history.isPrivateDescription')}</span>
        </Label>
        <Label className={cn('ml-auto', isPrivate ? 'text-green-600' : 'text-yellow-600')}>
          {t(isPrivate ? 'history.toAdmins' : 'history.toAdminsAndCustomer')}
        </Label>
      </div>
    </div>
  );
};
