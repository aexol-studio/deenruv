import { useParams } from 'react-router-dom';
import { VariantsTab } from '@/pages/products/_components/VariantsTab';
import { OptionsTab } from '@/pages/products/_components/OptionsTab';
import { createDeenruvForm, DetailView } from '@/detail-views/DetailView';
import { ProductDetailView } from './_components/ProductDetailView';
import { ProductDetailSidebar } from './_components/ProductDetailSidebar';

export const ProductsDetailPage = () => {
  const { id } = useParams();

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
              console.log('submitted', data.assetIds?.value);
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
