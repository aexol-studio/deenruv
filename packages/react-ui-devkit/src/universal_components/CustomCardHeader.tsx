import { CardDescription, CardHeader, CardTitle } from '@/components/atoms/card.js';
import { cn } from '@/lib/utils.js';
import React, { PropsWithChildren, ReactNode } from 'react';

interface OrderCardTitleProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    isCollapsed?: boolean;
    fullWidth?: boolean;
}

/**
 * A default Deenruv card header component. In most cases it shouldn't be user separately.
 * @param {ReactNode} [icon] - An optional icon displayed alongside the title.
 * @param {string} title - The title of the card.
 * @param {string} [description] - An optional description displayed below the title.
 * @param {boolean} [isCollapsed] - If true, the description is truncated.
 * @param {boolean} [fullWidth] - If true, sets the wrapper to full width.
 * @param {ReactNode} children - An optional element positioned in the upper-right corner.
 */
export const CustomCardHeader: React.FC<PropsWithChildren<OrderCardTitleProps>> = ({
    children,
    icon,
    description,
    title,
    isCollapsed,
    fullWidth,
}) => (
    <CardHeader className={cn(!fullWidth && 'w-[90%] flex-1')}>
        <div className="flex items-center justify-between w-full">
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
