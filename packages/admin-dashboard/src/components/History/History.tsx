import { useState } from 'react';
import { CardContent } from '@deenruv/react-ui-devkit';
import { OrderHistoryEntryType } from '@/graphql/draft_order';
import { ModelTypes } from '@deenruv/admin-types';
import { AddEntryForm, DeleteEntryDialog, EditEntryDialog, Timeline } from '@/components/History';

interface HistoryProps {
  data: OrderHistoryEntryType[] | undefined;
  onNoteAdd: (input: ModelTypes['AddNoteToOrderInput']) => void; // AddCustomerNoteInput has the same fields
  onNoteEdit: (input: ModelTypes['UpdateOrderNoteInput']) => void; // UpdateCustomerNoteInput is nearly the same type
  onNoteDelete: (id: string) => void;
}

export const History: React.FC<HistoryProps> = ({ data, onNoteAdd, onNoteEdit, onNoteDelete }) => {
  const [newNote, setNewNote] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<OrderHistoryEntryType | undefined>();

  return (
    <>
      <AddEntryForm
        isPrivate={isPrivate}
        newNote={newNote}
        onConfirm={onNoteAdd}
        setIsPrivate={setIsPrivate}
        setNewNote={setNewNote}
      />
      <Timeline
        setIsDeleteOpen={setIsDeleteOpen}
        setIsEditOpen={setIsEditOpen}
        setSelectedNote={setSelectedNote}
        data={data}
      />
      <DeleteEntryDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        selectedNote={selectedNote}
        onConfirm={onNoteDelete}
      />
      <EditEntryDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
        onConfirm={onNoteEdit}
      />
    </>
  );
};
