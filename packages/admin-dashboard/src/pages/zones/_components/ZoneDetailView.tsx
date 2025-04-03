import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
} from '@deenruv/react-ui-devkit';
import { CF, EntityCustomFields, Stack } from '@/components';

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
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="green">
            <Stack className="gap-3">
              <Stack className="basis-full md:basis-1/2">
                <Input
                  label={t('details.basic.name')}
                  value={state.name?.value}
                  onChange={(e) => setField('name', e.target.value)}
                  errors={state.name?.errors}
                  required
                />
              </Stack>
              <Stack column className="basis-full md:basis-1/2">
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
              </Stack>
            </Stack>
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
        </Stack>
      </div>
    </main>
  );
};
