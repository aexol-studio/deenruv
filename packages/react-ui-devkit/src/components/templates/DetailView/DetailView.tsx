import React, { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { EllipsisVerticalIcon } from 'lucide-react';
import { ModelTypes, Permission } from '@deenruv/admin-types';
import { cn } from '@/lib';
import { usePluginStore } from '@/plugins';
import { DetailKeys } from '@/types';
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
} from '@/components';
import { GFFLPFormField, useGFFLP } from '@/hooks';
import { useServer } from '@/state/server.js';
import { useTranslation } from 'react-i18next';
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
        data: Partial<{
            [P in keyof Z]: GFFLPFormField<Z[P]>;
        }>,
    ) => Promise<Record<string, unknown>> | undefined;
    onDeleted?: (
        data: Partial<{
            [P in keyof Z]: GFFLPFormField<Z[P]>;
        }>,
    ) => Promise<Record<string, unknown>> | undefined;
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
    id?: string;
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
    permissions: Permissions;
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
    const form = useGFFLP(main.form.key, ...main.form.keys)(main.form.config);
    const tab = useMemo(() => searchParams.get('tab') || main.name, [searchParams]);
    const tabs = useMemo(() => {
        return (
            getDetailViewTabs(locationId)?.map(({ name, label, component }) => ({
                name,
                label,
                component: <React.Fragment>{component}</React.Fragment>,
            })) || []
        );
    }, [locationId]);

    const actions = useMemo(() => getDetailViewActions(locationId), [locationId]);

    const currentSidebar = useMemo(() => {
        const currentTab = defaultTabs.find(t => t.name === tab);
        return currentTab?.hideSidebar
            ? null
            : currentTab?.sidebarReplacement
              ? currentTab.sidebarReplacement
              : main.sidebar;
    }, [defaultTabs, tab]);

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
                topActions={{
                    inline: [
                        ...(topActions?.inline || []),
                        ...(actions?.inline?.map(({ component }) => React.createElement(component)) || []),
                    ],
                    dropdown: [
                        ...(topActions?.dropdown || []),
                        ...(actions?.dropdown?.map(({ component }) => React.createElement(component)) || []),
                    ],
                }}
                permissions={permissions}
                texts={topActions?.texts}
            />
        </DetailViewStoreProvider>
    );
};

const DetailTabs = ({
    topActions,
    permissions,
    texts,
}: {
    topActions?: { inline?: React.ReactNode[]; dropdown?: React.ReactNode[] };
    permissions: Permissions;
    texts?: { submitButton?: string; deleteButton?: string };
}) => {
    const { t } = useTranslation('common');
    const { actionHandler, setActiveTab, tab, tabs, sidebar, setSidebar, hasUnsavedChanges, form } =
        useDetailView();

    const [, setSearchParams] = useSearchParams();
    const { id } = useParams();
    const { userPermissions } = useServer();

    const isPermittedToCreate = useMemo(
        () => userPermissions.includes(permissions.create),
        [userPermissions],
    );
    const isPermittedToUpdate = useMemo(() => userPermissions.includes(permissions.edit), [userPermissions]);
    const isPermittedToDelete = useMemo(
        () => userPermissions.includes(permissions.delete),
        [userPermissions],
    );

    const showEditButton = id && isPermittedToUpdate;
    const showCreateButton = !id && isPermittedToCreate;

    const buttonDisabled = !form.base.haveValidFields || !hasUnsavedChanges;

    return (
        <Tabs
            value={tab}
            onValueChange={value => {
                const changingTo = tabs.find(t => t.name === value);
                if (changingTo?.hideSidebar) setSidebar(null);
                else if (changingTo?.sidebarReplacement) setSidebar(changingTo.sidebarReplacement);
                else setSidebar(undefined);
                setActiveTab(value);
                setSearchParams({ tab: value });
            }}
        >
            <div className="bg-muted sticky top-0 z-[51] w-full items-center justify-start shadow-xl">
                <div className="flex w-full items-center justify-between px-4 py-2">
                    <div className="flex w-full flex-1">
                        {tabs.length > 1 && (
                            <TabsList className="bg-card z-50 h-12 w-full items-center justify-start gap-4 rounded-sm px-4 shadow-xl">
                                {tabs.map((t, idx) => (
                                    <TabsTrigger
                                        key={idx}
                                        disabled={t.disabled}
                                        value={t.name}
                                        className={cn('px-8', 'data-[state=active]:bg-secondary bg-card')}
                                    >
                                        {t.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <div className="flex gap-6 items-center">
                            {topActions?.inline?.map((action, idx) => action)}
                            {showEditButton && (
                                <SimpleTooltip
                                    content={
                                        buttonDisabled
                                            ? form.base.haveValidFields
                                                ? t('noChangesTooltip')
                                                : t('buttonDisabledTooltip')
                                            : undefined
                                    }
                                >
                                    <Button
                                        variant="action"
                                        onClick={() => actionHandler('submit')}
                                        className="ml-auto justify-self-end"
                                        disabled={buttonDisabled}
                                    >
                                        {t('update')}
                                    </Button>
                                </SimpleTooltip>
                            )}
                            {showCreateButton && (
                                <SimpleTooltip
                                    content={buttonDisabled ? t('buttonDisabledTooltip') : undefined}
                                >
                                    <Button
                                        variant="action"
                                        onClick={() => actionHandler('submit')}
                                        className="ml-auto justify-self-end"
                                        disabled={buttonDisabled}
                                    >
                                        {texts?.submitButton || t('create')}
                                    </Button>
                                </SimpleTooltip>
                            )}
                            {isPermittedToDelete && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild {...(!id && { className: 'invisible' })}>
                                        <Button variant="secondary" size="icon">
                                            <EllipsisVerticalIcon />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="z-[50] mr-4 min-w-[240px]">
                                        {topActions?.dropdown?.map((action, idx) => action)}
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Button
                                                onClick={() => actionHandler('delete')}
                                                variant="ghost"
                                                className="w-full justify-start"
                                            >
                                                {texts?.deleteButton || t('delete')}
                                            </Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="px-4 py-2 md:px-8 md:py-4">
                {tabs.map((tab, idx) => (
                    <TabsContent key={idx} value={tab.name}>
                        <div
                            className={cn(sidebar ? 'grid grid-cols-[minmax(0,1fr)_400px] gap-4' : 'w-full')}
                        >
                            {tab.component ? tab.component : <div>Missing component</div>}
                            {sidebar}
                        </div>
                    </TabsContent>
                ))}
            </div>
        </Tabs>
    );
};
