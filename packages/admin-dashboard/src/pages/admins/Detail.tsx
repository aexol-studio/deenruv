import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Routes,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  apiClient,
  useRouteGuard,
} from '@deenruv/react-ui-devkit';
import { toast } from 'sonner';
import { useGFFLP } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';
import { PageHeader } from '@/pages/admins/_components/PageHeader';
import { AdminDetailsSelector, AdminDetailsType } from '@/graphql/admins';
import { RolesCard } from '@/pages/admins/_components/RolesCard';
import { Stack } from '@/components';
import { useValidators } from '@/hooks/useValidators.js';

export const AdminsDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = useMemo(() => !!id, [id]);
  const { resetCache } = cache('administrators');
  const { t } = useTranslation('admins');
  const [loading, setLoading] = useState(id ? true : false);
  const [admin, setAdmin] = useState<AdminDetailsType>();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  useRouteGuard({ shouldBlock: !buttonDisabled });
  const { emailValidator, stringValidator, arrayValidator } = useValidators();

  const fetchAdmin = useCallback(async () => {
    if (id) {
      const response = await apiClient('query')({
        administrator: [
          {
            id,
          },
          AdminDetailsSelector,
        ],
      });
      setAdmin(response.administrator);
      setLoading(false);
    } else setLoading(false);
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchAdmin();
  }, [id, setLoading, fetchAdmin]);

  const { state, setField, haveValidFields } = useGFFLP(
    'UpdateAdministratorInput',
    'firstName',
    'lastName',
    'emailAddress',
    'password',
    'roleIds',
  )({
    emailAddress: emailValidator,
    firstName: stringValidator(t('validation.firstNameRequired')),
    lastName: stringValidator(t('validation.lastNameRequired')),
    password: !editMode ? stringValidator(t('validation.passwordRequired')) : undefined,
    roleIds: arrayValidator(t('validation.rolesRequired')),
  });

  useEffect(() => {
    if (!admin) return;

    setField('firstName', admin.firstName);
    setField('lastName', admin.lastName);
    setField('emailAddress', admin.emailAddress);
    setField('password', '');
    setField(
      'roleIds',
      admin.user.roles.map((r) => r.id),
    );
  }, [admin]);

  const createAdmin = useCallback(() => {
    setButtonDisabled(true);
    apiClient('mutation')({
      createAdministrator: [
        {
          input: {
            roleIds: state.roleIds!.validatedValue!,
            emailAddress: state.emailAddress!.validatedValue!,
            firstName: state.firstName!.validatedValue!,
            lastName: state.lastName!.validatedValue!,
            password: state.password!.validatedValue!,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then((resp) => {
        toast.message(t('toasts.adminCreatedSuccess'));
        navigate(Routes.admins.to(resp.createAdministrator.id));
      })
      .catch(() => toast.error(t('toasts.adminCreatedError')));
  }, [state, t, navigate]);

  const updateAdmin = useCallback(() => {
    apiClient('mutation')({
      updateAdministrator: [
        {
          input: {
            id: id!,
            emailAddress: state.emailAddress?.validatedValue,
            firstName: state.firstName?.validatedValue,
            lastName: state.lastName?.validatedValue,
            password: state.password?.validatedValue ? state.password?.validatedValue : undefined,
            roleIds: state.roleIds?.validatedValue,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then(() => {
        toast.message(t('toasts.adminUpdateSuccess'));
        fetchAdmin();
        resetCache();
      })
      .catch(() => toast.error(t('toasts.adminUpdateError')));
  }, [state, resetCache, fetchAdmin, id, t]);

  useEffect(() => {
    const areEqual = areObjectsEqual(
      {
        firstName: state.firstName?.value,
        lastName: state?.lastName?.value,
        emailAddress: state?.emailAddress?.value,
        password: state.password?.value,
        roleIds: state.roleIds?.value,
      },
      {
        firstName: admin?.firstName,
        lastName: admin?.lastName,
        emailAddress: admin?.emailAddress,
        password: editMode ? '' : undefined,
        roleIds: admin?.user.roles.map((r) => r.id),
      },
    );
    setButtonDisabled(!haveValidFields || areEqual);
  }, [state, admin, editMode]);

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !admin && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.adminLoadingError', { value: id })}
    </div>
  ) : (
    <main className="my-4">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <PageHeader
          admin={admin}
          editMode={editMode}
          buttonDisabled={buttonDisabled}
          onCreate={createAdmin}
          onEdit={updateAdmin}
        />
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex items-start gap-4 p-0 pt-4">
                <Input
                  wrapperClassName="basis-full md:basis-1/2 xl:basis-1/4"
                  label={t('details.basic.firstName')}
                  value={state.firstName?.value ?? undefined}
                  onChange={(e) => setField('firstName', e.target.value)}
                  errors={state.firstName?.errors}
                  required
                />
                <Input
                  wrapperClassName="basis-full md:basis-1/2 xl:basis-1/4"
                  label={t('details.basic.lastName')}
                  value={state.lastName?.value ?? undefined}
                  onChange={(e) => setField('lastName', e.target.value)}
                  errors={state.lastName?.errors}
                  required
                />
                <Input
                  wrapperClassName="basis-full md:basis-1/2 xl:basis-1/4"
                  label={t('details.basic.emailAddress')}
                  value={state.emailAddress?.value ?? undefined}
                  onChange={(e) => setField('emailAddress', e.target.value)}
                  errors={state.emailAddress?.errors}
                  required
                />
                <Input
                  wrapperClassName="basis-full md:basis-1/2 xl:basis-1/4"
                  label={t('details.basic.password')}
                  value={state.password?.value ?? undefined}
                  onChange={(e) => setField('password', e.target.value)}
                  errors={state.password?.errors}
                  required={!editMode}
                />
              </CardContent>
            </CardHeader>
          </Card>
          <RolesCard
            adminRoleIds={state.roleIds?.value ?? undefined}
            onRolesChange={(e) => setField('roleIds', e)}
            errors={state.roleIds?.errors}
          />
        </Stack>
      </div>
    </main>
  );
};
