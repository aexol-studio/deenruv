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
  const { form, loading, id, fetchEntity } = useDetailView('customers-detail-view', ...CUSTOMER_FORM_KEYS);

  const {
    base: { setField, state },
  } = form;

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();

      if (!res) return;

      setField('title', res.title);
      setField('phoneNumber', res.phoneNumber);
      setField('firstName', res.firstName);
      setField('lastName', res.lastName);
      setField('emailAddress', res.emailAddress);
      setAddresses(res.addresses);
    })();
  }, [contentLng]);

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : (
    <main className="min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <PersonalDataCard setField={setField} state={state} />
          {id && <AddressesCard addresses={addresses} customerId={id} onActionCompleted={fetchEntity} />}
        </Stack>
      </div>
    </main>
  );
};
