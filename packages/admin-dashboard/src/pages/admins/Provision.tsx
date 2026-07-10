import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, BadgeCheck, ShieldCheck, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { ModelTypes, Permission } from '@deenruv/admin-types';
import {
  apiClient,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  DEFAULT_CHANNEL_CODE,
  Input,
  Label,
  MultipleSelector,
  type Option,
  PageBlock,
  Routes,
  Separator,
  useServer,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { PermissionsTable } from '@/pages/roles/_components/PermissionsTable';

const SHOP_MANAGER_ROLE_PERMISSIONS = [
  Permission.ReadOrder,
  Permission.UpdateOrder,
  Permission.ReadCustomer,
  Permission.UpdateCustomer,
  Permission.ReadProduct,
  Permission.ReadCatalog,
  Permission.ReadAsset,
  Permission.ReadCollection,
  Permission.ReadFacet,
  Permission.ReadPaymentMethod,
  Permission.ReadShippingMethod,
  Permission.ReadCountry,
  Permission.ReadStockLocation,
];

type ProvisionRole = {
  id: string;
  code: string;
  description: string;
  permissions: Permission[];
  channels: Array<{ id: string; code: string }>;
};

type FormErrors = Partial<
  Record<'firstName' | 'lastName' | 'emailAddress' | 'password' | 'roleCode' | 'channelIds' | 'permissions', string>
>;

const roleProvisionSelector = {
  id: true,
  code: true,
  description: true,
  permissions: true,
  channels: {
    id: true,
    code: true,
  },
} as const;

const findRoleByCode = async (code: string): Promise<ProvisionRole | undefined> => {
  const response = await apiClient('query')({
    roles: [
      {
        options: {
          take: 1,
          filter: {
            code: {
              eq: code,
            },
          },
        },
      },
      { items: roleProvisionSelector },
    ],
  });

  return response.roles.items[0] as ProvisionRole | undefined;
};

const normalizeRoleCode = (value: string) => value.trim().toLowerCase().replace(/\s+/g, '-');

export const AdminsProvisionPage = () => {
  const { t } = useTranslation('admins');
  const { t: tRoles } = useTranslation('roles');
  const navigate = useNavigate();
  const { channels, serverConfig } = useServer();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [roleCode, setRoleCode] = useState('shop-manager');
  const [roleDescription, setRoleDescription] = useState(t('provision.presets.shopManager.roleDescription'));
  const [channelIds, setChannelIds] = useState<string[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>(SHOP_MANAGER_ROLE_PERMISSIONS);
  const [reuseExistingRole, setReuseExistingRole] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const channelOptions = useMemo<Option[]>(
    () =>
      channels.map((channel) => ({
        value: channel.id,
        label: channel.code === DEFAULT_CHANNEL_CODE ? tRoles('defaultChannel') : channel.code,
      })),
    [channels, tRoles],
  );

  const currentChannelOptions = useMemo(
    () => channelIds.map((id) => channelOptions.find((option) => option.value === id) || { value: id, label: id }),
    [channelIds, channelOptions],
  );

  const assignablePermissions = useMemo(() => {
    if (!serverConfig?.permissions) return undefined;
    return new Set(
      serverConfig.permissions
        .filter((permission) => permission.assignable)
        .map((permission) => permission.name as Permission),
    );
  }, [serverConfig]);

  const selectedAssignablePermissions = useMemo(() => {
    if (!assignablePermissions) return permissions;
    return permissions.filter((permission) => assignablePermissions.has(permission));
  }, [assignablePermissions, permissions]);

  useEffect(() => {
    if (!channelIds.length && channels.length) {
      setChannelIds(channels.map((channel) => channel.id));
    }
  }, [channelIds.length, channels]);

  useEffect(() => {
    setRoleDescription(t('provision.presets.shopManager.roleDescription'));
  }, [t]);

  const applyShopManagerPreset = () => {
    setRoleCode('shop-manager');
    setRoleDescription(t('provision.presets.shopManager.roleDescription'));
    setPermissions(SHOP_MANAGER_ROLE_PERMISSIONS);
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    const normalizedRoleCode = normalizeRoleCode(roleCode);

    if (!firstName.trim()) nextErrors.firstName = t('validation.firstNameRequired');
    if (!lastName.trim()) nextErrors.lastName = t('validation.lastNameRequired');
    if (!emailAddress.trim()) nextErrors.emailAddress = t('provision.validation.emailRequired');
    if (emailAddress.trim() && !emailAddress.includes('@')) {
      nextErrors.emailAddress = t('provision.validation.emailInvalid');
    }
    if (!password.trim()) nextErrors.password = t('validation.passwordRequired');
    if (!normalizedRoleCode) nextErrors.roleCode = t('provision.validation.roleCodeRequired');

    if (!reuseExistingRole) {
      if (!channelIds.length) nextErrors.channelIds = t('provision.validation.channelsRequired');
      if (!selectedAssignablePermissions.length) {
        nextErrors.permissions = t('provision.validation.permissionsRequired');
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const createRole = async () => {
    const response = await apiClient('mutation')({
      createRole: [
        {
          input: {
            code: normalizeRoleCode(roleCode),
            description: roleDescription.trim() || normalizeRoleCode(roleCode),
            channelIds,
            permissions: selectedAssignablePermissions as ModelTypes['CreateRoleInput']['permissions'],
          },
        },
        roleProvisionSelector,
      ],
    });

    return response.createRole as ProvisionRole;
  };

  const createAdministrator = async (roleId: string) => {
    const response = await apiClient('mutation')({
      createAdministrator: [
        {
          input: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            emailAddress: emailAddress.trim(),
            password,
            roleIds: [roleId],
          },
        },
        {
          id: true,
          emailAddress: true,
        },
      ],
    });

    return response.createAdministrator;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    const normalizedRoleCode = normalizeRoleCode(roleCode);

    try {
      const existingRole = await findRoleByCode(normalizedRoleCode);
      let roleId = existingRole?.id;

      if (reuseExistingRole) {
        if (!roleId) {
          setErrors({ roleCode: t('provision.validation.roleNotFound') });
          toast.error(t('provision.toasts.roleNotFound'));
          return;
        }
      } else {
        if (existingRole) {
          setErrors({ roleCode: t('provision.validation.roleCodeExists') });
          toast.error(t('provision.toasts.roleCodeExists'));
          return;
        }

        roleId = (await createRole()).id;
      }

      const administrator = await createAdministrator(roleId);
      toast.success(t('provision.toasts.success'));
      navigate(Routes.admins.to(administrator.id));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t('provision.toasts.error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageBlock>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <Button variant="secondary" size="icon" className="mt-1" onClick={() => navigate(Routes.admins.list)}>
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{t('provision.title')}</h1>
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{t('provision.description')}</p>
            </div>
          </div>
          <Button className="gap-2" disabled={submitting} onClick={handleSubmit}>
            <UserPlus className="size-4" />
            {submitting ? t('provision.submitting') : t('provision.submit')}
          </Button>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('provision.admin.title')}</CardTitle>
                <CardDescription>{t('provision.admin.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label={t('details.basic.firstName')}
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    errors={errors.firstName ? [errors.firstName] : undefined}
                    required
                  />
                  <Input
                    label={t('details.basic.lastName')}
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    errors={errors.lastName ? [errors.lastName] : undefined}
                    required
                  />
                  <Input
                    label={t('details.basic.emailAddress')}
                    type="email"
                    value={emailAddress}
                    onChange={(event) => setEmailAddress(event.target.value)}
                    errors={errors.emailAddress ? [errors.emailAddress] : undefined}
                    required
                  />
                  <Input
                    label={t('details.basic.password')}
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    errors={errors.password ? [errors.password] : undefined}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('provision.role.title')}</CardTitle>
                <CardDescription>{t('provision.role.description')}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label={t('provision.role.code')}
                    value={roleCode}
                    onChange={(event) => setRoleCode(event.target.value)}
                    onBlur={() => setRoleCode(normalizeRoleCode(roleCode))}
                    errors={errors.roleCode ? [errors.roleCode] : undefined}
                    required
                  />
                  <Input
                    label={t('provision.role.descriptionLabel')}
                    value={roleDescription}
                    onChange={(event) => setRoleDescription(event.target.value)}
                    required={!reuseExistingRole}
                    disabled={reuseExistingRole}
                  />
                </div>

                <label className="flex items-start gap-3 border border-border/70 bg-muted/30 p-3 text-sm">
                  <Checkbox
                    checked={reuseExistingRole}
                    onCheckedChange={(checked) => setReuseExistingRole(checked === true)}
                  />
                  <span className="flex flex-col gap-1">
                    <span className="font-medium">{t('provision.role.reuseExisting')}</span>
                    <span className="text-muted-foreground">{t('provision.role.reuseExistingHint')}</span>
                  </span>
                </label>

                {!reuseExistingRole && (
                  <div className="flex flex-col gap-2">
                    <Label>{t('provision.role.channels')}</Label>
                    <MultipleSelector
                      options={channelOptions}
                      value={currentChannelOptions}
                      placeholder={t('provision.role.channelsPlaceholder')}
                      onChange={(options) => setChannelIds(options.map((option) => option.value))}
                      hideClearAllButton
                    />
                    {errors.channelIds && <p className="text-xs text-destructive">{errors.channelIds}</p>}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('provision.permissions.title')}</CardTitle>
                <CardDescription>{t('provision.permissions.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                {reuseExistingRole ? (
                  <div className="border border-dashed border-border p-4 text-sm text-muted-foreground">
                    {t('provision.permissions.reuseExisting')}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {errors.permissions && <p className="text-xs text-destructive">{errors.permissions}</p>}
                    <PermissionsTable
                      currentPermissions={selectedAssignablePermissions}
                      onPermissionsChange={setPermissions}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="size-5 text-primary" />
                  {t('provision.presets.title')}
                </CardTitle>
                <CardDescription>{t('provision.presets.description')}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <button
                  type="button"
                  className="border border-primary/40 bg-primary/10 p-4 text-left transition-colors hover:bg-primary/15"
                  onClick={applyShopManagerPreset}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{t('provision.presets.shopManager.title')}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {t('provision.presets.shopManager.description')}
                      </p>
                    </div>
                    <Badge variant="secondary">{t('provision.presets.defaultBadge')}</Badge>
                  </div>
                </button>

                <Separator />

                <div className="flex items-start gap-3 text-sm">
                  <BadgeCheck className="mt-0.5 size-4 text-green-600" />
                  <p className="text-muted-foreground">{t('provision.presets.backendNote')}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('provision.summary.title')}</CardTitle>
                <CardDescription>{t('provision.summary.description')}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">{t('provision.summary.role')}</span>
                  <Badge variant="outline">{normalizeRoleCode(roleCode) || '-'}</Badge>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">{t('provision.summary.channels')}</span>
                  <span className="font-medium">{reuseExistingRole ? '-' : channelIds.length}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">{t('provision.summary.permissions')}</span>
                  <span className="font-medium">{reuseExistingRole ? '-' : selectedAssignablePermissions.length}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">{t('provision.summary.mode')}</span>
                  <span className="font-medium">
                    {reuseExistingRole ? t('provision.summary.reuse') : t('provision.summary.create')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageBlock>
  );
};
