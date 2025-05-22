import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useTranslation,
  Option,
  MultipleSelector,
  apiClient,
  ErrorMessage,
  CardIcons,
  CustomCard,
  RoleSelector,
  RoleType,
} from '@deenruv/react-ui-devkit';
import { PermissionsTable } from '@/pages/roles/_components/PermissionsTable';

interface RolesCardProps {
  adminRoleIds: string[] | undefined;
  onRolesChange: (roleIds: string[]) => void;
  errors?: string[];
}

export const RolesCard: React.FC<RolesCardProps> = ({ adminRoleIds, onRolesChange, errors }) => {
  const { t } = useTranslation('admins');
  const [allRoles, setAllRoles] = useState<RoleType[]>([]);

  const currentPermissions = useMemo(() => {
    if (!allRoles.length) return;
    return adminRoleIds?.flatMap((id) => allRoles.find((r) => r.id === id)?.permissions ?? []);
  }, [adminRoleIds, allRoles]);

  const fetchAllRoles = useCallback(() => {
    apiClient('query')({
      roles: [{}, { items: RoleSelector }],
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
    <CustomCard
      title={t('details.basic.title')}
      icon={<CardIcons.permissions />}
      upperRight={<ErrorMessage errors={errors} />}
    >
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
    </CustomCard>
  );
};
