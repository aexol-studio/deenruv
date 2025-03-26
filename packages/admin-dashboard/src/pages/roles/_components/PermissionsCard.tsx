import { ErrorMessage, CustomCard, CardIcons } from '@deenruv/react-ui-devkit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Permission } from '@deenruv/admin-types';
import { PermissionsTable } from '@/pages/roles/_components/PermissionsTable';

interface PermissionsCardProps {
  currentPermissions: Permission[] | undefined;
  onPermissionsChange: (permissions: Permission[]) => void;
  errors?: string[];
}

export const PermissionsCard: React.FC<PermissionsCardProps> = ({
  currentPermissions,
  onPermissionsChange,
  errors,
}) => {
  const { t } = useTranslation('roles');

  return (
    <CustomCard
      title={t('details.permissions.title')}
      icon={<CardIcons.permissions />}
      color="teal"
      upperRight={<ErrorMessage errors={errors} />}
    >
      <PermissionsTable currentPermissions={currentPermissions} onPermissionsChange={onPermissionsChange} />
    </CustomCard>
  );
};
