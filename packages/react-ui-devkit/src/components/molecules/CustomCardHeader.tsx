import { CardDescription, CardHeader, CardTitle } from '@/components/atoms/card.js';
import React, { PropsWithChildren, ReactNode } from 'react';

interface OrderCardTitleProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    isCollapsed?: boolean;
}

export const CustomCardHeader: React.FC<PropsWithChildren<OrderCardTitleProps>> = ({
    children,
    icon,
    description,
    title,
    isCollapsed,
}) => (
    <CardHeader className="w-[90%] flex-1">
        <div className="flex items-start justify-between w-full">
            <div className="flex items-center gap-4 min-w-0 flex-1">
                {icon && <span className="flex-shrink-0">{icon}</span>}
                <div className="text-start min-w-0 flex-1">
                    <CardTitle className="text-lg">{title}</CardTitle>
                    {description && (
                        <CardDescription
                            className={`mt-1 ${isCollapsed ? 'truncate overflow-hidden text-ellipsis whitespace-nowrap w-[95%]' : ''}`}
                        >
                            {description}
                        </CardDescription>
                    )}
                </div>
            </div>
            <div className="flex-shrink-0">{children}</div>
        </div>
    </CardHeader>
);
