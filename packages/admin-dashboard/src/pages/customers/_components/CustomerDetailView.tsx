import { useCallback, useEffect, useState } from 'react';
import { useSettings, useDetailView, CustomerDetailType, DetailViewMarker } from '@deenruv/react-ui-devkit';
import { EntityCustomFields, Stack } from '@/components';
import { PersonalDataCard } from '@/pages/customers/_components/PersonalDataCard';
import { AddressesCard } from '@/pages/customers/_components/AddressesCard';

const CUSTOMER_FORM_KEYS = [
  'CreateCustomerInput',
  'title',
  'phoneNumber',
  'firstName',
  'lastName',
  'emailAddress',
  'customFields',
] as const;

export const CustomerDetailView = () => {
  const [addresses, setAddresses] = useState<CustomerDetailType['addresses']>([]);
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { form, entity, loading, id, fetchEntity } = useDetailView('customers-detail-view', ...CUSTOMER_FORM_KEYS);

  const {
    base: { setField, state },
  } = form;

  const handleFetchEntity = useCallback(async () => {
    const res = await fetchEntity();

    if (!res) return;
    setField('title', res.title);
    setField('phoneNumber', res.phoneNumber);
    setField('firstName', res.firstName);
    setField('lastName', res.lastName);
    setField('emailAddress', res.emailAddress);
    if ('customFields' in res) setField('customFields', res.customFields);
    setAddresses(res.addresses);
  }, []);

  useEffect(() => {
    (async () => {
      await handleFetchEntity();
    })();
  }, [contentLng]);

  return (
    <main className="min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <PersonalDataCard setField={setField} state={state} />
          <DetailViewMarker position={'customers-detail-view'} />
          <EntityCustomFields
            entityName="customer"
            id={id}
            hideButton
            additionalData={{}}
            initialValues={
              entity && 'customFields' in entity ? { customFields: entity.customFields as any } : { customFields: {} }
            }
            onChange={(cf, value) => {
              setField('customFields', cf);
            }}
          />
          {id && <AddressesCard addresses={addresses} customerId={id} onActionCompleted={handleFetchEntity} />}
        </Stack>
      </div>
    </main>
  );
};
