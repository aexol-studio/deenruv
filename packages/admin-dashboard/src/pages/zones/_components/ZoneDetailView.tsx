import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Input,
  Label,
  MultipleSelector,
  Option,
  useServer,
  useDetailView,
  DetailViewMarker,
  CustomCard,
  CardIcons,
  CF,
  EntityCustomFields,
  useTranslation,
} from '@deenruv/react-ui-devkit';

const STOCK_LOCATION_FORM_KEYS = ['CreateZoneInput', 'name', 'memberIds', 'customFields'] as const;

export const ZoneDetailView = () => {
  const { form, fetchEntity, entity, setAdditionalData, id } = useDetailView(
    'zones-detail-view',
    ...STOCK_LOCATION_FORM_KEYS,
  );

  const {
    base: { setField, state },
  } = form;

  const editMode = useMemo(() => !!id, [id]);
  const { t } = useTranslation('zones');
  const [countriesOptions, setCountriesOptions] = useState<Option[]>();
  const [, setMembersIdsToRemove] = useState<string[]>([]);
  const [, setMembersIdsToAdd] = useState<string[]>([]);
  const countries = useServer((p) => p.countries);

  useEffect(() => {
    setCountriesOptions(countries.map((c) => ({ label: c.name, value: c.id })));
  }, [countries]);

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();

      if (!res) return;

      setField('name', res.name);
      setField(
        'memberIds',
        res.members.map((m) => m.id),
      );
    })();
  }, []);

  const handleChange = useCallback(
    (options: Option[]) => {
      setField(
        'memberIds',
        options.map((o) => o.value),
      );

      if (editMode && entity) {
        const backendMembersIds = entity.members.map((m) => m.id);
        const optionValues = options.map((o) => o.value);
        const toAdd = optionValues.filter((v) => !backendMembersIds?.includes(v));
        const toRemove = backendMembersIds?.filter((id) => !optionValues.includes(id));

        setAdditionalData((prev) => {
          const newData = { ...prev, membersIdsToRemove: toRemove, membersIdsToAdd: toAdd };
          return newData;
        });

        // if BE doesn't include option ids, add them
        setMembersIdsToAdd(toAdd);

        // if currentState doesn't include BE ids, remove them
        setMembersIdsToRemove(toRemove);
      }
    },
    [editMode, setField, entity],
  );

  return (
    <main className="my-4 min-h-96">
      <div className="flex flex-col gap-3">
        <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="green">
          <div className="flex gap-3">
            <div className="flex basis-full md:basis-1/2">
              <Input
                label={t('details.basic.name')}
                value={state.name?.value}
                onChange={(e) => setField('name', e.target.value)}
                errors={state.name?.errors}
                required
              />
            </div>
            <div className="flex basis-full flex-col md:basis-1/2">
              <Label className="mb-2">{t('details.basic.members')}</Label>
              <MultipleSelector
                options={countriesOptions}
                value={state?.memberIds?.value?.map((id) => ({
                  label: countriesOptions?.find((o) => o.value === id)?.label || id,
                  value: id,
                }))}
                placeholder={t('details.basic.memberPlaceholder')}
                onChange={handleChange}
                hideClearAllButton
              />
            </div>
          </div>
        </CustomCard>
        <DetailViewMarker position={'zones-detail-view'} />
        <EntityCustomFields
          entityName="zone"
          id={id}
          hideButton
          onChange={(customFields) => {
            setField('customFields', customFields);
          }}
          initialValues={
            entity && 'customFields' in entity ? { customFields: entity.customFields as CF } : { customFields: {} }
          }
        />
      </div>
    </main>
  );
};
