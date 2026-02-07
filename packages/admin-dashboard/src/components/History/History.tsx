'use client';

import type React from 'react';

import { useState } from 'react';
import type { OrderHistoryEntryType } from '@/graphql/draft_order';
import type { ModelTypes } from '@deenruv/admin-types';
import { AddEntryForm, DeleteEntryDialog, EditEntryDialog, Timeline } from '@/components/History';
import { ClipboardList } from 'lucide-react';

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
    <div className="space-y-6">
      <AddEntryForm
        isPrivate={isPrivate}
        newNote={newNote}
        onConfirm={onNoteAdd}
        setIsPrivate={setIsPrivate}
        setNewNote={setNewNote}
      />

      {data && data.length > 0 ? (
        <Timeline
          setIsDeleteOpen={setIsDeleteOpen}
          setIsEditOpen={setIsEditOpen}
          setSelectedNote={setSelectedNote}
          data={data}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
          <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
            <ClipboardList className="size-6 text-amber-500 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-medium">No history entries yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Add a note above to start building the order history</p>
          </div>
        </div>
      )}

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
    </div>
  );
};
