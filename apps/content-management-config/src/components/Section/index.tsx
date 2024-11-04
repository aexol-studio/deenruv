import React, { CSSProperties, ReactNode } from 'react';
import { getClassNameFactory } from '../../getClassNameFactory';
import styles from './styles.module.css';

const getClassName = getClassNameFactory('Section', styles);

export type SectionProps = {
    className?: string;
    children: ReactNode;
    padding?: string;
    maxWidth?: string;
    style?: CSSProperties;
};

export const Section = ({
    children,
    className,
    padding = '0px',
    maxWidth = '1280px',
    style = {},
}: SectionProps) => {
    return (
        <div
            className={`${getClassName()}${className ? ` ${className}` : ''}`}
            style={{
                ...style,
                paddingTop: padding,
                paddingBottom: padding,
            }}
        >
            <div className={getClassName('inner')} style={{ maxWidth }}>
                {children}
            </div>
        </div>
    );
};
