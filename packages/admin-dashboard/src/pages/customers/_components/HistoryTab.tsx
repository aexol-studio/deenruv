import React, { useCallback, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  HistorySelector,
  useDetailView,
  useLazyQuery,
  useMutation,
  useSettings,
} from '@deenruv/react-ui-devkit';
import { History } from '@/components';
import { useTranslation } from 'react-i18next';
import { typedGql, scalars, $ } from '@deenruv/admin-types';
import { toast } from 'sonner';

const CUSTOMER_FORM_KEYS = ['CreateCustomerInput'] as const;

const CustomerGroupsQuery = typedGql('query', { scalars })({
  customer: [{ id: $('id', 'ID!') }, { history: [{}, HistorySelector] }],
});

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
  const [getHistory, { data, loading }] = useLazyQuery(CustomerGroupsQuery);
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { id, setLoading } = useDetailView('customers-detail-view', ...CUSTOMER_FORM_KEYS);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (id) getHistory({ id });
  }, [id, contentLng]);

  const [edit] = useMutation(EditCustomerNoteMutation);
  const [add] = useMutation(AddNoteToCustomerMutation);
  const [remove] = useMutation(DeleteStockLocationMutation);

  const handle = useCallback(
    (method: Promise<unknown>) => {
      method
        .then(() => {
          toast.success(t('history.toastSuccess'));
          if (id) getHistory({ id });
        })
        .catch(() => {
          toast.error(t('history.toastError'));
        });
    },
    [getHistory],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('history.header')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <History
          data={data?.customer?.history.items.reverse()}
          onNoteAdd={(input) => handle(add({ input }))}
          onNoteDelete={(id) => handle(remove({ id }))}
          onNoteEdit={(input) =>
            handle(
              edit({ input: { note: input.note || '', noteId: input.noteId } }).then(() => {
                if (id) getHistory({ id });
              }),
            )
          }
        />
      </CardContent>
    </Card>
  );
};
