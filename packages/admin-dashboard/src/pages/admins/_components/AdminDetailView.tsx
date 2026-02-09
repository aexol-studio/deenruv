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

  const { base } = form;
  const editMode = useMemo(() => !!id, [id]);
  const { t } = useTranslation('admins');

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();

      if (!res) return;

      base.setField('firstName', res.firstName);
      base.setField('lastName', res.lastName);
      base.setField('emailAddress', res.emailAddress);
      base.setField('password', '');
      base.setField(
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
              value={base.watch('firstName') ?? undefined}
              onChange={(e) => base.setField('firstName', e.target.value)}
              errors={base.formState.errors?.firstName?.message ? [base.formState.errors.firstName.message as string] : undefined}
              required
            />
            <Input
              wrapperClassName="basis-full md:basis-1/2 xl:basis-1/4"
              label={t('details.basic.lastName')}
              value={base.watch('lastName') ?? undefined}
              onChange={(e) => base.setField('lastName', e.target.value)}
              errors={base.formState.errors?.lastName?.message ? [base.formState.errors.lastName.message as string] : undefined}
              required
            />
            <Input
              wrapperClassName="basis-full md:basis-1/2 xl:basis-1/4"
              label={t('details.basic.emailAddress')}
              value={base.watch('emailAddress') ?? undefined}
              onChange={(e) => base.setField('emailAddress', e.target.value)}
              errors={base.formState.errors?.emailAddress?.message ? [base.formState.errors.emailAddress.message as string] : undefined}
              required
            />
            <Input
              wrapperClassName="basis-full md:basis-1/2 xl:basis-1/4"
              label={t('details.basic.password')}
              value={base.watch('password') ?? undefined}
              onChange={(e) => base.setField('password', e.target.value)}
              errors={base.formState.errors?.password?.message ? [base.formState.errors.password.message as string] : undefined}
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
            base.setField('customFields', customFields);
          }}
          initialValues={
            entity && 'customFields' in entity ? { customFields: entity.customFields as CF } : { customFields: {} }
          }
        />
        <RolesCard
          adminRoleIds={base.watch('roleIds') ?? undefined}
          onRolesChange={(e) => base.setField('roleIds', e)}
          errors={base.formState.errors?.roleIds?.message ? [base.formState.errors.roleIds.message as string] : undefined}
        />
      </div>
    </main>
  );
};
