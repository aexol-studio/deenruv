import React from 'react';
import { Button, ComponentConfig } from '@measured/puck';
import styles from './styles.module.css';
import { Section } from '../Section';
import { getClassNameFactory } from '../../../getClassNameFactory';

const getClassName = getClassNameFactory('ButtonGroup', styles);

export type ButtonGroupProps = {
    align?: string;
    buttons: { label: string; href: string; variant: 'primary' | 'secondary' }[];
};

export const ButtonGroup: ComponentConfig<ButtonGroupProps> = {
    label: 'Button Group',
    fields: {
        buttons: {
            type: 'array',
            getItemSummary: item => item.label || 'Button',
            arrayFields: {
                label: { type: 'text' },
                href: { type: 'text' },
                variant: {
                    type: 'radio',
                    options: [
                        { label: 'primary', value: 'primary' },
                        { label: 'secondary', value: 'secondary' },
                    ],
                },
            },
            defaultItemProps: {
                label: 'Button',
                href: '#',
                variant: 'primary',
            },
        },
        align: {
            type: 'radio',
            options: [
                { label: 'left', value: 'left' },
                { label: 'center', value: 'center' },
            ],
        },
    },
    defaultProps: {
        buttons: [{ label: 'Learn more', href: '#', variant: 'primary' }],
    },
    render: ({ align, buttons, puck }) => {
        return (
            <Section className={getClassName({ center: align === 'center' })}>
                <div className={getClassName('actions')}>
                    {buttons.map((button, i) => (
                        <Button
                            key={i}
                            href={button.href}
                            variant={button.variant}
                            size="large"
                            tabIndex={puck.isEditing ? -1 : undefined}
                        >
                            {button.label}
                        </Button>
                    ))}
                </div>
            </Section>
        );
    },
};
