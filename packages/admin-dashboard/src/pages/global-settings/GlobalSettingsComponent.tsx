import { LanguageCode } from '@deenruv/admin-types';
import {
  Label,
  Switch,
  MultipleSelector,
  Input,
  useDetailView,
  useSettings,
  CustomCard,
  CardIcons,
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
      <CustomCard
        title={t('globalSettings:available-languages.label')}
        description={t('globalSettings:available-languages.description')}
        icon={<CardIcons.options />}
        color="green"
      >
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
      </CustomCard>
      <CustomCard
        title={t('globalSettings:stock-threshold.label')}
        description={t('globalSettings:stock-threshold.description')}
        icon={<CardIcons.options />}
        color="teal"
      >
        <Input
          value={state.outOfStockThreshold?.value ?? undefined}
          type="number"
          onChange={(e) => setField('outOfStockThreshold', Number(e.target.value))}
          required
        />
      </CustomCard>
      <CustomCard
        title={t('globalSettings:track-inventory.label')}
        description={t('globalSettings:track-inventory.description')}
        icon={<CardIcons.options />}
        color="cyan"
      >
        <Switch
          checked={state.trackInventory?.value ?? undefined}
          onCheckedChange={(val) => setField('trackInventory', val)}
        />
      </CustomCard>
    </div>
  );
};
