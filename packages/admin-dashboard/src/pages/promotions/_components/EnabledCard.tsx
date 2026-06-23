import { useTranslation, Label, Switch, CustomCard, CardIcons } from '@deenruv/react-ui-devkit';
import React from 'react';

interface EnabledCardProps {
  enabledValue: boolean | undefined;
  onEnabledChange?: (e: boolean) => void;
}

export const EnabledCard: React.FC<EnabledCardProps> = ({ onEnabledChange, enabledValue }) => {
  const { t } = useTranslation('promotions');

  return (
    <CustomCard title={t('enabled.header')} icon={<CardIcons.default />} color="teal">
      <div className="flex items-center space-x-2">
        <Switch id="promotion-enabled" checked={enabledValue ?? false} onCheckedChange={onEnabledChange} />
        <Label htmlFor="promotion-enabled">{t('enabled.label')}</Label>
      </div>
    </CustomCard>
  );
};
