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
        defaultTabs={[
          { name: 'Product', component: <ProductDetailView /> },
          { name: 'Options', component: <OptionsTab />, disabled: !id },
          { name: 'Variants', component: <VariantsTab />, disabled: !id },
        ]}
      />
    </div>
  );
};
