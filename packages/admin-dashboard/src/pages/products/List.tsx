import { ProductsList, VariantsList } from '@/pages/products';
import { useTranslation, Tabs, TabsContent, TabsList, TabsTrigger } from '@deenruv/react-ui-devkit';

export const ProductsListPage = () => {
  const { t } = useTranslation('products');

  return (
    <Tabs defaultValue="products">
      <TabsList className="relative z-50 mb-0 ml-8 mt-2">
        <TabsTrigger value="products">{t('products')}</TabsTrigger>
        <TabsTrigger value="variants">{t('variants')}</TabsTrigger>
      </TabsList>
      <TabsContent value="products" className="mt-0">
        <ProductsList />
      </TabsContent>
      <TabsContent value="variants" className="mt-0">
        <VariantsList />
      </TabsContent>
    </Tabs>
  );
};
