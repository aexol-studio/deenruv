import { Routes, Button, Label, SimpleTooltip } from '@deenruv/react-ui-devkit';
import { ChannelDetailsType } from '@/graphql/channels';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CreateEditButton } from '@/components/CreateEditButton.js';
import { Permission } from '@deenruv/admin-types';

interface PageHeaderProps {
  channel: ChannelDetailsType | undefined;
  editMode: boolean;
  buttonDisabled: boolean;
  onCreate: () => void;
  onEdit: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ channel, editMode, buttonDisabled, onCreate, onEdit }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('channels');

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(Routes.channels.list)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {editMode ? channel?.code : t('create')}
          </h1>
        </div>
        <SimpleTooltip
          content={buttonDisabled ? (editMode ? t('noChangesTooltip') : t('buttonDisabledTooltip')) : undefined}
        >
          <CreateEditButton
            createPermission={Permission.CreateChannel}
            editPermission={Permission.UpdateChannel}
            {...{ buttonDisabled, editMode, onCreate, onEdit }}
          />
        </SimpleTooltip>
      </div>
      {editMode && channel && (
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
          <Label className="text-muted-foreground">{t('baseInfoId', { value: channel.id })}</Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoCreated', { value: format(new Date(channel.createdAt), 'dd.MM.yyyy hh:mm') })}
          </Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoUpdated', { value: format(new Date(channel.updatedAt), 'dd.MM.yyyy hh:mm') })}
          </Label>
        </div>
      )}
    </>
  );
};
