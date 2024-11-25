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

export const ProductsDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditProductMutation);

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
            onSubmitted: (event, data) => {
              update({
                input: {
                  id: id!,
                  translations: data.translations?.validatedValue,
                },
              });
            },
            onDeleted: (event, data) => {
              console.log('deleted', data);
            },
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
