import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  useValidators,
  DetailView,
  createDeenruvForm,
  getMutation,
  useMutation,
  GFFLPFormField,
} from '@deenruv/react-ui-devkit';
import { CollectionsDetailView } from '@/pages/collections/_components/CollectionDetailView.js';
import { ModelTypes } from '@deenruv/admin-types';

type CreateCollectionInput = ModelTypes['CreateCollectionInput'];
type FormDataType = Partial<{
  assetIds: GFFLPFormField<CreateCollectionInput['assetIds']>;
  featuredAssetId: GFFLPFormField<CreateCollectionInput['featuredAssetId']>;
  filters: GFFLPFormField<CreateCollectionInput['filters']>;
  inheritFilters: GFFLPFormField<CreateCollectionInput['inheritFilters']>;
  isPrivate: GFFLPFormField<CreateCollectionInput['isPrivate']>;
  parentId: GFFLPFormField<CreateCollectionInput['parentId']>;
  translations: GFFLPFormField<CreateCollectionInput['translations']>;
}>;

const CreateCollectionMutation = getMutation('createCollection');
const EditCollectionMutation = getMutation('updateCollection');
const DeleteCollectionMutation = getMutation('deleteCollection');

export const CollectionsDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditCollectionMutation);
  const [create] = useMutation(CreateCollectionMutation);
  const [remove] = useMutation(DeleteCollectionMutation);
  const { configurableOperationArrayValidator, translationsValidator } = useValidators();

  const onSubmitHandler = useCallback(
    (data: FormDataType) => {
      const inputData = {
        assetIds: data.assetIds?.validatedValue,
        featuredAssetId: data.featuredAssetId?.validatedValue,
        isPrivate: data.isPrivate?.validatedValue,
        inheritFilters: data.inheritFilters?.validatedValue,
        filters: data.filters!.validatedValue!,
        translations: data.translations!.validatedValue!.map((t) => ({
          description: t.description || '',
          name: t.name || '',
          languageCode: t.languageCode,
          slug: t.slug || '',
        })),
      };

      if (id) return update({ input: { id, ...inputData } });
      else return create({ input: inputData });
    },
    [id, update, create],
  );

  const onDeleteHandler = useCallback(() => {
    if (!id) {
      throw new Error('Could not find the id.');
    }

    return remove({ input: { id } });
  }, [remove, id]);

  return (
    <div className="relative flex flex-col gap-y-4">
      <DetailView
        id={id}
        locationId="collections-detail-view"
        main={{
          name: 'collection',
          label: 'Collection',
          component: <CollectionsDetailView />,
          form: createDeenruvForm({
            key: 'CreateCollectionInput',
            keys: ['assetIds', 'featuredAssetId', 'filters', 'inheritFilters', 'isPrivate', 'parentId', 'translations'],
            config: {
              isPrivate: {
                initialValue: false,
              },
              inheritFilters: {
                initialValue: true,
              },
              translations: translationsValidator,
              filters: configurableOperationArrayValidator(),
            },
            onSubmitted: onSubmitHandler,
            onDeleted: onDeleteHandler,
          }),
        }}
      />
    </div>
  );
};
