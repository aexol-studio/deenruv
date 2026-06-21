import React, { useMemo } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { ChevronLeft, EllipsisVerticalIcon, Trash2 } from "lucide-react";
import { ModelTypes, Permission } from "@deenruv/admin-types";
import { cn } from "@/lib";
import { usePluginStore } from "@/plugins";
import { DetailKeys } from "@/types";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  DetailViewStoreProvider,
  useDetailView,
  Button,
  SimpleTooltip,
  DetailViewMarker,
  Separator,
} from "@/components";
import { useTranslation } from "@/hooks";
import {
  useDeenruvForm,
  z,
  type UseDeenruvFormReturn,
} from "@/hooks/useDeenruvForm.js";
import type { FieldValues } from "react-hook-form";
import { useServer } from "@/state/server.js";
import { getPermissions } from "@/utils/getPermissions.js";
import { PageBlock } from "@/universal_components/PageBlock.js";
import { LoadingMask } from "@/components/templates/DetailView/_components/LoadingMask.js";

interface DetailViewFormProps<
  FORMKEY extends keyof ModelTypes,
  FORMKEYS extends keyof ModelTypes[FORMKEY],
  Z extends Pick<ModelTypes[FORMKEY], FORMKEYS>,
> {
  key: FORMKEY;
  keys: Array<FORMKEYS>;
  config: {
    [P in keyof Z]?: {
      validate?: (o: Z[P]) => string[] | void;
      initialValue?: Z[P];
    };
  };
  onSubmitted: (
    data: Record<string, unknown>,
    additionalData: Record<string, unknown> | undefined,
  ) => Promise<Record<string, unknown>> | undefined;
  onDeleted?: (
    data: Record<string, unknown>,
    additionalData: Record<string, unknown> | undefined,
  ) => Promise<Record<string, unknown>> | undefined;
}

/**
 * Converts a legacy `createDeenruvForm` config (with `validate` callbacks and
 * `initialValue`) into a Zod schema + defaultValues, suitable for `useDeenruvForm`.
 *
 * For each field in config:
 * - If `validate` exists → `z.any().superRefine()` that calls the old validate fn
 * - If no validate → `z.any()`
 * - `defaultValues` extracted from `initialValue` properties
 */
function configToSchemaAndDefaults(
  config: Record<
    string,
    | { validate?: (v: unknown) => string[] | void; initialValue?: unknown }
    | undefined
  >,
) {
  const shape: Record<string, z.ZodType> = {};
  const defaultValues: Record<string, unknown> = {};

  for (const [key, fieldConfig] of Object.entries(config)) {
    if (!fieldConfig) {
      shape[key] = z.any();
      continue;
    }

    if (fieldConfig.validate) {
      const validateFn = fieldConfig.validate;
      shape[key] = z.any().superRefine((val, ctx) => {
        const errors = validateFn(val);
        if (errors && errors.length > 0) {
          for (const msg of errors) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: msg });
          }
        }
      });
    } else {
      shape[key] = z.any();
    }

    if (fieldConfig.initialValue !== undefined) {
      defaultValues[key] = fieldConfig.initialValue;
    }
  }

  return { schema: z.object(shape), defaultValues };
}

export const createDeenruvForm = <
  FORMKEY extends keyof ModelTypes,
  FORMKEYS extends keyof ModelTypes[FORMKEY],
  Z extends Pick<ModelTypes[FORMKEY], FORMKEYS>,
>({
  key,
  keys,
  config,
  onSubmitted,
  onDeleted,
}: DetailViewFormProps<FORMKEY, FORMKEYS, Z>) => ({
  key,
  keys,
  config,
  onSubmitted,
  onDeleted,
});

interface Permissions {
  create: Permission;
  delete: Permission;
  edit: Permission;
}

interface DetailViewProps<LOCATION extends DetailKeys> {
  id?: string | null;
  locationId: LOCATION;
  main: {
    name: string;
    label: string;
    component: React.ReactNode;
    sidebar?: React.ReactNode;
    form: ReturnType<typeof createDeenruvForm>;
  };
  defaultTabs?: Array<{
    label: string;
    name: string;
    component: React.ReactNode;
    hideSidebar?: boolean;
    sidebarReplacement?: React.ReactNode;
  }>;
  topActions?: {
    texts?: { submitButton?: string; deleteButton?: string };
    inline?: React.ReactNode[];
    dropdown?: React.ReactNode[];
  };
  permissions?: Permissions;
}

export const DetailView = <LOCATION extends DetailKeys>({
  id,
  locationId,
  main,
  defaultTabs = [],
  permissions,
  topActions,
}: DetailViewProps<LOCATION>) => {
  const [searchParams] = useSearchParams();
  const { getDetailViewTabs, getDetailViewActions } = usePluginStore();
  const form = useDeenruvForm(
    configToSchemaAndDefaults(
      main.form.config as Record<
        string,
        | { validate?: (v: unknown) => string[] | void; initialValue?: unknown }
        | undefined
      >,
    ),
  );

  const tab = useMemo(
    () => searchParams.get("tab") || main.name,
    [searchParams],
  );
  const tabs = useMemo(() => {
    return (
      getDetailViewTabs(locationId)?.map(({ component, ...rest }) => ({
        ...rest,
        component: <React.Fragment>{component}</React.Fragment>,
      })) || []
    );
  }, [locationId]);

  const actions = useMemo(() => getDetailViewActions(locationId), [locationId]);
  const permissionsObj = useMemo(
    () =>
      permissions ||
      getPermissions(main.name.charAt(0).toUpperCase() + main.name.slice(1)),
    [permissions],
  );

  const currentSidebar = useMemo(() => {
    const currentTab = [...defaultTabs, ...tabs].find((t) => t.name === tab);
    if (!currentTab) return main.sidebar;
    return currentTab?.hideSidebar
      ? null
      : currentTab?.sidebarReplacement
        ? currentTab.sidebarReplacement
        : main.sidebar;
  }, [defaultTabs, tab, tabs]);

  return (
    <DetailViewStoreProvider
      id={id}
      tab={tab}
      sidebar={currentSidebar}
      locationId={locationId}
      tabs={[main, ...defaultTabs, ...tabs]}
      form={{
        base: form,
        onSubmitted: main.form.onSubmitted,
        onDeleted: main.form.onDeleted,
      }}
    >
      <DetailTabs
        key={tab}
        locationId={locationId}
        topActions={{
          inline: [
            ...(topActions?.inline || []),
            ...(actions?.inline?.map(({ component }) =>
              React.createElement(component),
            ) || []),
          ],
          dropdown: [
            ...(topActions?.dropdown || []),
            ...(actions?.dropdown?.map(({ component }) =>
              React.createElement(component),
            ) || []),
          ],
        }}
        permissions={permissionsObj}
        texts={topActions?.texts}
      />
    </DetailViewStoreProvider>
  );
};

const DetailTabs = ({
  topActions,
  permissions,
  texts,
  locationId,
}: {
  topActions?: { inline?: React.ReactNode[]; dropdown?: React.ReactNode[] };
  permissions: Permissions;
  texts?: { submitButton?: string; deleteButton?: string };
  locationId: DetailKeys;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const {
    entity,
    loading,
    actionHandler,
    setActiveTab,
    tab,
    tabs,
    sidebar,
    setSidebar,
    hasUnsavedChanges,
    form,
  } = useDetailView();

  const [, setSearchParams] = useSearchParams();
  const { id } = useParams();
  const { userPermissions } = useServer();

  const isPermittedToCreate = useMemo(
    () => userPermissions.includes(permissions.create),
    [userPermissions],
  );
  const isPermittedToUpdate = useMemo(
    () => userPermissions.includes(permissions.edit),
    [userPermissions],
  );
  const isPermittedToDelete = useMemo(
    () => userPermissions.includes(permissions.delete),
    [userPermissions],
  );

  const showEditButton = id && isPermittedToUpdate;
  const showCreateButton = !id && isPermittedToCreate;
  const buttonDisabled = !form.base.isFormValid || !hasUnsavedChanges;

  const tabsWithMarker = tabs.map((tab, idx) => (
    <TabsContent key={idx} value={tab.name}>
      <PageBlock
        sidebar={
          sidebar ? (
            <div className="flex flex-col gap-2">
              {sidebar}
              <DetailViewMarker
                position={`${locationId}-sidebar`}
                tab={tab.name}
              />
            </div>
          ) : undefined
        }
      >
        {tab.component ? tab.component : <div>Missing component</div>}
      </PageBlock>
    </TabsContent>
  ));

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => {
        const changingTo = tabs.find((t) => t.name === value);
        if (changingTo?.hideSidebar) setSidebar(null);
        else if (changingTo?.sidebarReplacement)
          setSidebar(changingTo.sidebarReplacement);
        else setSidebar(undefined);
        setActiveTab(value);
        setSearchParams({ tab: value });
      }}
    >
      <div className="sticky top-0 z-[51] w-full items-center justify-start border-b bg-background/95 backdrop-blur">
        <div className="flex w-full items-center justify-between px-4 py-2">
          <div className="flex w-full flex-1 items-center">
            <SimpleTooltip content={t("goBackToList")}>
              <Button
                variant="secondary"
                size="icon"
                className="size-9"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft className="size-4" />
                <span className="sr-only">{t("create.back")}</span>
              </Button>
            </SimpleTooltip>
            <Separator orientation="vertical" className="mx-4 h-7" />
            {tabs.length > 1 && (
              <TabsList className="mb-0 h-10 justify-start gap-1 bg-muted/60 p-1">
                {tabs.map((t, idx) => (
                  <TabsTrigger
                    key={idx}
                    disabled={t.disabled}
                    value={t.name}
                    className={cn(
                      "border border-transparent px-5 py-1.5 data-[state=active]:border-border data-[state=active]:bg-card data-[state=active]:shadow-none",
                      "transition-all duration-200",
                      "data-[state=inactive]:bg-transparent data-[state=inactive]:hover:bg-muted",
                    )}
                  >
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            <div className="flex items-center gap-6">
              {topActions?.inline?.map((action) => action)}
              {showEditButton && (
                <SimpleTooltip
                  content={
                    buttonDisabled
                      ? form.base.isFormValid
                        ? t("noChangesTooltip")
                        : t("buttonDisabledTooltip")
                      : undefined
                  }
                >
                  <Button
                    size="sm"
                    onClick={() => actionHandler("submit")}
                    className="ml-auto justify-self-end"
                    disabled={buttonDisabled}
                  >
                    {t("update")}
                  </Button>
                </SimpleTooltip>
              )}
              {showCreateButton && (
                <SimpleTooltip
                  content={
                    buttonDisabled ? t("buttonDisabledTooltip") : undefined
                  }
                >
                  <Button
                    size="sm"
                    onClick={() => actionHandler("submit")}
                    className="ml-auto justify-self-end"
                    disabled={buttonDisabled}
                  >
                    {texts?.submitButton || t("create")}
                  </Button>
                </SimpleTooltip>
              )}
              {isPermittedToDelete && (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    {...(!id && { className: "invisible" })}
                  >
                    <Button variant="secondary" size="icon" className="size-9">
                      <EllipsisVerticalIcon size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="z-[52] mr-4 min-w-[240px]">
                    {!!topActions?.dropdown?.length && (
                      <>
                        {topActions?.dropdown?.map((action) => action)}
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Button
                        onClick={() => actionHandler("delete")}
                        variant="ghost"
                        className="w-full justify-start gap-2"
                      >
                        <Trash2 size={20} />
                        {texts?.deleteButton || t("actionsMenu.delete")}
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        {loading ? (
          <LoadingMask />
        ) : !entity && !!id ? (
          <div className="flex min-h-[80vh] w-full items-center justify-center">
            {t("toasts.roleLoadingError", { value: id })}
          </div>
        ) : null}
        {tabsWithMarker}
      </div>
    </Tabs>
  );
};
