import { useCallback, useEffect, useMemo, useState } from 'react';

import {
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
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { PermissionsCard } from '@/pages/roles/_components/PermissionsCard';

const ROLE_FORM_KEYS = ['CreateRoleInput', 'code', 'description', 'channelIds', 'permissions'] as const;

export const RoleDetailView = () => {
  const { form, fetchEntity, id } = useDetailView('roles-detail-view', ...ROLE_FORM_KEYS);

  const { base } = form;
  const { t } = useTranslation('roles');
  const [allChannelOptions, setAllChannelOptions] = useState<Option[]>([]);

  const channelIds = base.watch('channelIds');
  const currentChannelOptions = useMemo((): Option[] | undefined => {
    if (!allChannelOptions) return undefined;
    else
      return channelIds?.map((id: string) => allChannelOptions.find((o) => o.value === id) || { value: id, label: id });
  }, [allChannelOptions, channelIds]);

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

      base.setField('code', res.code);
      base.setField('description', res.description);
      base.setField(
        'channelIds',
        res.channels.map((ch) => ch.id),
      );
      base.setField('permissions', res.permissions);
    })();
  }, []);

  return (
    <main className="my-4">
      <div className="flex flex-col gap-3">
        <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="green">
          <div className="flex flex-wrap items-start gap-4 p-0 pt-4 xl:flex-nowrap">
            <div className="flex basis-full md:basis-1/2 xl:basis-1/4">
              <Input
                label={t('details.basic.description')}
                value={base.watch('description') ?? undefined}
                onChange={(e) => base.setField('description', e.target.value)}
                errors={
                  base.formState.errors?.description?.message
                    ? [base.formState.errors.description.message as string]
                    : undefined
                }
                required
              />
            </div>
            <div className="flex basis-full md:basis-1/2 xl:basis-1/4">
              <Input
                label={t('details.basic.code')}
                value={base.watch('code') ?? undefined}
                onChange={(e) => base.setField('code', e.target.value)}
                errors={
                  base.formState.errors?.code?.message ? [base.formState.errors.code.message as string] : undefined
                }
                required
              />
            </div>
            <div className="flex basis-full flex-col gap-[6px] xl:basis-1/2">
              <Label>{t('details.basic.channels')}</Label>
              <MultipleSelector
                options={allChannelOptions}
                value={currentChannelOptions}
                placeholder={t('details.basic.channelsPlaceholder')}
                onChange={(channelsOptions) =>
                  base.setField(
                    'channelIds',
                    channelsOptions.map((o) => o.value),
                  )
                }
                hideClearAllButton
              />
            </div>
          </div>
        </CustomCard>
        <DetailViewMarker position={'roles-detail-view'} />
        <PermissionsCard
          currentPermissions={base.watch('permissions') ?? undefined}
          onPermissionsChange={(e) => base.setField('permissions', e)}
          errors={
            base.formState.errors?.permissions?.message
              ? [base.formState.errors.permissions.message as string]
              : undefined
          }
        />
      </div>
    </main>
  );
};
