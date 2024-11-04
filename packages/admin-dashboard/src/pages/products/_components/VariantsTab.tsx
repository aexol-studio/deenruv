import { EmptyState, Stack, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components';
import { apiCall } from '@/graphql/client';
import { FacetListOptionsType } from '@/graphql/facets';
import { ProductVariantSelector, ProductVariantType } from '@/graphql/products';
import { AddVariantDialog } from '@/pages/products/_components/AddVariantDialog';
import { Variant } from '@/pages/products/_components/Variant';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { LanguageCode } from '@deenruv/admin-types';

interface VariantTabProps {
  currentTranslationLng: LanguageCode;
  facetsOptions: FacetListOptionsType['items'] | undefined;
  productId: string | undefined;
}

export const VariantsTab: React.FC<VariantTabProps> = ({ currentTranslationLng, facetsOptions, productId }) => {
  const { id } = useParams();
  const [variants, setVariants] = useState<ProductVariantType[]>();
  const [loading, setLoading] = useState<boolean>();

  const fetchVariants = useCallback(async () => {
    if (id) {
      setLoading(true);
      const response = await apiCall()('query')({
        productVariants: [
          {
            productId: id,
          },
          {
            items: ProductVariantSelector,
          },
        ],
      });

      setLoading(false);
      if (response.productVariants) {
        setVariants(response.productVariants.items);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchVariants();
  }, [fetchVariants]);

  return (
    <Stack column>
      {loading ? (
        <div className="flex min-h-[80vh] w-full items-center justify-center">
          <div className="customSpinner" />
        </div>
      ) : (
        <Stack column className="items-end gap-4">
          <Stack className="-mt-16 w-fit">
            <AddVariantDialog
              currentTranslationLng={currentTranslationLng}
              productId={productId}
              onSuccess={fetchVariants}
            />
          </Stack>
          <Tabs defaultValue={variants?.[0]?.id} className="w-full">
            <TabsList className="h-auto flex-wrap justify-start">
              {variants?.map((v) => (
                <TabsTrigger key={v.id} value={v.id}>
                  {v.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {variants?.length ? (
              variants?.map((v) => (
                <TabsContent value={v.id} key={v.id}>
                  <Variant
                    currentTranslationLng={currentTranslationLng}
                    variant={v}
                    facetsOptions={facetsOptions}
                    onActionCompleted={fetchVariants}
                  />
                </TabsContent>
              ))
            ) : (
              <Stack className="w-full items-center justify-center">
                <EmptyState columnsLength={1} />
              </Stack>
            )}
          </Tabs>
        </Stack>
      )}
    </Stack>
  );
};
