import { useEffect, useMemo } from 'react';
import {
  CF,
  EntityCustomFields,
  CardIcons,
  CustomCard,
  DetailViewMarker,
  Input,
  useDetailView,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { RolesCard } from '@/pages/admins/_components/RolesCard';

const ADMIN_FORM_KEYS = [
  'CreateAdministratorInput',
  'firstName',
  'lastName',
  'emailAddress',
  'password',
  'roleIds',
  'customFields',
] as const;

export const AdminDetailView = () => {
  const { form, entity, fetchEntity, id } = useDetailView('admins-detail-view', ...ADMIN_FORM_KEYS);

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

  return (
    <main className="my-4">
      <div className="flex flex-col gap-3">
        <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />}>
          <div className="flex items-start gap-4">
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
          </div>
        </CustomCard>
        <DetailViewMarker position={'admins-detail-view'} />
        <EntityCustomFields
          entityName="administrator"
          id={id}
          hideButton
          onChange={(customFields) => {
            setField('customFields', customFields);
          }}
          initialValues={
            entity && 'customFields' in entity ? { customFields: entity.customFields as CF } : { customFields: {} }
          }
        />
        <RolesCard
          adminRoleIds={state.roleIds?.value ?? undefined}
          onRolesChange={(e) => setField('roleIds', e)}
          errors={state.roleIds?.errors}
        />
      </div>
    </main>
  );
};
