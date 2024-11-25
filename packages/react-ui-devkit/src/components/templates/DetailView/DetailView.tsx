import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { EllipsisVerticalIcon } from 'lucide-react';
import { ModelTypes } from '@deenruv/admin-types';
import { cn } from '@/lib';
import { usePluginStore } from '@/plugins';
import { DetailKeys } from '@/types';
import {
    Button,
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
} from '@/components';
import { GFFLPFormField, useGFFLP } from '@/hooks';

type Event =
    | React.FormEvent<HTMLFormElement>
    | React.MouseEvent<HTMLButtonElement, MouseEvent>
    | React.MouseEvent<HTMLDivElement>;

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
        event: Event,
        data: Partial<{
            [P in keyof Z]: GFFLPFormField<Z[P]>;
        }>,
    ) => void;
    onDeleted?: (
        event: Event,
        data: Partial<{
            [P in keyof Z]: GFFLPFormField<Z[P]>;
        }>,
    ) => void;
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
    defaultTabs: Array<{
        label: string;
        name: string;
        component: React.ReactNode;
        hideSidebar?: boolean;
        sidebarReplacement?: React.ReactNode;
    }>;
}

export const DetailView = <LOCATION extends DetailKeys>({
    id,
    locationId,
    main,
    defaultTabs,
}: DetailViewProps<LOCATION>) => {
    const [searchParams] = useSearchParams();
    const { getDetailViewTabs } = usePluginStore();
    const form = useGFFLP(main.form.key, ...main.form.keys)({});
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

    return (
        <DetailViewStoreProvider
            id={id}
            tab={tab}
            sidebar={main.sidebar}
            locationId={locationId}
            tabs={[main, ...defaultTabs, ...tabs]}
            form={{
                base: form,
                onSubmitted: main.form.onSubmitted,
                onDeleted: main.form.onDeleted,
            }}
        >
            <DetailTabs />
        </DetailViewStoreProvider>
    );
};

const DetailTabs = () => {
    const { tabs, tab, setActiveTab, sidebar, setSidebar, onSubmit, onDelete } = useDetailView(
        'products-detail-view',
        ({ tabs, tab, setActiveTab, sidebar, setSidebar, onSubmit, onDelete }) => ({
            tabs,
            tab,
            setActiveTab,
            sidebar,
            setSidebar,
            onSubmit,
            onDelete,
        }),
        'CreateProductInput',
    );

    const [, setSearchParams] = useSearchParams();
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
            <div className="bg-muted sticky top-0 z-[100] w-full items-center justify-start shadow-xl">
                <div className="flex w-full items-center justify-between px-4 py-2">
                    <div className="flex w-full flex-1">
                        <TabsList className="bg-card z-50 h-12 w-full items-center justify-start gap-4 rounded-none rounded-sm px-4 shadow-xl">
                            {tabs.map((t, idx )=> (
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
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <Button variant="action" onClick={onSubmit} className="ml-auto justify-self-end">
                            Edit product
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="icon">
                                    <EllipsisVerticalIcon />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="z-[101] mr-4">
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={onDelete}>Delete product</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
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
