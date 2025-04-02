import { Permission } from '@deenruv/admin-types';
import { Button, useServer } from '@deenruv/react-ui-devkit';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface CreateEditButtonProps {
  editMode: boolean;
  buttonDisabled: boolean;
  onCreate: () => void;
  onEdit: () => void;
  editPermission: Permission;
  createPermission: Permission;
}

export const CreateEditButton: React.FC<CreateEditButtonProps> = ({
  buttonDisabled,
  editMode,
  onCreate,
  onEdit,
  editPermission,
  createPermission,
}) => {
  const { t } = useTranslation('common');
  const { userPermissions } = useServer();
  const isPermittedToCreate = useMemo(() => userPermissions.includes(createPermission), [userPermissions]);
  const isPermittedToUpdate = useMemo(() => userPermissions.includes(editPermission), [userPermissions]);

  return (isPermittedToUpdate && editMode) || (isPermittedToCreate && !editMode) ? (
    <Button className="ml-auto" disabled={buttonDisabled} onClick={editMode ? onEdit : onCreate}>
      {editMode ? t('update') : t('create')}
    </Button>
  ) : (
    <></>
  );
};
