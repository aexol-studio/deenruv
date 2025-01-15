import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Routes,
  DEFAULT_CHANNEL_CODE,
  apiClient,
  useRouteGuard,
} from '@deenruv/react-ui-devkit';
import { toast } from 'sonner';
import { useGFFLP } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';
import { RoleDetailsSelector, RoleDetailsType } from '@/graphql/roles';
import { PageHeader } from '@/pages/roles/_components/PageHeader';
import { PermissionsCard } from '@/pages/roles/_components/PermissionsCard';
import { Stack } from '@/components';
import { Permission } from '@deenruv/admin-types';

const DEFAULT_VALUES = {
  permissions: [Permission.Authenticated],
  description: '',
};

export const RolesDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const editMode = useMemo(() => !!id, [id]);
  const { resetCache } = cache('roles');
  const { t } = useTranslation('roles');
  const [loading, setLoading] = useState(id ? true : false);
  const [role, setRole] = useState<RoleDetailsType>();
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [allChannelOptions, setAllChannelOptions] = useState<Option[]>([]);
  useRouteGuard({ shouldBlock: !buttonDisabled });

  const fetchRole = useCallback(async () => {
    if (id) {
      const response = await apiClient('query')({
        role: [
          {
            id,
          },
          RoleDetailsSelector,
        ],
      });
      setRole(response.role);
      setLoading(false);
    } else setLoading(false);
  }, [id]);

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
    setLoading(true);
    fetchRole();
    fetchChannels();
  }, [id, setLoading, fetchRole, fetchChannels]);

  const { state, setField, checkIfAllFieldsAreValid } = useGFFLP(
    'UpdateRoleInput',
    'code',
    'description',
    'channelIds',
    'permissions',
  )({
    channelIds: {
      validate: (v) => (!v || !v.length ? ['Field required'] : undefined),
    },
    code: {
      validate: (v) => (!v || v === '' ? ['Field required'] : undefined),
    },
    permissions: {
      initialValue: DEFAULT_VALUES.permissions,
      validate: (v) => (!v || !v.length ? ['Field required'] : undefined),
    },
    description: {
      initialValue: DEFAULT_VALUES.description,
    },
  });

  const currentChannelOptions = useMemo((): Option[] | undefined => {
    if (!allChannelOptions) return undefined;
    else
      return state.channelIds?.value?.map(
        (id) => allChannelOptions.find((o) => o.value === id) || { value: id, label: id },
      );
  }, [allChannelOptions, state.channelIds?.value]);

  useEffect(() => {
    if (!role) return;

    setField('code', role.code);
    setField('description', role.description);
    setField(
      'channelIds',
      role.channels.map((ch) => ch.id),
    );
    setField('permissions', role.permissions);
  }, [role]);

  const createRole = useCallback(() => {
    setButtonDisabled(true);
    if (checkIfAllFieldsAreValid())
      apiClient('mutation')({
        createRole: [
          {
            input: {
              code: state.code!.validatedValue!,
              description: state.description!.validatedValue!,
              channelIds: state.channelIds!.validatedValue!,
              permissions: state.permissions?.validatedValue!,
            },
          },
          {
            id: true,
          },
        ],
      })
        .then((resp) => {
          toast.message(t('toasts.roleCreatedSuccess'));
          navigate(Routes.roles.to(resp.createRole.id));
        })
        .catch(() => toast.error(t('toasts.roleCreatedError')));
  }, [state, t, navigate]);

  const updateRole = useCallback(() => {
    apiClient('mutation')({
      updateRole: [
        {
          input: {
            id: id!,
            code: state.code?.validatedValue,
            channelIds: state.channelIds?.validatedValue,
            description: state.description?.validatedValue,
            permissions: state.permissions?.validatedValue,
          },
        },
        {
          id: true,
        },
      ],
    })
      .then(() => {
        toast.message(t('toasts.roleUpdateSuccess'));
        fetchRole();
        resetCache();
      })
      .catch(() => toast.error(t('toasts.roleUpdateError')));
  }, [state, resetCache, fetchRole, id, t]);

  useEffect(() => {
    const areEqual = areObjectsEqual(
      {
        code: state.code?.value,
        description: state.description?.value,
        channelIds: state.channelIds?.value,
        permissions: state.permissions?.value,
      },
      {
        code: role?.code,
        description: editMode ? role?.description : DEFAULT_VALUES.description,
        channelIds: role?.channels.map((ch) => ch.id),
        permissions: editMode ? role?.permissions : DEFAULT_VALUES.permissions,
      },
    );

    setButtonDisabled(areEqual);
  }, [state, role, editMode]);

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !role && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('toasts.roleLoadingError', { value: id })}
    </div>
  ) : (
    <main className="my-4">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <PageHeader
          role={role}
          editMode={editMode}
          buttonDisabled={buttonDisabled}
          onCreate={createRole}
          onEdit={updateRole}
        />
        <Stack column className="gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('details.basic.title')}</CardTitle>
              <CardContent className="flex flex-wrap items-start gap-4 p-0 pt-4 xl:flex-nowrap">
                <Stack className="basis-full md:basis-1/2 xl:basis-1/4">
                  <Input
                    label={t('details.basic.description')}
                    value={state.description?.value ?? undefined}
                    onChange={(e) => setField('description', e.target.value)}
                    required
                  />
                </Stack>
                <Stack className="basis-full md:basis-1/2 xl:basis-1/4">
                  <Input
                    label={t('details.basic.code')}
                    value={state.code?.value ?? undefined}
                    onChange={(e) => setField('code', e.target.value)}
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
              </CardContent>
            </CardHeader>
          </Card>
          <PermissionsCard
            currentPermissions={state.permissions?.value ?? undefined}
            onPermissionsChange={(e) => setField('permissions', e)}
          />
        </Stack>
      </div>
    </main>
  );
};
