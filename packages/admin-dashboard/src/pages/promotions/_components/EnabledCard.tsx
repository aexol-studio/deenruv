import { Label, Switch, CustomCard, CardIcons } from '@deenruv/react-ui-devkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface EnabledCardProps {
  enabledValue: boolean | undefined;
  onEnabledChange?: (e: boolean) => void;
}

export const EnabledCard: React.FC<EnabledCardProps> = ({ onEnabledChange, enabledValue }) => {
  const { t } = useTranslation('products');

  return (
    <CustomCard title={t('details.basicInfo')} icon={<CardIcons.default />} color="teal">
      <div className="flex items-center space-x-2">
        <Switch id="product-enabled" checked={enabledValue} onCheckedChange={onEnabledChange} />
        <Label htmlFor="product-enabled">{t('enabled')}</Label>
      </div>
    </CustomCard>
  );
};
