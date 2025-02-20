import { useParams } from 'react-router-dom';
import { createDeenruvForm, DetailView, type ExcludeUndefined, useMutation } from '@deenruv/react-ui-devkit';
import { CustomerDetailView } from '@/pages/customers/_components/CustomerDetailView';
import { CustomerDetailSidebar } from '@/pages/customers/_components/CustomerDetailSidebar';
import { OrdersTab } from '@/pages/customers/_components/OrdersTab';
import { HistoryTab } from '@/pages/customers/_components/HistoryTab';
import { $, Permission, scalars, typedGql } from '@deenruv/admin-types';
import { useValidators } from '@/hooks/useValidators.js';
import { useTranslation } from 'react-i18next';

const CreateCustomerMutation = typedGql('mutation', { scalars })({
  createCustomer: [
    {
      input: $('input', 'CreateCustomerInput!'),
    },
    { '...on Customer': { id: true } },
  ],
});

const UpdateCustomerMutation = typedGql('mutation', { scalars })({
  updateCustomer: [
    {
      input: $('input', 'UpdateCustomerInput!'),
    },
    { '...on Customer': { id: true } },
  ],
});

const RemoveCustomerMutation = typedGql('mutation', { scalars })({
  deleteCustomer: [
    {
      id: $('id', 'ID!'),
    },
    { result: true },
  ],
});

export const CustomersDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation('customers');
  const [create] = useMutation(CreateCustomerMutation);
  const [update] = useMutation(UpdateCustomerMutation);
  const [remove] = useMutation(RemoveCustomerMutation);
  const { stringValidator, emailValidator } = useValidators();

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
            config: {
              firstName: stringValidator(t('validation.firstNameRequired')),
              lastName: stringValidator(t('validation.lastNameRequired')),
              emailAddress: emailValidator,
            },
            onDeleted: () => {
              if (!id) return;
              return remove({ id });
            },
            onSubmitted: (data) => {
              const sharedInput = {
                emailAddress: data.emailAddress?.validatedValue,
                firstName: data.firstName?.validatedValue,
                lastName: data.lastName?.validatedValue,
                phoneNumber: data.phoneNumber?.validatedValue,
                title: data.title?.validatedValue,
              };

              if (!sharedInput.emailAddress || !sharedInput.firstName || !sharedInput.lastName) return;

              const input = sharedInput as ExcludeUndefined<typeof sharedInput>;

              return id
                ? update({ input: { id, ...input } })
                : create({
                    input,
                  });
            },
          }),
        }}
        defaultTabs={
          id
            ? [
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
              ]
            : []
        }
        permissions={{
          create: Permission.CreateCustomer,
          edit: Permission.UpdateCustomer,
          delete: Permission.DeleteCustomer,
        }}
      />
    </div>
  );
};
