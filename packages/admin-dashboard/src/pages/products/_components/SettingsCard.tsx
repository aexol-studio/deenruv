import { Label, Switch, Card, CardHeader, CardTitle, CardContent } from '@deenruv/react-ui-devkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface SettingsCardProps {
  enabledValue: boolean | undefined;
  onEnabledChange?: (e: boolean) => void;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({ onEnabledChange, enabledValue }) => {
  const { t } = useTranslation('products');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.basicInfo')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center space-x-2">
          <Switch id="product-enabled" checked={enabledValue} onCheckedChange={onEnabledChange} />
          <Label htmlFor="product-enabled">{t('enabled')}</Label>
        </div>
      </CardContent>
    </Card>
  );
};
