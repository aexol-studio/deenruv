import { useParams } from 'react-router-dom';
import { VariantsTab } from '@/pages/products/_components/VariantsTab';
import { OptionsTab } from '@/pages/products/_components/OptionsTab';
import { ProductDetailView } from './_components/ProductDetailView';
import { ProductDetailSidebar } from './_components/ProductDetailSidebar';
import { createDeenruvForm, DetailView, useMutation } from '@deenruv/react-ui-devkit';
import { $, scalars, typedGql } from '@deenruv/admin-types';

const EditProductMutation = typedGql('mutation', { scalars })({
  updateProduct: [
    {
      input: $('input', 'UpdateProductInput!'),
    },
    { id: true },
  ],
});

const CreateProductMutation = typedGql('mutation', { scalars })({
  createProduct: [
    {
      input: $('input', 'CreateProductInput!'),
    },
    { id: true },
  ],
});

const DeleteProductMutation = typedGql('mutation', { scalars })({
  deleteProduct: [
    {
      id: $('id', 'ID!'),
    },
    {
      result: true,
    },
  ],
});

export const ProductsDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditProductMutation);
  const [create] = useMutation(CreateProductMutation);
  const [remove] = useMutation(DeleteProductMutation);

  return (
    <div className="relative flex flex-col gap-y-4">
      <DetailView
        id={id}
        locationId="products-detail-view"
        main={{
          name: 'product',
          label: 'Product',
          component: <ProductDetailView />,
          sidebar: <ProductDetailSidebar />,
          form: createDeenruvForm({
            key: 'CreateProductInput',
            keys: ['translations', 'featuredAssetId', 'enabled', 'assetIds', 'facetValueIds'],
            config: {},
            onSubmitted: (_event, data) => {
              if (!data.translations) throw new Error('Name is required.');
              const sharedInput = {
                translations: data.translations?.validatedValue,
                assetIds: data.assetIds?.validatedValue,
                featuredAssetId: data.featuredAssetId?.validatedValue,
                facetValueIds: data.facetValueIds?.validatedValue,
                enabled: data.enabled?.validatedValue,
              };

              return id
                ? update({
                    input: {
                      id: id!,
                      ...sharedInput,
                    },
                  })
                : create({
                    input: sharedInput,
                  });
            },
            onDeleted: (id) => remove({ id }),
          }),
        }}
        defaultTabs={[
          { label: 'Options', name: 'options', component: <OptionsTab />, hideSidebar: true },
          { label: 'Variants', name: 'variants', component: <VariantsTab />, hideSidebar: true },
        ]}
      />
    </div>
  );
};
