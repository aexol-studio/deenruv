import { useParams } from 'react-router-dom';
import { DetailView, createDeenruvForm, useMutation } from '@deenruv/react-ui-devkit';
import { TaxCategoryDetailView } from './_components/TaxCategoryDetailView';
import { $, scalars, typedGql } from '@deenruv/admin-types';

const EditTaxCategoryMutation = typedGql('mutation', { scalars })({
  updateTaxCategory: [
    {
      input: $('input', 'UpdateTaxCategoryInput!'),
    },
    { id: true },
  ],
});

export const TaxCategoriesDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditTaxCategoryMutation);

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
            onSubmitted: (_event, data) => {
              update({
                input: {
                  id: id!,
                  isDefault: data.isDefault?.validatedValue,
                  name: data.name?.validatedValue,
                },
              });
            },
            onDeleted: (_event, data) => {
              console.log('deleted', data);
            },
          }),
        }}
      />
    </div>
  );
};
