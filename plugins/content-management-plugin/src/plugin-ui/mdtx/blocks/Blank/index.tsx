import React from 'react';
import { ComponentConfig } from '@measured/puck';
import { getClassNameFactory } from '../../../getClassNameFactory';
import styles from './styles.module.css';

const getClassName = getClassNameFactory('Hero', styles);

export type HeroProps = {};

export const Hero: ComponentConfig<HeroProps> = {
    fields: {},
    defaultProps: {},
    render: () => {
        return <div className={getClassName()}></div>;
    },
};
