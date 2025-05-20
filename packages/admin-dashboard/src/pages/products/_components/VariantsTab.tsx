import {
  apiClient,
  EmptyState,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useDetailView,
  useSettings,
  useTranslation,
} from '@deenruv/react-ui-devkit';

import { ProductVariantSelector, ProductVariantType } from '@/graphql/products';
import { Variant } from '@/pages/products/_components/Variant';
import { useCallback, useEffect, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const NEW_VARIANT_TAB_VALUE = 'new';

export const VariantsTab = () => {
  const contentLanguage = useSettings((p) => p.translationsLanguage);
  const { id, getMarker, setLoading } = useDetailView('products-detail-view', 'CreateProductInput');
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
  const { t } = useTranslation('products');
  const [searchParams, setSearchParams] = useSearchParams();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set('variantId', tab);
    setSearchParams(updatedParams);
  };

  useEffect(() => {
    const variantId = searchParams.get('variantId');
    if (variantId) setActiveTab(variantId);
  }, []);

  const [variants, setVariants] = useState<ProductVariantType[]>();

  const fetchData = useCallback(async () => {
    if (id) {
      setLoading(true);
      const response = await apiClient('query')({
        productVariants: [{ productId: id }, { items: ProductVariantSelector }],
      });

      setLoading(false);
      if (response.productVariants) {
        setVariants(response.productVariants.items);
        if (activeTab === undefined) {
          setActiveTab(response.productVariants.items[0]?.id);
        }
      }
    }
  }, [id, activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex flex-col">
      {getMarker()}
      <div className="flex flex-col items-end gap-4">
        <Tabs defaultValue={variants?.[0]?.id} className="w-full" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="h-auto flex-wrap justify-start">
            <TabsTrigger key={'new-variant'} value={NEW_VARIANT_TAB_VALUE} className="text-blue-600">
              <PlusCircle size={16} className="mr-2 translate-y-px" />
              {t('addVariantDialog.new')}
            </TabsTrigger>
            {variants?.map((v) => (
              <TabsTrigger key={v.id + '-trigger'} value={v.id}>
                {v.name}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value={NEW_VARIANT_TAB_VALUE} key={'new-variant-content'}>
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
            <div className="flex w-full items-center justify-center">
              {activeTab !== NEW_VARIANT_TAB_VALUE && (
                <EmptyState
                  columnsLength={1}
                  title={t('variantsTab.emptyState.title')}
                  description={t('variantsTab.emptyState.description')}
                />
              )}
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};
