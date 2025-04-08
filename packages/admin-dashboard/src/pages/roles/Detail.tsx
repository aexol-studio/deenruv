import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  useValidators,
  DetailView,
  createDeenruvForm,
  getMutation,
  useMutation,
  GFFLPFormField,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { ModelTypes, Permission } from '@deenruv/admin-types';
import { RoleDetailView } from '@/pages/roles/_components/RoleDetailView.js';

// const DEFAULT_VALUES = {
//   permissions: [Permission.Authenticated],
//   description: '',
// };

type CreateRoleInput = ModelTypes['CreateRoleInput'];
type FormDataType = Partial<{
  code: GFFLPFormField<CreateRoleInput['code']>;
  channelIds: GFFLPFormField<CreateRoleInput['channelIds']>;
  description: GFFLPFormField<CreateRoleInput['description']>;
  permissions: GFFLPFormField<CreateRoleInput['permissions']>;
}>;

const CreateRoleMutation = getMutation('createRole');
const EditRoleMutation = getMutation('updateRole');
const DeleteRoleMutation = getMutation('deleteRole');

export const RolesDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditRoleMutation);
  const [create] = useMutation(CreateRoleMutation);
  const [remove] = useMutation(DeleteRoleMutation);
  const { t } = useTranslation('roles');
  const { nameValidator } = useValidators();

  const onSubmitHandler = useCallback(
    (data: FormDataType) => {
      if (!data.code?.validatedValue) {
        throw new Error('Name is required.');
      }

      const inputData = {
        code: data.code.validatedValue,
        channelIds: data.channelIds?.validatedValue,
        description: data.description?.validatedValue,
        permissions: data.permissions?.validatedValue,
      };

      if (id) {
        return update({
          input: {
            id,
            ...inputData,
          },
        });
      } else {
        return create({
          input: inputData,
        });
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
        locationId="roles-detail-view"
        main={{
          name: 'role',
          label: 'Role',
          component: <RoleDetailView />,
          form: createDeenruvForm({
            key: 'CreateRoleInput',
            keys: ['code', 'description', 'channelIds', 'permissions'],
            config: {
              code: {
                validate: (v) => (!v || v === '' ? [t('validation.codeRequired')] : undefined),
              },
              permissions: {
                // initialValue: DEFAULT_VALUES.permissions,
                validate: (v) => (!v || !v.length ? [t('validation.permissionsRequired')] : undefined),
              },
              description: nameValidator,
            },
            onSubmitted: onSubmitHandler,
            onDeleted: onDeleteHandler,
          }),
        }}
        permissions={{
          create: Permission.CreateAdministrator,
          delete: Permission.DeleteAdministrator,
          edit: Permission.UpdateAdministrator,
        }}
      />
    </div>
  );
};
