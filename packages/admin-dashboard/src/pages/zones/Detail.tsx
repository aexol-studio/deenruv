import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useValidators,
  apiClient,
  useMutation,
  DetailView,
  getMutation,
  createDeenruvForm,
  GFFLPFormField,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { ZoneDetailView } from '@/pages/zones/_components/ZoneDetailView.js';
import { ModelTypes } from '@deenruv/admin-types';

const CreateZoneMutation = getMutation('createZone');
const EditZoneMutation = getMutation('updateZone');
const DeleteZoneMutation = getMutation('deleteZone');

type CreateZoneInput = ModelTypes['CreateZoneInput'];
type FormDataType = Partial<{
  name: GFFLPFormField<CreateZoneInput['name']>;
  memberIds: GFFLPFormField<CreateZoneInput['memberIds']>;
  customFields: GFFLPFormField<CreateZoneInput['customFields']>;
}>;

export const ZonesDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditZoneMutation);
  const [create] = useMutation(CreateZoneMutation);
  const [remove] = useMutation(DeleteZoneMutation);
  const { nameValidator } = useValidators();
  const { t } = useTranslation('zones');

  const updateMembers = useCallback(
    (toAdd?: string[], toRemove?: string[]) => {
      if ((!toAdd || toAdd.length === 0) && (!toRemove || toRemove.length === 0)) {
        return Promise.resolve();
      }

      return apiClient('mutation')({
        ...(toRemove && toRemove.length > 0
          ? {
              removeMembersFromZone: [
                {
                  zoneId: id!,
                  memberIds: toRemove,
                },
                { id: true },
              ],
            }
          : {}),
        ...(toAdd && toAdd.length > 0
          ? {
              addMembersToZone: [
                {
                  zoneId: id!,
                  memberIds: toAdd,
                },
                { id: true },
              ],
            }
          : {}),
      });
    },
    [id, t],
  );

  const onSubmitHandler = useCallback(
    (data: FormDataType, additionalData: Record<string, unknown> | undefined) => {
      if (!data.name?.validatedValue) {
        throw new Error('Name is required.');
      }

      const { membersIdsToRemove = [], membersIdsToAdd = [] } =
        additionalData && 'membersIdsToRemove' in additionalData && 'membersIdsToAdd' in additionalData
          ? (additionalData as { membersIdsToRemove: string[]; membersIdsToAdd: string[] })
          : {};

      const inputData = {
        name: data.name.validatedValue,
        ...(data.customFields?.validatedValue ? { customFields: data.customFields?.validatedValue } : {}),
      };

      if (id) {
        return Promise.all([
          update({ input: { id, ...inputData } }),
          updateMembers(membersIdsToAdd, membersIdsToRemove),
        ]).then(([res]) => res);
      } else {
        return create({ input: { ...inputData, memberIds: data.memberIds?.validatedValue } });
      }
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
        locationId="zones-detail-view"
        main={{
          name: 'zone',
          label: 'Zone',
          component: <ZoneDetailView />,
          form: createDeenruvForm({
            key: 'CreateZoneInput',
            keys: ['name', 'memberIds', 'customFields'],
            config: {
              name: nameValidator,
            },
            onSubmitted: onSubmitHandler,
            onDeleted: onDeleteHandler,
          }),
        }}
      />
    </div>
  );
};
