import React, { useEffect, useState } from 'react';
import { ValueTypes, Chain, CMSModelTypes } from './zeus';
import { Config, Data } from '@measured/puck';
import { Columns } from './blocks/Columns';

type Selector = {
    [key: string]: boolean | Selector;
};

function parseSelectorString(selectorString: string): Selector {
    const fieldLines = selectorString.split(/\s+/);
    const stack: Array<Selector> = [{}];
    const pathStack: string[] = [];

    fieldLines.forEach(line => {
        if (line === '_id') return;
        if (line.endsWith('{')) {
            const key = line.slice(0, -1);
            const currentObj = stack[stack.length - 1];
            currentObj[key] = {};
            stack.push(currentObj[key] as Selector);
            pathStack.push(key);
        } else if (line === '}') {
            stack.pop();
            pathStack.pop();
        } else {
            const currentObj = stack[stack.length - 1];
            currentObj[line] = true;
        }
    });

    return stack[0];
}

const chain = Chain('http://localhost:4200/api/graphql', {
    headers: {
        'Content-Type': 'application/json',
        mdtx_token: 'eyJ1c2VybmFtZSI6ImFleG9sIiwicGFzc3dvcmQiOiJwYW55In0=',
    },
});

const fetchPage = async <T extends keyof typeof CMSModelTypes>(
    model: T,
    _selector?: [{ slug: string }, Selector],
) => {
    type HelpingType = ValueTypes['Query'][`one${typeof model}BySlug`];
    const key = `one${model}BySlug` as const;
    const selector = { [key]: _selector } as Record<typeof key, HelpingType>;
    const { [key]: genericReturn } = await chain('query')(selector);
    return genericReturn;
};

const fetchFields = async <T extends keyof typeof CMSModelTypes>(model: T) => {
    type HelpingType = ValueTypes['Query'][`fieldSet${typeof model}`];
    const key = `fieldSet${model}` as const;
    const selector = { [key]: true } as Record<typeof key, HelpingType>;
    const { [key]: genericReturn } = await chain('query')(selector);
    return genericReturn;
};

const convertPuckToMDTX = (data: Data) => {
    const content = data.content.reduce((acc, { type, props }) => {
        let value = null;
        if (props.children) {
            if (typeof props.children === 'object') {
                try {
                    value = JSON.parse(JSON.stringify(props.children));
                } catch (e) {
                    console.error(e);
                }
            } else value = props.children;
        }
        return { ...acc, [type]: value };
    }, {});

    const layout = Object.entries(data.zones || {}).reduce((acc, [zone, components]) => {
        return components.reduce((acc, { type, props }) => {
            let value = null;
            if (props.children) {
                if (typeof props.children === 'object') {
                    try {
                        value = JSON.parse(JSON.stringify(props.children));
                    } catch (e) {
                        console.error(e);
                    }
                } else value = props.children;
            }
            return { ...acc, [`${zone}:${type}`]: value };
        }, acc);
    }, {});
    return { content, layout };
};

export const useMDTX = <T extends keyof typeof CMSModelTypes>({
    slug,
    model,
}: {
    slug: string;
    model: T;
}) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Data>({ content: [], root: {}, zones: {} });
    const [config, setConfig] = useState<Config>({
        categories: {
            layout: { components: ['Columns'] },
        },
        components: {
            Columns,
        },
    });

    const initialize = async () => {
        if (!slug) return;
        setLoading(true);
        const _fields = (await fetchFields(model)) as string;
        const selector = parseSelectorString(_fields);
        const result = await fetchPage(model, [{ slug }, selector]);
        if (!result) {
            setLoading(false);
            return;
        }
        const keys = Object.keys(result);
        const config = keys.reduce(
            (acc, key) => {
                return {
                    ...acc,
                    components: {
                        ...acc.components,
                        [key]: {
                            fields: { children: { type: 'text' } },
                            render: ({ children }) => (
                                <div>
                                    {typeof children === 'object' ? JSON.stringify(children) : children}
                                </div>
                            ),
                        },
                    },
                };
            },
            {} as {
                components: Record<string, { render: ({ children }: { children: any }) => JSX.Element }>;
            },
        );

        setData(prev => ({
            ...prev,
            root: { title: model, props: { title: model } },
            zones: keys.reduce((acc, type) => {
                return {
                    ...acc,
                    [`Columns-b9bdcd29-54f3-4b54-a15a-0b29346d267f:column-0`]: [
                        { props: { id: `title-232`, children: (result as any)[type] }, type: 'title' },
                    ],
                    [`Columns-b9bdcd29-54f3-4b54-a15a-0b29346d267f:column-1`]: [
                        { props: { id: `title-322`, children: (result as any)[type] }, type: 'title' },
                    ],
                };
            }, {}),
            content: [
                {
                    type: 'Columns',
                    props: {
                        distribution: 'auto',
                        columns: [{}, {}],
                        id: 'Columns-b9bdcd29-54f3-4b54-a15a-0b29346d267f',
                    },
                },
                ...keys.map(type => {
                    const uuid = Math.random().toString(36).substring(7);
                    return { type, props: { id: `${type}-${uuid}`, children: (result as any)[type] } };
                }),
            ],
        }));
        setConfig(prev => ({
            ...prev,
            components: { ...prev.components, ...config.components },
        }));
        setLoading(false);
    };

    useEffect(() => {
        initialize();
    }, [slug]);

    const onPublish = async (data: Data) => {
        const { content, layout } = convertPuckToMDTX(data);
        const key = `upsert${model}` as const;
        console.log('Layout', layout); // we need to save layout as well
        return;
        const { admin } = await chain('mutation')({
            admin: { [key]: [{ slug, [model]: { slug, ...content } }, true] },
        });
        const result = admin ? admin[key] : null;
        if (!result) return;
        return result;
    };

    return { loading, data, config, onPublish };
};
