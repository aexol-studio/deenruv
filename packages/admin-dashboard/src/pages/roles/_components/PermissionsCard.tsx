import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Permission } from '@deenruv/admin-types';
import { PermissionsTable } from '@/pages/roles/_components/PermissionsTable';

interface PermissionsCardProps {
  currentPermissions: Permission[] | undefined;
  onPermissionsChange: (permissions: Permission[]) => void;
}

export const PermissionsCard: React.FC<PermissionsCardProps> = ({ currentPermissions, onPermissionsChange }) => {
  const { t } = useTranslation('roles');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.permissions.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <PermissionsTable currentPermissions={currentPermissions} onPermissionsChange={onPermissionsChange} />
      </CardContent>
    </Card>
  );
};
