import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiCall } from '@/graphql/client';
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Stack } from '@/components';
import { toast } from 'sonner';
import { useGFFLP } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';
import { PageHeader } from '@/pages/zones/_components/PageHeader';
import { Routes } from '@/utils';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { useServer } from '@/state';
import { ZoneDetailsSelector, ZoneDetailsType } from '@/graphql/zones';

export const ZonesDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = useMemo(() => !!id, [id]);
  const { resetCache } = cache('zones');
  const { t } = useTranslation('zones');
  const [loading, setLoading] = useState(id ? true : false);
  const [zone, setZone] = useState<ZoneDetailsType>();
  const [countriesOptions, setCountriesOptions] = useState<Option[]>();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [countriesIdsToRemove, setCountriesIdsToRemove] = useState<string[]>([]);
  const [countriesIdsToAdd, setCountriesIdsToAdd] = useState<string[]>([]);
  const { countries } = useServer();

  const fetchZone = useCallback(async () => {
    if (id) {
      const response = await apiCall()('query')({
        zone: [
          {
            id,
          },
          ZoneDetailsSelector,
        ],
      });
      setZone(response.zone);
      setLoading(false);
    } else setLoading(false);
  }, [id]);

  useEffect(() => {
    setCountriesOptions(countries.map((c) => ({ label: c.name, value: c.id })));
  }, [countries]);

  useEffect(() => {
    setLoading(true);
    fetchZone();
  }, [id, setLoading, fetchZone]);

  const { state, setField } = useGFFLP('CreateZoneInput', 'name', 'memberIds')({});

  useEffect(() => {
    if (!zone) return;
    setField('name', zone.name);
    setField(
      'memberIds',
      zone.members.map((m) => m.id),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone]);

  const createZone = useCallback(() => {
    apiCall()('mutation')({
      createZone: [
        {
          input: {
            name: state.name!.validatedValue!,
            memberIds: state.memberIds!.validatedValue!,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then((resp) => {
        toast.message(t('toasts.zoneCreatedSuccess'));
        navigate(Routes.zones.to(resp.createZone.id));
      })
      .catch(() => toast.error(t('toasts.zoneCreatedError')));
  }, [state, t, navigate]);

  const updateZone = useCallback(() => {
    apiCall()('mutation')({
      updateZone: [
        {
          input: {
            id: id!,
            name: state.name?.validatedValue,
          },
        },
        {
          id: true,
        },
      ],
      removeMembersFromZone: [
        {
          zoneId: id!,
          memberIds: countriesIdsToRemove,
        },
        {
          id: true,
        },
      ],
      addMembersToZone: [
        {
          zoneId: id!,
          memberIds: countriesIdsToAdd,
        },
        {
          id: true,
        },
      ],
    })
      .then(() => {
        toast.message(t('toasts.zoneUpdateSuccess'));
        fetchZone();
        resetCache();
      })
      .catch(() => toast.error(t('toasts.zoneUpdateError')));
  }, [state, resetCache, fetchZone, id, t, countriesIdsToAdd, countriesIdsToRemove]);

  useEffect(() => {
    const areEqual = areObjectsEqual(
      {
        name: state.name?.value,
        memberIds: state.memberIds?.value,
      },
      {
        name: zone?.name,
        memberIds: zone?.members.map((m) => m.id),
      },
    );

    editMode && setButtonDisabled(areEqual);
  }, [state, zone, editMode]);

  const handleChange = useCallback(
    (options: Option[]) => {
      setField(
        'memberIds',
        options.map((o) => o.value),
      );

      if (editMode && zone) {
        const backendMembersIds = zone.members.map((m) => m.id);
        const optionValues = options.map((o) => o.value);

        // if BE doesn't include option ids, add them
        setCountriesIdsToAdd(optionValues.filter((v) => !backendMembersIds?.includes(v)));

        // if currentState doesn't include BE ids, remove them
        setCountriesIdsToRemove(backendMembersIds?.filter((id) => !optionValues.includes(id)));
      }
    },
    [editMode, setField, zone],
  );

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !zone && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.zoneLoadingError', { value: id })}
    </div>
  ) : (
    <main className="min-h-96">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <PageHeader
          zone={zone}
          editMode={editMode}
          buttonDisabled={buttonDisabled}
          onCreate={createZone}
          onEdit={updateZone}
        />
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
