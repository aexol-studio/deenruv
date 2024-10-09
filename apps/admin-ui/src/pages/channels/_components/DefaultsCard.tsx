import { Card, CardContent, CardHeader, CardTitle, Label, SimpleSelect, Stack, Switch } from '@/components';
import { Option } from '@/components/ui/multiple-selector';
import { apiCall } from '@/graphql/client';
import { CurrencyCode, LanguageCode } from '@/zeus';
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
}) => {
  const { t } = useTranslation('channels');
  const [zonesOptions, setZonesOptions] = useState<Option[]>();

  const fetchZones = useCallback(async () => {
    const response = await apiCall()('query')({
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
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.defaults.title')}</CardTitle>
        <CardContent className="flex flex-col gap-4 p-0 pt-4">
          <Stack className="gap-3">
            <Stack className="basis-full md:basis-1/2">
              <SimpleSelect
                label={t('details.defaults.defaultLanguage')}
                value={defaultLanguage}
                onValueChange={(e) => onFieldChange('defaultLanguageCode', e)}
                options={availableLanguages?.map((l) => ({ label: l, value: l }))}
              />
            </Stack>
            <Stack className="basis-full md:basis-1/2">
              <SimpleSelect
                label={t('details.defaults.defaultCurrency')}
                value={defaultCurrency}
                onValueChange={(e) => onFieldChange('defaultCurrencyCode', e)}
                options={availableCurrencies?.map((c) => ({ label: c, value: c }))}
              />
            </Stack>
          </Stack>
          <Stack className="gap-3">
            <Stack className="basis-full md:basis-1/2">
              <SimpleSelect
                label={t('details.defaults.defaultTaxZone')}
                value={defaultTaxZone}
                onValueChange={(e) => onFieldChange('defaultTaxZoneId', e)}
                options={zonesOptions}
              />
            </Stack>
            <Stack className="basis-full md:basis-1/2">
              <SimpleSelect
                label={t('details.defaults.defaultShippingZone')}
                value={defaultShippingZone}
                onValueChange={(e) => onFieldChange('defaultShippingZoneId', e)}
                options={zonesOptions}
              />
            </Stack>
          </Stack>
          <Stack className="gap-3">
            <Switch checked={includeTax} onCheckedChange={onIncludeTaxChange} />
            <Label>{t('details.defaults.includeTax')}</Label>
          </Stack>
        </CardContent>
      </CardHeader>
    </Card>
  );
};
