import { useParams } from 'react-router-dom';
import { VariantsTab } from '@/pages/products/_components/VariantsTab';
import { OptionsTab } from '@/pages/products/_components/OptionsTab';
import { ProductDetailView } from './_components/ProductDetailView';
import { ProductDetailSidebar } from './_components/ProductDetailSidebar';
import { createDeenruvForm, DetailView, useMutation } from '@deenruv/react-ui-devkit';
import { $, Permission, scalars, typedGql } from '@deenruv/admin-types';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

const EditProductMutation = typedGql('mutation', { scalars })({
  updateProduct: [{ input: $('input', 'UpdateProductInput!') }, { id: true }],
});

const CreateProductMutation = typedGql('mutation', { scalars })({
  createProduct: [{ input: $('input', 'CreateProductInput!') }, { id: true }],
});

const DeleteProductMutation = typedGql('mutation', { scalars })({
  deleteProduct: [{ id: $('id', 'ID!') }, { result: true }],
});

export const ProductsDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation('products');
  const [update] = useMutation(EditProductMutation);
  const [create] = useMutation(CreateProductMutation);
  const [remove] = useMutation(DeleteProductMutation);

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
            keys: ['translations', 'featuredAssetId', 'enabled', 'assetIds', 'facetValueIds'],
            config: {
              translations: {
                validate: (v) => {
                  const { name, slug } = v[0];
                  if (!name || !slug) return [t('validation.nameSlugRequired')];
                },
              },
            },
            onSubmitted: (data) => {
              if (!data.translations) throw new Error('Name is required.');
              const input = {
                translations: data.translations?.validatedValue,
                assetIds: data.assetIds?.validatedValue,
                featuredAssetId: data.featuredAssetId?.validatedValue,
                facetValueIds: data.facetValueIds?.validatedValue,
                enabled: data.enabled?.validatedValue,
              };
              return id ? update({ input: { id, ...input } }) : create({ input });
            },
            onDeleted: () => {
              if (id) return remove({ id });
              else throw new Error('No id');
            },
          }),
        }}
        defaultTabs={defaultTabs}
        permissions={{
          create: Permission.CreateProduct,
          edit: Permission.UpdateProduct,
          delete: Permission.DeleteProduct,
        }}
      />
    </div>
  );
};
