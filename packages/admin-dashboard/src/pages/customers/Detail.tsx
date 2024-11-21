import { useParams } from 'react-router-dom';
import { VariantsTab } from '@/pages/products/_components/VariantsTab';
import { OptionsTab } from '@/pages/products/_components/OptionsTab';
import { DetailView } from '@/detail-views/DetailView';
import { ProductDetailView } from './_components/ProductDetailView';
import { ProductDetailSidebar } from './_components/ProductDetailSidebar';

export const CustomersDetailPage = () => {
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
          form: {
            key: 'CreateProductInput',
            keys: ['translations', 'featuredAssetId', 'enabled', 'assetIds', 'facetValueIds'],
            config: { '': {} },
            onDeleted: (event, data) => {},
            onSubmitted: (event, data) => {},
          },
        }}
        defaultTabs={[
          { label: 'Options', name: 'options', component: <OptionsTab />, hideSidebar: true },
          { label: 'Variants', name: 'variants', component: <VariantsTab />, sidebarReplacement: <p>dupa</p> },
        ]}
      />
    </div>
  );
};
