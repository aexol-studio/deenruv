import { useEffect, useState } from 'react';
import { useSettings, useDetailView, CustomerDetailType } from '@deenruv/react-ui-devkit';
import { Stack } from '@/components';
import { PersonalDataCard } from '@/pages/customers/_components/PersonalDataCard';
import { AddressesCard } from '@/pages/customers/_components/AddressesCard';

const CUSTOMER_FORM_KEYS = [
  'CreateCustomerInput',
  'title',
  'phoneNumber',
  'firstName',
  'lastName',
  'emailAddress',
] as const;

export const CustomerDetailView = () => {
  const [addresses, setAddresses] = useState<CustomerDetailType['addresses']>([]);
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { view, setField, state, id } = useDetailView(
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
    view.refetch();
  }, [contentLng]);

  useEffect(() => {
    if (!view.entity) return;
    view.setEntity(view.entity);
    setField('title', view.entity.title);
    setField('phoneNumber', view.entity.phoneNumber);
    setField('firstName', view.entity.firstName);
    setField('lastName', view.entity.lastName);
    setField('emailAddress', view.entity.emailAddress);
    setAddresses(view.entity.addresses);
  }, [view.entity]);

  return view.loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : (
    <main className="min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <PersonalDataCard setField={setField} state={state} />
          <AddressesCard addresses={addresses} customerId={id} onActionCompleted={view.refetch} />
        </Stack>
      </div>
    </main>
  );
};
