import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CustomCardHeader,
  DetailViewMarker,
  Input,
  useDetailView,
} from '@deenruv/react-ui-devkit';
import { RolesCard } from '@/pages/admins/_components/RolesCard';
import { EntityCustomFields, Stack } from '@/components';
import { Info } from 'lucide-react';

const ADMIN_FORM_KEYS = [
  'CreateAdministratorInput',
  'firstName',
  'lastName',
  'emailAddress',
  'password',
  'roleIds',
] as const;

export const AdminDetailView = () => {
  const { id } = useParams();
  const { form, loading, fetchEntity, entity } = useDetailView('admins-detail-view', ...ADMIN_FORM_KEYS);

  const {
    base: { setField, state },
  } = form;
  const editMode = useMemo(() => !!id, [id]);
  const { t } = useTranslation('admins');

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();

      if (!res) return;

      setField('firstName', res.firstName);
      setField('lastName', res.lastName);
      setField('emailAddress', res.emailAddress);
      setField('password', '');
      setField(
        'roleIds',
        res.user.roles.map((r) => r.id),
      );
    })();
  }, []);

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !entity && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.adminLoadingError', { value: id })}
    </div>
  ) : (
    <main className="my-4">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <Card>
            <CustomCardHeader title={t('details.basic.title')} icon={<Info className="h-5 w-5" />} />
            <CardContent className="flex items-start gap-4">
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
          </Card>
          <DetailViewMarker position={'admins-detail-view'} />
          {id && <EntityCustomFields entityName="administrator" id={id} />}
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
