import { Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Switch } from '@/components';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LanguageCode } from '@/zeus';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface SettingsCardProps {
  currentTranslationLng: LanguageCode;
  enabledValue: boolean | undefined;
  onEnabledChange?: (e: boolean) => void;
  onCurrentLanguageChange: (e: LanguageCode) => void;
}

export const SettingsCard: React.FC<SettingsCardProps> = ({
  currentTranslationLng,
  onEnabledChange,
  enabledValue,
  onCurrentLanguageChange,
}) => {
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
        <Select defaultValue={LanguageCode.en} value={currentTranslationLng} onValueChange={onCurrentLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={LanguageCode.en}>{LanguageCode.en}</SelectItem>
            <SelectItem value={LanguageCode.pl}>{LanguageCode.pl}</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
