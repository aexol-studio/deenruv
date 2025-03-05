import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  MultipleSelector,
  Option,
  useServer,
  useDetailView,
} from '@deenruv/react-ui-devkit';
import { Stack } from '@/components';

const STOCK_LOCATION_FORM_KEYS = ['CreateZoneInput', 'name', 'memberIds'] as const;

export const ZoneDetailView = () => {
  const { form, loading, fetchEntity, entity, setAdditionalData } = useDetailView(
    'zones-detail-view',
    ...STOCK_LOCATION_FORM_KEYS,
  );

  const {
    base: { setField, state },
  } = form;

  const { id } = useParams();
  const editMode = useMemo(() => !!id, [id]);
  const { t } = useTranslation('zones');
  const [countriesOptions, setCountriesOptions] = useState<Option[]>();
  const [_membersIdsToRemove, setMembersIdsToRemove] = useState<string[]>([]);
  const [_membersIdsToAdd, setMembersIdsToAdd] = useState<string[]>([]);
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

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !entity && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.zoneLoadingError', { value: id })}
    </div>
  ) : (
    <main className="my-4 min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex flex-col gap-4 p-0 pt-4">
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
              </CardContent>
            </CardHeader>
          </Card>
        </Stack>
      </div>
    </main>
  );
};
