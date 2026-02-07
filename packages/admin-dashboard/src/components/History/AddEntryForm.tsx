'use client';

import type React from 'react';

import type { ModelTypes } from '@deenruv/admin-types';
import { useTranslation, Badge, Button, Checkbox, Label, Textarea, cn } from '@deenruv/react-ui-devkit';
import { type Dispatch, type SetStateAction, useState } from 'react';
import { useParams } from 'react-router';
import { MessageCircle, ShieldCheck, Send } from 'lucide-react';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (newNote === '') return;

    setIsSubmitting(true);
    try {
      await onConfirm({ isPublic: !isPrivate, note: newNote, id: id! });
      setNewNote('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-md border bg-card p-4">
      <Label htmlFor="comment" className="mb-2 block font-medium">
        {t('history.addCommentButton', 'Add a note')}
      </Label>

      <div className="mb-3">
        <Textarea
          id="comment"
          placeholder={t('history.commentPlaceholder', 'Type your note here...')}
          onKeyUp={(e) => {
            e.currentTarget.style.height = '1px';
            e.currentTarget.style.height = 12 + e.currentTarget.scrollHeight + 'px';
          }}
          value={newNote}
          onChange={(e) => setNewNote(e.currentTarget.value)}
          className="h-min max-h-[300px] min-h-[80px] w-full resize-none overflow-auto rounded-md p-3"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Checkbox id="isPublic" name="isPublic" checked={isPrivate} onClick={() => setIsPrivate((p) => !p)} />
          <Label htmlFor="isPublic" className="flex cursor-pointer items-center gap-1 text-sm">
            <ShieldCheck className={cn('h-4 w-4', isPrivate ? 'text-emerald-500' : 'text-muted-foreground')} />
            {t('history.isPrivate', 'Private note')}
            <span className="ml-1 text-xs text-muted-foreground">
              {t('history.isPrivateDescription', '(visible only to admins)')}
            </span>
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={isPrivate ? 'outline' : 'secondary'}
            className={cn(
              'gap-1',
              !isPrivate
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                : 'border-emerald-200 text-emerald-800 dark:border-emerald-800 dark:text-emerald-300',
            )}
          >
            {!isPrivate ? (
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

          <Button disabled={newNote === '' || isSubmitting} onClick={handleSubmit} className="gap-2">
            {isSubmitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                {t('history.adding', 'Adding...')}
              </>
            ) : (
              <>
                <Send className="size-4" />
                {t('history.addComment', 'Add Note')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
