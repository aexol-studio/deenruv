import { Label, Switch, CustomCard, CardIcons } from '@deenruv/react-ui-devkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface SettingsCardProps {
  enabledValue: boolean | undefined;
  onEnabledChange?: (e: boolean) => void;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({ onEnabledChange, enabledValue }) => {
  const { t } = useTranslation('products');

  return (
    <CustomCard title={t('details.settings')} color="gray" icon={<CardIcons.options />}>
      <div className="flex items-center space-x-2">
        <Switch id="product-enabled" checked={enabledValue} onCheckedChange={onEnabledChange} />
        <Label htmlFor="product-enabled">{t('enabled')}</Label>
      </div>
    </CustomCard>
  );
};
