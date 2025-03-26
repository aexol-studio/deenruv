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
  type Option,
  DEFAULT_CHANNEL_CODE,
  apiClient,
  useDetailView,
  DetailViewMarker,
  CustomCard,
  CardIcons,
} from '@deenruv/react-ui-devkit';
import { PermissionsCard } from '@/pages/roles/_components/PermissionsCard';
import { EntityCustomFields, Stack } from '@/components';

const ROLE_FORM_KEYS = ['CreateRoleInput', 'code', 'description', 'channelIds', 'permissions'] as const;

export const RoleDetailView = () => {
  const { id } = useParams();
  const { form, loading, fetchEntity, entity } = useDetailView('roles-detail-view', ...ROLE_FORM_KEYS);

  const {
    base: { setField, state },
  } = form;
  const editMode = useMemo(() => !!id, [id]);
  const { t } = useTranslation('roles');
  const [allChannelOptions, setAllChannelOptions] = useState<Option[]>([]);

  const currentChannelOptions = useMemo((): Option[] | undefined => {
    if (!allChannelOptions) return undefined;
    else
      return state.channelIds?.value?.map(
        (id) => allChannelOptions.find((o) => o.value === id) || { value: id, label: id },
      );
  }, [allChannelOptions, state.channelIds?.value]);

  const fetchChannels = useCallback(async () => {
    const response = await apiClient('query')({
      channels: [
        {},
        {
          items: {
            code: true,
            id: true,
          },
        },
      ],
    });
    setAllChannelOptions(
      response.channels.items.map((ch) => ({
        value: ch.id,
        label: ch.code === DEFAULT_CHANNEL_CODE ? t('defaultChannel') : ch.code,
      })),
    );
  }, [setAllChannelOptions, t]);

  useEffect(() => {
    fetchChannels();
  }, [id, fetchChannels]);

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();

      if (!res) return;

      setField('code', res.code);
      setField('description', res.description);
      setField(
        'channelIds',
        res.channels.map((ch) => ch.id),
      );
      setField('permissions', res.permissions);
    })();
  }, []);

  return (
    <main className="my-4">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <Stack column className="gap-3">
          <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="green">
            <div className="flex flex-wrap items-start gap-4 p-0 pt-4 xl:flex-nowrap">
              <Stack className="basis-full md:basis-1/2 xl:basis-1/4">
                <Input
                  label={t('details.basic.description')}
                  value={state.description?.value ?? undefined}
                  onChange={(e) => setField('description', e.target.value)}
                  errors={state.description?.errors}
                  required
                />
              </Stack>
              <Stack className="basis-full md:basis-1/2 xl:basis-1/4">
                <Input
                  label={t('details.basic.code')}
                  value={state.code?.value ?? undefined}
                  onChange={(e) => setField('code', e.target.value)}
                  errors={state.code?.errors}
                  required
                />
              </Stack>
              <Stack column className="basis-full gap-[6px] xl:basis-1/2">
                <Label>{t('details.basic.channels')}</Label>
                <MultipleSelector
                  options={allChannelOptions}
                  value={currentChannelOptions}
                  placeholder={t('details.basic.channelsPlaceholder')}
                  onChange={(channelsOptions) =>
                    setField(
                      'channelIds',
                      channelsOptions.map((o) => o.value),
                    )
                  }
                  hideClearAllButton
                />
              </Stack>
            </div>
          </CustomCard>

          <DetailViewMarker position={'roles-detail-view'} />
          {id && <EntityCustomFields entityName="role" id={id} />}
          <PermissionsCard
            currentPermissions={state.permissions?.value ?? undefined}
            onPermissionsChange={(e) => setField('permissions', e)}
            errors={state.permissions?.errors}
          />
        </Stack>
      </div>
    </main>
  );
};
