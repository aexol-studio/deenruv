import {
  apiClient,
  EmptyState,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useDetailView,
  useSettings,
} from '@deenruv/react-ui-devkit';

import { ProductVariantSelector, ProductVariantType } from '@/graphql/products';
import { Variant } from '@/pages/products/_components/Variant';
import { useCallback, useEffect, useState } from 'react';
import { Stack } from '@/components';
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const VariantsTab = () => {
  const contentLanguage = useSettings((p) => p.translationsLanguage);
  const { id, getMarker } = useDetailView('products-detail-view', 'CreateProductInput');

  const { t } = useTranslation('products');

  const [variants, setVariants] = useState<ProductVariantType[]>();
  const [loading, setLoading] = useState<boolean>();

  const fetchData = useCallback(async () => {
    if (id) {
      setLoading(true);
      const response = await apiClient('query')({
        productVariants: [{ productId: id }, { items: ProductVariantSelector }],
      });

      setLoading(false);
      if (response.productVariants) {
        setVariants(response.productVariants.items);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col">
      {getMarker()}
      {loading ? (
        <div className="flex w-full items-center justify-center">
          <div className="customSpinner" />
        </div>
      ) : (
        <Stack column className="items-end gap-4">
          <Tabs defaultValue={variants?.[0]?.id} className="w-full">
            <TabsList className="h-auto flex-wrap justify-start">
              <TabsTrigger key={'new-variant'} value={'new'} className="text-blue-600">
                <PlusCircle size={16} className="mr-2 translate-y-[1px]" />
                {t('addVariantDialog.new')}
              </TabsTrigger>
              {variants?.map((v) => (
                <TabsTrigger key={v.id + '-trigger'} value={v.id}>
                  {v.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={'new'} key={'new-variant-content'}>
              {id && <Variant currentTranslationLng={contentLanguage} onActionCompleted={fetchData} productId={id} />}
            </TabsContent>
            {id && variants?.length ? (
              variants?.map((v) => (
                <TabsContent value={v.id} key={v.id + '-content'}>
                  <Variant
                    currentTranslationLng={contentLanguage}
                    variant={v}
                    onActionCompleted={fetchData}
                    productId={id}
                  />
                </TabsContent>
              ))
            ) : (
              <Stack className="w-full items-center justify-center">
                <EmptyState columnsLength={1} title="Test" description="Test" />
              </Stack>
            )}
          </Tabs>
        </Stack>
      )}
    </div>
  );
};
