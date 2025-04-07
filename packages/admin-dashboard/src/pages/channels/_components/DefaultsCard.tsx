import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Switch,
  type Option,
  apiClient,
  SimpleSelect,
  CustomCard,
  CardIcons,
} from '@deenruv/react-ui-devkit';

import { CurrencyCode, LanguageCode } from '@deenruv/admin-types';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DefaultsCardProps {
  onIncludeTaxChange: (e: boolean) => void;
  onFieldChange: (
    fieldName: 'defaultLanguageCode' | 'defaultCurrencyCode' | 'defaultShippingZoneId' | 'defaultTaxZoneId',
    value: string,
  ) => void;
  availableLanguages: LanguageCode[] | undefined;
  availableCurrencies: CurrencyCode[] | undefined;
  defaultLanguage: LanguageCode | undefined;
  defaultCurrency: CurrencyCode | undefined;
  defaultTaxZone: string | undefined;
  defaultShippingZone: string | undefined;
  includeTax: boolean | undefined;
  defaultLanguageErrors?: string[];
  defaultTaxZoneErrors?: string[];
  defaultShippingZoneErrors?: string[];
}

export const DefaultsCard: React.FC<DefaultsCardProps> = ({
  availableLanguages,
  availableCurrencies,
  defaultLanguage,
  defaultCurrency,
  defaultTaxZone,
  defaultShippingZone,
  includeTax,
  onFieldChange,
  onIncludeTaxChange,
  defaultLanguageErrors,
  defaultTaxZoneErrors,
  defaultShippingZoneErrors,
}) => {
  const { t } = useTranslation('channels');
  const [zonesOptions, setZonesOptions] = useState<Option[]>();

  const fetchZones = useCallback(async () => {
    const response = await apiClient('query')({
      zones: [
        {},
        {
          items: {
            id: true,
            name: true,
          },
        },
      ],
    });
    setZonesOptions(response.zones.items.map((z) => ({ label: z.name, value: z.id })));
  }, []);

  useEffect(() => {
    fetchZones();
  }, [fetchZones]);

  return (
    <CustomCard title={t('details.defaults.title')} icon={<CardIcons.default />}>
      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="flex basis-full md:basis-1/2">
            <SimpleSelect
              label={t('details.defaults.defaultLanguage')}
              value={defaultLanguage}
              onValueChange={(e) => onFieldChange('defaultLanguageCode', e)}
              options={availableLanguages?.map((l) => ({ label: l, value: l }))}
              errors={defaultLanguageErrors}
              disabled={!availableLanguages?.length}
            />
          </div>
          <div className="flex basis-full md:basis-1/2">
            <SimpleSelect
              label={t('details.defaults.defaultCurrency')}
              value={defaultCurrency}
              onValueChange={(e) => onFieldChange('defaultCurrencyCode', e)}
              options={availableCurrencies?.map((c) => ({ label: c, value: c }))}
              disabled={!availableCurrencies?.length}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex basis-full md:basis-1/2">
            <SimpleSelect
              label={t('details.defaults.defaultTaxZone')}
              value={defaultTaxZone}
              onValueChange={(e) => onFieldChange('defaultTaxZoneId', e)}
              options={zonesOptions}
              errors={defaultTaxZoneErrors}
            />
          </div>
          <div className="flex basis-full md:basis-1/2">
            <SimpleSelect
              label={t('details.defaults.defaultShippingZone')}
              value={defaultShippingZone}
              onValueChange={(e) => onFieldChange('defaultShippingZoneId', e)}
              options={zonesOptions}
              errors={defaultShippingZoneErrors}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <Switch checked={includeTax} onCheckedChange={onIncludeTaxChange} />
          <Label>{t('details.defaults.includeTax')}</Label>
        </div>
      </div>
    </CustomCard>
  );
};
