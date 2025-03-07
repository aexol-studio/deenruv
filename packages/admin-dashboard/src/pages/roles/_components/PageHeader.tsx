import { Routes, Button, Label, SimpleTooltip } from '@deenruv/react-ui-devkit';
import { RoleDetailsType } from '@/graphql/roles';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Permission } from '@deenruv/admin-types';
import { CreateEditButton } from '@/components/CreateEditButton.js';

interface PageHeaderProps {
  role: RoleDetailsType | undefined;
  editMode: boolean;
  buttonDisabled: boolean;
  onCreate: () => void;
  onEdit: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ role, editMode, buttonDisabled, onCreate, onEdit }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('roles');

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => navigate(Routes.roles.list, { viewTransition: true })}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {editMode ? role?.description : t('create')}
          </h1>
        </div>
        <SimpleTooltip
          content={buttonDisabled ? (editMode ? t('noChangesTooltip') : t('buttonDisabledTooltip')) : undefined}
        >
          <CreateEditButton
            createPermission={Permission.CreateAdministrator}
            editPermission={Permission.UpdateAdministrator}
            {...{ buttonDisabled, editMode, onCreate, onEdit }}
          />
        </SimpleTooltip>
      </div>
      {editMode && role && (
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
          <Label className="text-muted-foreground">{t('baseInfoId', { value: role.id })}</Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoCreated', { value: format(new Date(role.createdAt), 'dd.MM.yyyy hh:mm') })}
          </Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoUpdated', { value: format(new Date(role.updatedAt), 'dd.MM.yyyy hh:mm') })}
          </Label>
        </div>
      )}
    </>
  );
};
