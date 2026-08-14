import { useParams } from 'react-router';
import { VariantsTab } from '@/pages/products/_components/VariantsTab';
import { OptionsTab } from '@/pages/products/_components/OptionsTab';
import { ProductDetailView } from './_components/ProductDetailView';
import { ProductDetailSidebar } from './_components/ProductDetailSidebar';
import { ProductStorefrontAction } from './_components/productStorefrontAction';
import { getProductInitialVariantFormConfig } from './ProductInitialVariantFormConfig';
import {
  DEFAULT_CHANNEL_CODE,
  useTranslation,
  createDeenruvForm,
  DetailView,
  useMutation,
  useSettings,
} from '@deenruv/react-ui-devkit';
import { $, Permission, scalars, typedGql, ValueTypes } from '@deenruv/admin-types';
import { useMemo } from 'react';

const EditProductMutation = typedGql('mutation', { scalars })({
  updateProduct: [{ input: $('input', 'UpdateProductInput!') }, { id: true }],
});

const CreateProductMutation = typedGql('mutation', { scalars })({
  createProduct: [{ input: $('input', 'CreateProductInput!') }, { id: true }],
});

const CreateProductVariantsMutation = typedGql('mutation', { scalars })({
  createProductVariants: [{ input: $('input', '[CreateProductVariantInput!]!') }, { id: true }],
});

const AssignProductVariantsToChannelMutation = typedGql('mutation', { scalars })({
  assignProductVariantsToChannel: [{ input: $('input', 'AssignProductVariantsToChannelInput!') }, { id: true }],
});

const DeleteProductMutation = typedGql('mutation', { scalars })({
  deleteProduct: [{ id: $('id', 'ID!') }, { result: true }],
});

export const ProductsDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation('products');
  const [update] = useMutation(EditProductMutation);
  const [create] = useMutation(CreateProductMutation);
  const [createVariants] = useMutation(CreateProductVariantsMutation);
  const [assignProductVariantsToChannel] = useMutation(AssignProductVariantsToChannelMutation);
  const [remove] = useMutation(DeleteProductMutation);
  const selectedChannel = useSettings((p) => p.selectedChannel);

  const defaultTabs = useMemo(() => {
    const tabs = [];
    if (id) {
      tabs.push({ label: t('options'), name: 'options', component: <OptionsTab />, hideSidebar: true });
      tabs.push({ label: t('variants'), name: 'variants', component: <VariantsTab />, hideSidebar: true });
    }
    return tabs;
  }, [id]);

  return (
    <div className="relative flex flex-col gap-y-4">
      <DetailView
        id={id}
        locationId="products-detail-view"
        main={{
          name: 'product',
          label: t('product'),
          component: <ProductDetailView />,
          sidebar: <ProductDetailSidebar />,
          form: createDeenruvForm({
            key: 'CreateProductInput',
            keys: ['translations', 'featuredAssetId', 'enabled', 'assetIds', 'facetValueIds', 'customFields'],
            config: {
              translations: {
                validate: (v) => {
                  if (!v || !v.length) return [t('validation.nameSlugRequired')];
                  const { name, slug } = v[0];
                  if (!name || !slug) return [t('validation.nameSlugRequired')];
                },
              },
              ...getProductInitialVariantFormConfig(!id, t('validation.initialVariantSkuRequired')),
            },
            onSubmitted: async (data) => {
              if (!data.translations) throw new Error('Name is required.');
              const translations = data.translations as ValueTypes['ProductTranslationInput'][];
              const input = {
                translations,
                assetIds: data.assetIds as string[] | undefined,
                featuredAssetId: data.featuredAssetId as string | undefined,
                facetValueIds: data.facetValueIds as string[] | undefined,
                enabled: data.enabled as boolean | undefined,
                ...(data.customFields ? { customFields: data.customFields } : {}),
              } satisfies ValueTypes['CreateProductInput'];

              if (id) return update({ input: { id, ...input } });

              const response = await create({ input });
              const initialVariantName =
                typeof data.initialVariantName === 'string' ? data.initialVariantName.trim() : '';
              const initialVariantSku = typeof data.initialVariantSku === 'string' ? data.initialVariantSku.trim() : '';
              const initialVariantPrice = Number(data.initialVariantPrice ?? 0);

              const variantsResponse = await createVariants({
                input: [
                  {
                    productId: response.createProduct.id,
                    translations: translations.map((translation) => ({
                      languageCode: translation.languageCode,
                      name: initialVariantName || translation.name || initialVariantSku,
                    })),
                    sku: initialVariantSku,
                    price: Number.isFinite(initialVariantPrice) ? initialVariantPrice : 0,
                  },
                ],
              });
              const createdVariantId = variantsResponse.createProductVariants?.[0]?.id;

              if (
                createdVariantId &&
                selectedChannel?.id &&
                selectedChannel.code &&
                selectedChannel.code !== DEFAULT_CHANNEL_CODE
              ) {
                await assignProductVariantsToChannel({
                  input: {
                    productVariantIds: [createdVariantId],
                    channelId: selectedChannel.id,
                  },
                });
              }

              return response;
            },
            onDeleted: () => {
              if (id) return remove({ id });
              else throw new Error('No id');
            },
          }),
        }}
        defaultTabs={defaultTabs}
        topActions={{
          inline: [<ProductStorefrontAction key="product-storefront-action" />],
        }}
        permissions={{
          create: [Permission.CreateProduct, Permission.CreateCatalog],
          edit: [Permission.UpdateProduct, Permission.UpdateCatalog],
          delete: [Permission.DeleteProduct, Permission.DeleteCatalog],
        }}
      />
    </div>
  );
};
