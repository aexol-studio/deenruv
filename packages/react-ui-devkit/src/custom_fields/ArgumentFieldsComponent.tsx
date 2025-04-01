import React, { useEffect, useState } from 'react';
import { Field as BaseField } from './context.js';
import { usePluginStore } from '@/plugins/plugin-context.js';
import { generateInputComponents } from './logic.js';
import { InputFieldComponent } from './InputFieldComponent.js';

type Field = Omit<BaseField, 'label' | 'description'> & {
    label?: string | null;
    description?: string | null;
};

export const ArgumentFieldsComponent = ({
    actions = [],
    args,
    setArg,
    additionalData,
    disabled,
}: {
    actions?: Array<{ code: string; args: Array<Field>; description: string }>;
    args: Array<{ name: string; value: string }>;
    setArg: (argument: Field, data: { name: string; value: string }) => void;
    additionalData?: Record<string, unknown>;
    disabled?: boolean;
}) => {
    const { getInputComponent } = usePluginStore();
    const [rendered, setRendered] = useState<
        Record<
            string,
            Record<string, { name: string; component: React.ReactElement; ui?: Record<string, unknown> }[]>
        >
    >({});

    useEffect(() => {
        if (!args.length || !actions.length) return;
        let result: Record<
            string,
            Record<string, { name: string; component: React.ReactElement; ui?: Record<string, unknown> }[]>
        > = {};
        for (const arg of args) {
            const action = actions.find(a => a.args.some(ar => ar.name === arg.name));
            const argument = action?.args.find(ar => ar.name === arg.name);
            if (!action || !argument) continue;
            const components = generateInputComponents(
                [
                    {
                        ...argument,
                        label: [{ languageCode: 'en', value: argument.label || '' }],
                        description: [{ languageCode: 'en', value: argument.description || '' }],
                    },
                ],
                getInputComponent,
            );
            if (!result[action.code]) result[action.code] = {};
            result[action.code][arg.name] = components.filter(c => c.name === arg.name);
        }
        setRendered(result);
        return () => {
            setRendered({});
        };
    }, [args.length, actions.length]);

    return Object.entries(rendered).map(([actionCode, fields]) => {
        const action = actions.find(a => a.code === actionCode);
        if (!action) return null;
        return (
            <div key={action.code} className="flex flex-col gap-3">
                <h4 className="text-lg">{action.description}</h4>
                {Object.entries(fields).map(([argName, components]) => {
                    const arg = args.find(a => a.name === argName);
                    const field = action.args.find(a => a.name === argName);
                    if (!arg || !field) return null;
                    return (
                        <div key={argName}>
                            {components.map(({ component }, i) => {
                                let value = '';
                                try {
                                    value = JSON.parse(arg.value);
                                } catch {
                                    console.error('Error parsing value');
                                }
                                const setValue = (data: unknown) => {
                                    try {
                                        const value = JSON.stringify(data);
                                        setArg(field, { name: argName, value });
                                    } catch {
                                        console.error('Error setting value');
                                    }
                                };
                                const label = [
                                    { languageCode: 'en', value: field.label || field.name || '' },
                                ];
                                const description = [{ languageCode: 'en', value: field.description || '' }];

                                return (
                                    <InputFieldComponent
                                        key={field.name}
                                        field={{ ...field, label, description, component }}
                                        value={value}
                                        setValue={setValue}
                                        additionalData={additionalData}
                                        disabled={disabled}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    });
};
