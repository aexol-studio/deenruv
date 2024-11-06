import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Option, MultipleSelector, Card, CardHeader, CardTitle, CardContent } from '@deenruv/react-ui-devkit';
import { apiCall } from '@/graphql/client';
import { RoleSelector, RoleType } from '@/graphql/roles';
import { PermissionsTable } from '@/pages/roles/_components/PermissionsTable';

interface RolesCardProps {
  adminRoleIds: string[] | undefined;
  onRolesChange: (roleIds: string[]) => void;
}

export const RolesCard: React.FC<RolesCardProps> = ({ adminRoleIds, onRolesChange }) => {
  const { t } = useTranslation('admins');
  const [allRoles, setAllRoles] = useState<RoleType[]>([]);

  const currentPermissions = useMemo(() => {
    if (!allRoles.length) return;
    const currentRolesPermissions = adminRoleIds?.map((id) => allRoles.find((r) => r.id === id)!.permissions);
    return currentRolesPermissions?.flat();
  }, [adminRoleIds, allRoles]);

  const fetchAllRoles = useCallback(() => {
    apiCall()('query')({
      roles: [
        {},
        {
          items: RoleSelector,
        },
      ],
    }).then((resp) => {
      setAllRoles(resp.roles.items);
    });
  }, []);

  useEffect(() => {
    fetchAllRoles();
  }, [fetchAllRoles]);

  const rolesToOptions = useCallback(
    (roles: RoleType[] | undefined) => roles?.map((r) => ({ label: r.description, value: r.id })),
    [],
  );

  const currentRolesOptions = useMemo((): Option[] | undefined => {
    if (!allRoles.length) return undefined;
    else return adminRoleIds?.map((id) => ({ value: id, label: allRoles.find((r) => r.id === id)!.description }));
  }, [allRoles, adminRoleIds]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.roles.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <MultipleSelector
          options={rolesToOptions(allRoles)}
          value={currentRolesOptions}
          placeholder={t('details.roles.placeholder')}
          onChange={(options) => onRolesChange(options.map((o) => o.value))}
          hideClearAllButton
        />
        <div className="mt-4">
          <PermissionsTable currentPermissions={currentPermissions} />
        </div>
      </CardContent>
    </Card>
  );
};
