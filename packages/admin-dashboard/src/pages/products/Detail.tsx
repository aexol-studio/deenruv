import { useParams } from 'react-router-dom';
import { VariantsTab } from '@/pages/products/_components/VariantsTab';
import { OptionsTab } from '@/pages/products/_components/OptionsTab';
import { DetailView } from '@/detail-views/DetailView';
import { ProductDetailView } from './_components/ProductDetailView';

export const ProductsDetailPage = () => {
  const { id } = useParams();

  return (
    <div className="relative flex flex-col gap-y-4">
      <DetailView
        id={id}
        locationId="products-detail-view"
        main={{
          name: 'Product',
          component: <ProductDetailView />,
        }}
        defaultTabs={[
          { name: 'Options', component: <OptionsTab /> },
          { name: 'Variants', component: <VariantsTab /> },
        ]}
      />
    </div>
  );
};
