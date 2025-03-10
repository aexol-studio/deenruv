import React, { PropsWithChildren } from 'react';

export const TableLabel: React.FC<PropsWithChildren> = ({ children }) => (
    <span className="whitespace-nowrap text-[13px] capitalize">{children}</span>
);
