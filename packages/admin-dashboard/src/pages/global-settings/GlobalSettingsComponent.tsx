import { LanguageCode } from '@deenruv/admin-types';
import {
  Label,
  Button,
  Switch,
  Card,
  MultipleSelector,
  Input,
  useDetailView,
  useSettings,
} from '@deenruv/react-ui-devkit';
import { t } from 'i18next';
import { useEffect, useMemo } from 'react';

export const GlobalSettingsComponent = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { form, fetchEntity } = useDetailView(
    'globalSettings-detail-view',
    'UpdateGlobalSettingsInput',
    'availableLanguages',
    'outOfStockThreshold',
    'trackInventory',
  );
  const {
    base: { state, setField },
  } = form;

  const options = useMemo(
    () => Object.values(LanguageCode).map((el) => ({ label: `${t(`languageCode.${el}`)} (${el})`, value: el })),
    [t],
  );

  useEffect(() => {
    const init = async () => {
      const data = await fetchEntity();
      if (data) {
        setField('availableLanguages', data.availableLanguages);
        setField('outOfStockThreshold', data.outOfStockThreshold);
        setField('trackInventory', data.trackInventory);
      }
    };
    init();
  }, [contentLng]);
  console.log(state);

  return (
    <div className="flex flex-col gap-6 p-4">
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
              value={state.outOfStockThreshold?.value ?? undefined}
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
          <Switch
            checked={state.trackInventory?.value ?? undefined}
            onCheckedChange={(val) => setField('trackInventory', val)}
          />
        </div>
      </Card>
    </div>
  );
};
