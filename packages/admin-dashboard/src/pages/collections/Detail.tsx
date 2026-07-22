import { useCallback } from 'react';
import { useParams } from 'react-router';
import {
  useValidators,
  DetailView,
  createDeenruvForm,
  getMutation,
  useMutation,
  useSettings,
} from '@deenruv/react-ui-devkit';
import { CollectionsDetailView } from '@/pages/collections/_components/CollectionDetailView.js';
import { CollectionStorefrontAction } from '@/pages/collections/_components/collectionStorefrontAction';
import { ModelTypes } from '@deenruv/admin-types';

type CreateCollectionInput = ModelTypes['CreateCollectionInput'];
type FormDataType = Record<string, unknown>;

const CreateCollectionMutation = getMutation('createCollection');
const EditCollectionMutation = getMutation('updateCollection');
const DeleteCollectionMutation = getMutation('deleteCollection');
const AssignCollectionsToChannelMutation = getMutation('assignCollectionsToChannel');

export const CollectionsDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditCollectionMutation);
  const [create] = useMutation(CreateCollectionMutation);
  const [remove] = useMutation(DeleteCollectionMutation);
  const [assignCollectionsToChannel] = useMutation(AssignCollectionsToChannelMutation);
  const selectedChannel = useSettings((p) => p.selectedChannel);
  const { configurableOperationArrayValidator, translationsValidator } = useValidators();

  const onSubmitHandler = useCallback(
    async (data: FormDataType) => {
      const translations = data.translations as CreateCollectionInput['translations'];
      const inputData = {
        assetIds: data.assetIds as CreateCollectionInput['assetIds'],
        featuredAssetId: data.featuredAssetId as CreateCollectionInput['featuredAssetId'],
        isPrivate: data.isPrivate as CreateCollectionInput['isPrivate'],
        inheritFilters: data.inheritFilters as CreateCollectionInput['inheritFilters'],
        filters: data.filters as CreateCollectionInput['filters'],
        translations: translations!.map((t) => ({
          description: t.description || '',
          name: t.name || '',
          languageCode: t.languageCode,
          slug: t.slug || '',
        })),
      };

      if (id) return update({ input: { id, ...inputData } });

      const response = await create({ input: inputData });
      const collectionId = response.createCollection!.id;
      const additionalChannelIds = Array.isArray(data.additionalChannelIds)
        ? data.additionalChannelIds.filter(
            (channelId): channelId is string => typeof channelId === 'string' && channelId !== selectedChannel?.id,
          )
        : [];

      for (const channelId of additionalChannelIds) {
        await assignCollectionsToChannel({ input: { collectionIds: [collectionId], channelId } });
      }

      return response;
    },
    [id, update, create, assignCollectionsToChannel, selectedChannel?.id],
  );

  const onDeleteHandler = useCallback(() => {
    if (!id) {
      throw new Error('Could not find the id.');
    }

    return remove({ id });
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
              ...{
                additionalChannelIds: {
                  initialValue: [],
                },
              },
              translations: translationsValidator,
              filters: configurableOperationArrayValidator(),
            },
            onSubmitted: onSubmitHandler,
            onDeleted: onDeleteHandler,
          }),
        }}
        topActions={{
          inline: [<CollectionStorefrontAction key="collection-storefront-action" />],
        }}
      />
    </div>
  );
};
