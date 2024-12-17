import { useParams } from 'react-router-dom';
import { createDeenruvForm, DetailView } from '@deenruv/react-ui-devkit';
import { CustomerDetailView } from '@/pages/customers/_components/CustomerDetailView';
import { CustomerDetailSidebar } from '@/pages/customers/_components/CustomerDetailSidebar';
import { OrdersTab } from '@/pages/customers/_components/OrdersTab';
import { HistoryTab } from '@/pages/customers/_components/HistoryTab';

export const CustomersDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="relative flex flex-col gap-y-4">
      <DetailView
        id={id}
        locationId="customers-detail-view"
        main={{
          name: 'customer',
          label: 'Customer',
          component: <CustomerDetailView />,
          sidebar: <CustomerDetailSidebar />,
          form: createDeenruvForm({
            key: 'CreateCustomerInput',
            keys: ['title', 'phoneNumber', 'firstName', 'lastName', 'emailAddress'],
            config: {},
            onDeleted: (event, data) => new Promise((res) => res({})),
            onSubmitted: (event, data) => new Promise((res) => res({})),
          }),
        }}
        defaultTabs={[
          {
            label: 'Orders',
            name: 'orders',
            component: <OrdersTab />,
            hideSidebar: true,
          },
          {
            label: 'History',
            name: 'history',
            component: <HistoryTab />,
            hideSidebar: true,
          },
        ]}
      />
    </div>
  );
};
