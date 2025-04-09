import { LanguageCode } from '@deenruv/admin-types';
import {
  Switch,
  MultipleSelector,
  Input,
  useDetailView,
  useSettings,
  CustomCard,
  CardIcons,
  EntityCustomFields,
  CF,
} from '@deenruv/react-ui-devkit';
import { t } from 'i18next';
import { useEffect, useMemo } from 'react';

export const GlobalSettingsComponent = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { form, fetchEntity, entity } = useDetailView(
    'globalSettings-detail-view',
    'UpdateGlobalSettingsInput',
    'availableLanguages',
    'outOfStockThreshold',
    'trackInventory',
    'customFields',
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
        if ('customFields' in data) setField('customFields', data.customFields as CF);
      }
    };
    init();
  }, [contentLng]);

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
      <EntityCustomFields
        id={entity?.id}
        entityName="globalSettings"
        hideButton
        initialValues={
          entity && 'customFields' in entity ? { customFields: entity.customFields as any } : { customFields: {} }
        }
        onChange={(cf) => {
          setField('customFields', cf);
        }}
        additionalData={{}}
      />
    </div>
  );
};
