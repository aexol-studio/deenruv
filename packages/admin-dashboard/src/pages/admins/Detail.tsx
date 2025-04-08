import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  DetailView,
  createDeenruvForm,
  GFFLPFormField,
  getMutation,
  useMutation,
  useValidators,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { AdminDetailView } from '@/pages/admins/_components/AdminDetailView.js';
import { ModelTypes, Permission } from '@deenruv/admin-types';

type CreateAdminInput = ModelTypes['CreateAdministratorInput'];
type FormDataType = Partial<{
  emailAddress: GFFLPFormField<CreateAdminInput['emailAddress']>;
  firstName: GFFLPFormField<CreateAdminInput['firstName']>;
  lastName: GFFLPFormField<CreateAdminInput['lastName']>;
  password: GFFLPFormField<CreateAdminInput['password']>;
  roleIds: GFFLPFormField<CreateAdminInput['roleIds']>;
  customFields: GFFLPFormField<CreateAdminInput['customFields']>;
}>;

const CreateAdminMutation = getMutation('createAdministrator');
const EditAdminMutation = getMutation('updateAdministrator');
const DeleteAdminMutation = getMutation('deleteAdministrator');

export const AdminsDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditAdminMutation);
  const [create] = useMutation(CreateAdminMutation);
  const [remove] = useMutation(DeleteAdminMutation);
  const editMode = useMemo(() => !!id, [id]);
  const { t } = useTranslation('admins');
  const { emailValidator, stringValidator, arrayValidator } = useValidators();

  const onSubmitHandler = useCallback(
    (data: FormDataType) => {
      if (!data.emailAddress?.validatedValue) {
        throw new Error('Name is required.');
      }

      const inputData = {
        emailAddress: data.emailAddress?.validatedValue,
        firstName: data.firstName?.validatedValue,
        lastName: data.lastName?.validatedValue,
        password: data.password?.validatedValue ? data.password?.validatedValue : undefined,
        roleIds: data.roleIds?.validatedValue,
        ...(data.customFields?.validatedValue ? { customFields: data.customFields?.validatedValue } : {}),
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
        locationId="admins-detail-view"
        main={{
          name: 'admin',
          label: 'Admin',
          component: <AdminDetailView />,
          form: createDeenruvForm({
            key: 'CreateAdministratorInput',
            keys: ['firstName', 'lastName', 'emailAddress', 'password', 'roleIds', 'customFields'],
            config: {
              emailAddress: emailValidator,
              firstName: stringValidator(t('validation.firstNameRequired')),
              lastName: stringValidator(t('validation.lastNameRequired')),
              password: !editMode ? stringValidator(t('validation.passwordRequired')) : undefined,
              roleIds: arrayValidator(t('validation.rolesRequired')),
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
