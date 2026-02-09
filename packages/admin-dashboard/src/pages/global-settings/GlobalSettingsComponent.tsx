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
  const { base } = form;

  const options = useMemo(
    () => Object.values(LanguageCode).map((el) => ({ label: `${t(`languageCode.${el}`)} (${el})`, value: el })),
    [t],
  );

  useEffect(() => {
    const init = async () => {
      const data = await fetchEntity();
      if (data) {
        base.setField('availableLanguages', data.availableLanguages);
        base.setField('outOfStockThreshold', data.outOfStockThreshold);
        base.setField('trackInventory', data.trackInventory);
        if ('customFields' in data) base.setField('customFields', data.customFields as CF);
      }
    };
    init();
  }, [contentLng]);

  const availableLanguages = base.watch('availableLanguages');

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
          value={availableLanguages?.map((el: string) => ({
            label: t(`languageCode.${el}`),
            value: el,
          }))}
          placeholder={t('globalSettings:available-languages.placeholder')}
          onChange={(val) =>
            base.setField(
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
          value={base.watch('outOfStockThreshold') ?? ''}
          type="number"
          onChange={(e) => base.setField('outOfStockThreshold', Number(e.target.value))}
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
          checked={base.watch('trackInventory') ?? false}
          onCheckedChange={(val) => base.setField('trackInventory', val)}
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
          base.setField('customFields', cf);
        }}
        additionalData={{}}
      />
    </div>
  );
};
