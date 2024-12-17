import React, { useCallback, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  useDetailView,
  useMutation,
  useSettings,
} from '@deenruv/react-ui-devkit';
import { History } from '@/components';
import { useTranslation } from 'react-i18next';
import { typedGql, scalars, $ } from '@deenruv/admin-types';
import { toast } from 'sonner';

const CUSTOMER_FORM_KEYS = ['CreateCustomerInput'] as const;

const AddNoteToCustomerMutation = typedGql('mutation', { scalars })({
  addNoteToCustomer: [
    {
      input: $('input', 'AddNoteToCustomerInput!'),
    },
    { id: true },
  ],
});

const EditCustomerNoteMutation = typedGql('mutation', { scalars })({
  updateCustomerNote: [
    {
      input: $('input', 'UpdateCustomerNoteInput!'),
    },
    { id: true },
  ],
});

const DeleteStockLocationMutation = typedGql('mutation', { scalars })({
  deleteCustomerNote: [
    {
      id: $('id', 'ID!'),
    },
    { message: true, result: true },
  ],
});

export const HistoryTab: React.FC = () => {
  const { t } = useTranslation('customers');
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { view } = useDetailView(
    'customers-detail-view',
    ({ id, view, form }) => ({
      id,
      view,
      state: form.base.state,
      setField: form.base.setField,
    }),
    ...CUSTOMER_FORM_KEYS,
  );

  useEffect(() => {
    view?.refetch();
  }, [contentLng]);

  const [edit] = useMutation(EditCustomerNoteMutation);
  const [add] = useMutation(AddNoteToCustomerMutation);
  const [remove] = useMutation(DeleteStockLocationMutation);

  const handle = useCallback(
    (method: Promise<unknown>) => {
      method
        .then(() => {
          toast.success(t('history.toastSuccess'));
          view.refetch();
        })
        .catch(() => {
          toast.error(t('history.toastError'));
        });
    },
    [view],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('history.header')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <History
          data={view.entity?.history.items.reverse()}
          onNoteAdd={(input) => handle(add({ input }))}
          onNoteDelete={(id) => handle(remove({ id }))}
          onNoteEdit={(input) =>
            handle(edit({ input: { note: input.note || '', noteId: input.noteId } }).then(() => view.refetch()))
          }
        />
      </CardContent>
    </Card>
  );
};
