import { Card, CardContent } from '@/components/atoms/card.js';
import { CustomCardHeader } from '@/components/molecules';
import { cn } from '@/lib/utils.js';
import React, { cloneElement, PropsWithChildren, ReactElement, ReactNode } from 'react';

type TailwindColor =
    | 'slate'
    | 'gray'
    | 'zinc'
    | 'neutral'
    | 'stone'
    | 'red'
    | 'orange'
    | 'amber'
    | 'yellow'
    | 'lime'
    | 'green'
    | 'emerald'
    | 'teal'
    | 'cyan'
    | 'sky'
    | 'blue'
    | 'indigo'
    | 'violet'
    | 'purple'
    | 'fuchsia'
    | 'pink'
    | 'rose';

interface OrderCardTitleProps {
    icon?: ReactNode;
    title: string;
    description?: string;
    upperRight?: ReactNode;
    color?: TailwindColor;
}

export const CustomCard: React.FC<PropsWithChildren<OrderCardTitleProps>> = ({
    children,
    icon,
    description,
    title,
    upperRight,
    color,
}) => {
    const textColor = color ? `text-${color}-500 dark:text-${color}-400` : '';
    const borderColor = color ? `border-l-4 border-l-${color}-500 dark:border-l-${color}-400` : '';
    const baseClasses = 'h-5 w-5';

    const iconWithClassName =
        icon && typeof icon === 'object' && 'type' in icon
            ? cloneElement(icon as ReactElement, {
                  className: `${baseClasses} ${textColor}`,
              })
            : icon;

    return (
        <Card className={cn('shadow-sm transition-shadow duration-200 hover:shadow', borderColor)}>
            <CustomCardHeader {...{ description, title }} icon={iconWithClassName}>
                {upperRight}
            </CustomCardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
};
