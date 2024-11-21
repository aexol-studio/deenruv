import {
  deepMerge,
  Dialog,
  DialogContent,
  ProductVariantsListSelector,
  Routes,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useDetailViewStore,
} from '@deenruv/react-ui-devkit';
import { apiCall } from '@/graphql/client';
import { ProductVariantSelector, ProductVariantType } from '@/graphql/products';
import { AddVariantDialog } from '@/pages/products/_components/AddVariantDialog';
import { Variant } from '@/pages/products/_components/Variant';
import { useCallback, useEffect, useState } from 'react';
import { SortOrder } from '@deenruv/admin-types';

export const VariantsTab = () => {
  const { id, contentLanguage, getMarker } = useDetailViewStore(
    'products-detail-view',
    ({ id, contentLanguage, getMarker }) => ({
      id,
      contentLanguage,
      getMarker,
    }),
    'CreateProductInput',
  );
  const [variants, setVariants] = useState<ProductVariantType[]>();
  const [loading, setLoading] = useState<boolean>();

  // const fetch = async <T,>(
  //   { page, perPage, filter, filterOperator, sort }: PaginationInput,
  //   customFieldsSelector?: T,
  // ) => {
  //   const selector = deepMerge(ProductVariantsListSelector, customFieldsSelector ?? {});
  //   const response = await apiCall()('query')({
  //     ['productVariants']: [
  //       {
  //         options: {
  //           take: perPage,
  //           skip: (page - 1) * perPage,
  //           filterOperator: filterOperator,
  //           sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
  //           ...(filter && { filter: { ...filter, productId: { eq: id } } }),
  //         },
  //       },
  //       { items: selector, totalItems: true },
  //     ],
  //   });
  //   return response['productVariants'];
  // };

  const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean> => {
    try {
      const ids = items.map((item) => item.id);
      const { deleteProductVariants } = await apiCall()('mutation')({
        deleteProductVariants: [{ ids }, { message: true, result: true }],
      });
      return !!deleteProductVariants.length;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const fetchData = useCallback(async () => {
    if (id) {
      setLoading(true);
      const response = await apiCall()('query')({
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

  const [variantId, setVariantId] = useState<string>();
  return (
    <div className="flex flex-col">
      {/* <AddVariantDialog currentTranslationLng={contentLanguage} productId={id} onSuccess={fetchData} /> */}

      {getMarker()}
      {loading ? (
        <div className="flex w-full items-center justify-center">
          <div className="customSpinner" />
        </div>
      ) : (
        <div className="flex gap-4">
          <div></div>
          <div></div>
        </div>
      )}
    </div>
  );
};
