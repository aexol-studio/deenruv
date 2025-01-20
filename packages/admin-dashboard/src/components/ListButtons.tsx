import { Permission } from '@deenruv/admin-types';
import { Button, useServer } from '@deenruv/react-ui-devkit';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

interface ListButtonsProps {
  selected: boolean;
  createRoute: string;
  createLabel: string;
  handleClick: () => void;
  deletePermission: Permission;
  createPermission: Permission;
}

export const ListButtons = ({
  selected,
  createRoute,
  createLabel,
  handleClick,
  createPermission,
  deletePermission,
}: ListButtonsProps) => {
  const { t } = useTranslation('common');
  const { userPermissions } = useServer();
  const isPermittedToCreate = useMemo(() => userPermissions.includes(createPermission), [userPermissions]);
  const isPermittedToDelete = useMemo(() => userPermissions.includes(deletePermission), [userPermissions]);

  return (
    <div className="flex gap-2">
      {selected && isPermittedToDelete ? (
        <Button variant="outline" onClick={handleClick}>
          {t('deleteOrCancel')}
        </Button>
      ) : null}
      {isPermittedToCreate && (
        <Button>
          <NavLink to={createRoute}>{createLabel}</NavLink>
        </Button>
      )}
    </div>
  );
};
