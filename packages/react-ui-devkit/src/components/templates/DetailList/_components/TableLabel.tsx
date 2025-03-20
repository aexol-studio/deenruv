import React, { PropsWithChildren } from 'react';

export const TABLE_LABEL_STYLES = 'whitespace-nowrap text-[13px] text-accent-foreground font-semibold';

export const TableLabel: React.FC<PropsWithChildren> = ({ children }) => (
    <span className={TABLE_LABEL_STYLES}>{children}</span>
);
