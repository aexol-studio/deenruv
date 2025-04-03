import { useDetailView } from '@deenruv/react-ui-devkit';
import { Stack } from '@/components';
import { VerifiedCard } from '@/pages/customers/_components/VerifiedCard';
import { CustomerGroupsCard } from '@/pages/customers/_components/CustomerGroupsCard';

const CUSTOMER_FORM_KEYS = ['CreateCustomerInput'] as const;

export const CustomerDetailSidebar = () => {
  const { id, entity } = useDetailView('customers-detail-view', ...CUSTOMER_FORM_KEYS);

  return (
    <main className="min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          {id && <VerifiedCard verified={!!entity?.user?.verified} />}
          <CustomerGroupsCard customerId={id} groups={entity?.groups} />
        </Stack>
      </div>
    </main>
  );
};
