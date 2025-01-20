import { useParams } from 'react-router-dom';
import { DetailView, createDeenruvForm, useMutation } from '@deenruv/react-ui-devkit';
import { TaxCategoryDetailView } from './_components/TaxCategoryDetailView';
import { $, Permission, scalars, typedGql } from '@deenruv/admin-types';
import { useCallback } from 'react';

const CreateTaxCategoryMutation = typedGql('mutation', { scalars })({
  createTaxCategory: [
    {
      input: $('input', 'CreateTaxCategoryInput!'),
    },
    { id: true },
  ],
});

const EditTaxCategoryMutation = typedGql('mutation', { scalars })({
  updateTaxCategory: [
    {
      input: $('input', 'UpdateTaxCategoryInput!'),
    },
    { id: true },
  ],
});

const DeleteTaxCategoryMutation = typedGql('mutation', { scalars })({
  deleteTaxCategory: [
    {
      id: $('id', 'ID!'),
    },
    { message: true, result: true },
  ],
});

export const TaxCategoriesDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditTaxCategoryMutation);
  const [remove] = useMutation(DeleteTaxCategoryMutation);
  const [create] = useMutation(CreateTaxCategoryMutation);

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
        locationId="taxCategories-detail-view"
        main={{
          name: 'taxCategory',
          label: 'Tax Category',
          component: <TaxCategoryDetailView />,
          form: createDeenruvForm({
            key: 'CreateTaxCategoryInput',
            keys: ['isDefault', 'name'],
            config: {},
            onSubmitted: (data) => {
              if (!data.name?.validatedValue) {
                throw new Error('Name is required.');
              }

              const inputData = {
                name: data.name.validatedValue,
                isDefault: data.isDefault?.validatedValue,
              };

              return id
                ? update({
                    input: {
                      id: id!,
                      ...inputData,
                    },
                  })
                : create({
                    input: inputData,
                  });
            },
            onDeleted: onDeleteHandler,
          }),
        }}
        permissions={{
          create: Permission.CreateTaxCategory,
          edit: Permission.UpdateTaxCategory,
          delete: Permission.DeleteTaxCategory,
        }}
      />
    </div>
  );
};
