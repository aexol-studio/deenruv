import { useParams } from 'react-router-dom';
import { DetailView, GFFLPFormField, createDeenruvForm, useMutation } from '@deenruv/react-ui-devkit';
import { CustomerGroupsDetailView } from './_components/CustomerGroupsDetailView';
import { typedGql, scalars, $, ModelTypes, Permission } from '@deenruv/admin-types';
import { useCallback } from 'react';
import { useValidators } from '@/hooks/useValidators.js';

type CreateStockLocationInput = ModelTypes['CreateStockLocationInput'];
type FormDataType = Partial<{
  name: GFFLPFormField<CreateStockLocationInput['name']>;
  description: GFFLPFormField<CreateStockLocationInput['description']>;
  customFields: GFFLPFormField<CreateStockLocationInput['customFields']>;
}>;

const CreateCustomerGroupMutation = typedGql('mutation', { scalars })({
  createCustomerGroup: [
    {
      input: $('input', 'CreateCustomerGroupInput!'),
    },
    { id: true },
  ],
});

const EditCustomerGroupMutation = typedGql('mutation', { scalars })({
  updateCustomerGroup: [
    {
      input: $('input', 'UpdateCustomerGroupInput!'),
    },
    { id: true },
  ],
});

const DeleteCustomerGroupMutation = typedGql('mutation', { scalars })({
  deleteCustomerGroup: [
    {
      id: $('id', 'ID!'),
    },
    { message: true, result: true },
  ],
});

export const CustomerGroupsDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditCustomerGroupMutation);
  const [create] = useMutation(CreateCustomerGroupMutation);
  const [remove] = useMutation(DeleteCustomerGroupMutation);
  const { nameValidator } = useValidators();

  const onSubmitHandler = useCallback(
    (data: FormDataType) => {
      if (!data.name?.validatedValue) {
        throw new Error('Name is required.');
      }

      const inputData: ModelTypes['CreateCustomerGroupInput'] = {
        name: data.name.validatedValue,
        ...(data.customFields?.validatedValue ? { customFields: data.customFields?.validatedValue } : {}),
      };

      if (id) {
        return update({ input: { id, ...inputData } });
      } else {
        return create({ input: inputData });
      }
    },
    [id, update, create],
  );

  const onDeleteHandler = useCallback(() => {
    if (!id) {
      throw new Error('Could not find the id.');
    }

    return remove({ id });
  }, [remove, id]);

  return (
    <div className="relative flex flex-col gap-y-4">
      <DetailView
        id={id}
        locationId="customerGroups-detail-view"
        main={{
          name: 'customerGroup',
          label: 'Customer Group',
          component: <CustomerGroupsDetailView />,
          form: createDeenruvForm({
            key: 'CreateCustomerGroupInput',
            keys: ['name'],
            config: {
              name: nameValidator,
            },
            onSubmitted: onSubmitHandler,
            onDeleted: onDeleteHandler,
          }),
        }}
        permissions={{
          create: Permission.CreateCustomerGroup,
          edit: Permission.UpdateCustomerGroup,
          delete: Permission.DeleteCustomerGroup,
        }}
      />
    </div>
  );
};
