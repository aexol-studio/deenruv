import { useCallback, useEffect, useState } from 'react';
import {
  CF,
  EntityCustomFields,
  useSettings,
  useDetailView,
  CustomerDetailType,
  DetailViewMarker,
} from '@deenruv/react-ui-devkit';
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
  const { form, entity, id, fetchEntity } = useDetailView('customers-detail-view', ...CUSTOMER_FORM_KEYS);

  const { base } = form;

  const handleFetchEntity = useCallback(async () => {
    const res = await fetchEntity();

    if (!res) return;
    base.setField('title', res.title);
    base.setField('phoneNumber', res.phoneNumber);
    base.setField('firstName', res.firstName);
    base.setField('lastName', res.lastName);
    base.setField('emailAddress', res.emailAddress);
    if ('customFields' in res) base.setField('customFields', res.customFields as CF);
    setAddresses(res.addresses);
  }, []);

  useEffect(() => {
    (async () => {
      await handleFetchEntity();
    })();
  }, [contentLng]);

  return (
    <main className="min-h-96">
      <div className="flex flex-col gap-3">
        <PersonalDataCard setField={base.setField} state={base} />
        <DetailViewMarker position={'customers-detail-view'} />
        <EntityCustomFields
          entityName="customer"
          id={id}
          hideButton
          additionalData={{}}
          initialValues={
            entity && 'customFields' in entity ? { customFields: entity.customFields as CF } : { customFields: {} }
          }
          onChange={(cf) => {
            base.setField('customFields', cf);
          }}
        />
        {id && <AddressesCard addresses={addresses} customerId={id} onActionCompleted={handleFetchEntity} />}
      </div>
    </main>
  );
};
