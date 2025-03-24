import { CardDescription, CardHeader, CardTitle } from '@/components/atoms/card.js';
import React, { PropsWithChildren, ReactNode } from 'react';

interface OrderCardTitleProps {
    icon?: ReactNode;
    title: string;
    description?: string;
}

export const CustomCardHeader: React.FC<PropsWithChildren<OrderCardTitleProps>> = ({
    children,
    icon,
    description,
    title,
}) => (
    <CardHeader>
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
                {icon && <span className="flex-1">{icon}</span>}
                <div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    {description && <CardDescription className="mt-1">{description}</CardDescription>}
                </div>
            </div>
            {children}
        </div>
    </CardHeader>
);
