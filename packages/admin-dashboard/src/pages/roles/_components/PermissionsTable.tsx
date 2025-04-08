import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation, cn, Table, TableBody, TableCell, TableRow, useServer } from '@deenruv/react-ui-devkit';
import { CircleCheckBig } from 'lucide-react';
import { Permission } from '@deenruv/admin-types';
import permissionsJson from '@/locales/en/permissions.json';

interface PermissionsTableProps {
  currentPermissions: Permission[] | undefined;
  onPermissionsChange?: (permissions: Permission[]) => void;
}

export const PermissionsTable: React.FC<PermissionsTableProps> = ({ currentPermissions, onPermissionsChange }) => {
  const { t } = useTranslation('permissions');
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>();
  const { serverConfig } = useServer();

  const groupPermissions = useCallback((allPermissions: Permission[]) => {
    const permissionGroups: Record<string, Permission[]> = {};

    allPermissions?.forEach((permission) => {
      const match = permission.match(/(Create|Read|Update|Delete)(.*)/);

      if (match) {
        const resource = match[2];

        if (!permissionGroups[resource]) {
          permissionGroups[resource] = [];
        }

        permissionGroups[resource].push(permission);
      }
    });

    setGroupedPermissions(permissionGroups);
  }, []);

  useEffect(() => {
    if (serverConfig) groupPermissions(serverConfig.permissions.map((p) => p.name) as Permission[]);
  }, [serverConfig]);

  const handlePermissionsChange = useCallback(
    (permission: Permission) => {
      if (!onPermissionsChange) return;

      const isPresent = currentPermissions?.includes(permission);
      const permissions = currentPermissions ? [...currentPermissions] : [];

      if (isPresent) {
        onPermissionsChange(permissions?.filter((p) => p !== permission));
      } else {
        onPermissionsChange([...permissions, permission]);
      }
    },
    [currentPermissions, onPermissionsChange],
  );

  return (
    <Table>
      <TableBody>
        {groupedPermissions &&
          Object.entries(groupedPermissions).map(([key, values]) => (
            <TableRow key={key}>
              <TableCell className="dark:bg-secondary bg-slate-50 px-4 py-2" colSpan={values.length + 1}>
                <div className="flex flex-col gap-1">
                  <p className="text-base font-semibold">{t(`${key as keyof typeof permissionsJson}.title`)}</p>
                  <p className="text-xs">{t(`${key as keyof typeof permissionsJson}.description`)}</p>
                </div>
              </TableCell>
              {values.map((v) => (
                <TableCell
                  key={v}
                  className={cn('py-4', onPermissionsChange && 'cursor-pointer')}
                  onClick={() => handlePermissionsChange(v)}
                >
                  <div
                    className={cn(
                      'flex items-center gap-2 text-gray-400',
                      currentPermissions?.includes(v) && 'font-medium text-green-600',
                    )}
                  >
                    <CircleCheckBig size={18} strokeWidth={2.5} />
                    <p>{v}</p>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
