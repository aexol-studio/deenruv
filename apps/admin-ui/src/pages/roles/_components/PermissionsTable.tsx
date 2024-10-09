import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Stack } from '@/components';
import { CircleCheckBig } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Permission } from '@/zeus';
import permissionsJson from '@/locales/en/permissions.json';

interface PermissionsTableProps {
  currentPermissions: Permission[] | undefined;
  onPermissionsChange?: (permissions: Permission[]) => void;
}

export const PermissionsTable: React.FC<PermissionsTableProps> = ({ currentPermissions, onPermissionsChange }) => {
  const { t } = useTranslation('permissions');
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>();

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
    // @ts-expect-error: const enums are not iterable, but I set to true to compilerOptions.preserveConstEnums
    const permissionsArray = Object.values(Permission);

    groupPermissions(permissionsArray);
  }, [setGroupedPermissions, groupPermissions]);

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
              <TableCell className="bg-slate-50 px-4">
                <Stack column className="gap-1">
                  <p className="text-base font-semibold">{t(`${key as keyof typeof permissionsJson}.title`)}</p>
                  <p className="text-xs">{t(`${key as keyof typeof permissionsJson}.description`)}</p>
                </Stack>
              </TableCell>
              {values.map((v) => (
                <TableCell
                  key={v}
                  className={cn('py-4', onPermissionsChange && 'cursor-pointer')}
                  onClick={() => handlePermissionsChange(v)}
                >
                  <Stack
                    className={cn(
                      'items-center gap-2 text-gray-400',
                      currentPermissions?.includes(v) && 'font-medium text-green-600',
                    )}
                  >
                    <CircleCheckBig size={18} strokeWidth={2.5} />
                    <p>{v}</p>
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};
