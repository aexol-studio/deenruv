import React, { ReactElement, Suspense, lazy } from 'react';
import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { ComponentConfig } from '@measured/puck';
import styles from './styles.module.css';
import { getClassNameFactory } from '../../../getClassNameFactory';

const getClassName = getClassNameFactory('Card', styles);

const icons = Object.keys(dynamicIconImports).reduce<Record<string, ReactElement>>((acc, iconName) => {
    const LucideIcon = lazy(dynamicIconImports[iconName as keyof typeof dynamicIconImports]);

    return {
        ...acc,
        [iconName]: <LucideIcon />,
    };
}, {});

const iconOptions = Object.keys(dynamicIconImports).map(iconName => ({
    label: iconName,
    value: iconName,
}));

export type CardProps = {
    title: string;
    description: string;
    icon?: string;
    mode: 'flat' | 'card';
};

export const Card: ComponentConfig<CardProps> = {
    fields: {
        title: { type: 'text' },
        description: { type: 'textarea' },
        icon: {
            type: 'select',
            options: iconOptions,
        },
        mode: {
            type: 'radio',
            options: [
                { label: 'card', value: 'card' },
                { label: 'flat', value: 'flat' },
            ],
        },
    },
    defaultProps: {
        title: 'Title',
        description: 'Description',
        icon: 'Feather',
        mode: 'flat',
    },
    render: ({ title, icon, description, mode }) => {
        return (
            <div className={getClassName({ [mode]: mode })}>
                <Suspense fallback={<div className={getClassName('icon')}>...</div>}>
                    <div className={getClassName('icon')}>{icon && icons[icon]}</div>
                </Suspense>
                <div className={getClassName('title')}>{title}</div>
                <div className={getClassName('description')}>{description}</div>
            </div>
        );
    },
};
