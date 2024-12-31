import { $, LanguageCode, scalars, typedGql } from '@deenruv/admin-types';
import {
  Button,
  Card,
  Input,
  Label,
  MultipleSelector,
  Switch,
  useGFFLP,
  useMutation,
  useQuery,
  useSettings,
} from '@deenruv/react-ui-devkit';

import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const GlobalSettingsQuery = typedGql('query', { scalars })({
  globalSettings: { availableLanguages: true, outOfStockThreshold: true, trackInventory: true },
});

const GlobalSettingsMutation = typedGql('mutation', { scalars })({
  updateGlobalSettings: [
    { input: $('input', 'UpdateGlobalSettingsInput!') },
    {
      __typename: true,
      '...on GlobalSettings': {
        availableLanguages: true,
        outOfStockThreshold: true,
        trackInventory: true,
      },
      '...on ChannelDefaultLanguageError': {
        message: true,
      },
    },
  ],
});

export const GlobalSettings = () => {
  const { data } = useQuery(GlobalSettingsQuery);
  const [update, { loading }] = useMutation(GlobalSettingsMutation);
  const { t } = useTranslation(['common', 'globalSettings']);
  const { state, setField } = useGFFLP(
    'UpdateGlobalSettingsInput',
    'availableLanguages',
    'outOfStockThreshold',
    'trackInventory',
  )({
    availableLanguages: { initialValue: [] },
    outOfStockThreshold: { initialValue: 0 },
    trackInventory: { initialValue: false },
  });

  const setAvailableLanguages = useSettings((p) => p.setAvailableLanguages);

  const options = useMemo(
    () => Object.values(LanguageCode).map((el) => ({ label: `${t(`languageCode.${el}`)} (${el})`, value: el })),
    [t],
  );

  const submitHandler = useCallback(async () => {
    const res = await update({
      input: {
        availableLanguages: state.availableLanguages?.value,
        outOfStockThreshold: state.outOfStockThreshold?.value,
        trackInventory: state.trackInventory?.value,
      },
    });

    if (res.updateGlobalSettings.__typename === 'GlobalSettings') {
      setAvailableLanguages(res?.updateGlobalSettings.availableLanguages || []);
      toast.success(t('common:toasts.success.update'));
      return;
    }
    if (res.updateGlobalSettings.__typename === 'ChannelDefaultLanguageError') {
      toast.error(res.updateGlobalSettings.message);
      return;
    }
    toast.error(t('common:toasts.error.mutation'));
  }, [state]);

  useEffect(() => {
    if (!data?.globalSettings) return;
    for (const key in data.globalSettings) {
      const fieldName = key as keyof typeof data.globalSettings;
      setField(fieldName, data.globalSettings[fieldName]);
    }
  }, [data?.globalSettings]);

  return (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex justify-end">
        <Button onClick={submitHandler} disabled={loading}>
          {t('common:update')}
        </Button>
      </div>
      <Card className="flex flex-col gap-4 p-6">
        <div className="flex justify-between gap-4">
          <div className="flex flex-1 flex-col gap-1.5">
            <div>
              <p>{t('globalSettings:available-languages.label')}</p>
              <Label className="text-muted-foreground text-xs">
                {t('globalSettings:available-languages.description')}
              </Label>
            </div>
            <MultipleSelector
              options={options}
              value={state.availableLanguages?.value?.map((el) => ({
                label: t(`languageCode.${el}`),
                value: el,
              }))}
              placeholder={t('globalSettings:available-languages.placeholder')}
              onChange={(val) =>
                setField(
                  'availableLanguages',
                  val.map((el) => el.value as LanguageCode),
                )
              }
            />
          </div>
          <div className="flex flex-1 flex-col gap-1.5">
            <div>
              <p>{t('globalSettings:stock-threshold.label')}</p>
              <Label className="text-muted-foreground text-xs">{t('globalSettings:stock-threshold.description')}</Label>
            </div>
            <Input
              value={state.outOfStockThreshold?.value}
              type="number"
              onChange={(e) => setField('outOfStockThreshold', Number(e.target.value))}
              required
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-1.5">
          <div>
            <p>{t('globalSettings:track-inventory.label')}</p>
            <Label className="text-muted-foreground text-xs">{t('globalSettings:track-inventory.description')}</Label>
          </div>
          <Switch checked={state.trackInventory?.value} onCheckedChange={(val) => setField('trackInventory', val)} />
        </div>
      </Card>
    </div>
  );
};
