import { useEffect } from 'react';
import { useSettings, useDetailView } from '@deenruv/react-ui-devkit';
import { Stack } from '@/components';
import { VerifiedCard } from '@/pages/customers/_components/VerifiedCard';
import { CustomerGroupsCard } from '@/pages/customers/_components/CustomerGroupsCard';

const CUSTOMER_FORM_KEYS = ['CreateCustomerInput'] as const;

export const CustomerDetailSidebar = () => {
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
    view.refetch();
  }, [contentLng]);

  useEffect(() => {
    if (!view.entity) return;
    view.setEntity(view.entity);
  }, [view.entity]);

  return view.loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : (
    <main className="min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <VerifiedCard verified={!!view.entity?.user?.verified} />
          <CustomerGroupsCard customerId={view.entity?.id} groups={view.entity?.groups} />
        </Stack>
      </div>
    </main>
  );
};
