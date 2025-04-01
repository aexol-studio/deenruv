import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, TableCell, TableRow } from '..';
import { CircleOff, SearchX } from 'lucide-react';
import { cn } from '@/lib/utils.js';
import { TailwindColor } from '@/universal_components/CustomCard.js';

interface Props {
    columnsLength: number;
    filtered?: boolean;
    title: string;
    description?: string;
    icon?: ReactNode;
    color?: TailwindColor;
    small?: true;
}

/**
 * This component is used to show messages when there are no elements in a table.
 * @param {ReactNode} [icon] - An optional icon displayed above the title.
 * @param {string} title - The title of the card.
 * @param {number} columnsLength - Necessary for full width display inside tables.
 * @param {string} [description] - An optional description displayed below the title.
 * @param {boolean} [filtered] - Used to show different icon and texts when empty state is due to filtering.
 * @param {TailwindColor} [color] - The color theme of the icon.
 * @param {boolean} [small] - If true, some different styles are applied to make the component smaller.
 */
export const EmptyState: React.FC<Props> = ({
    columnsLength,
    filtered,
    title,
    description,
    icon,
    color,
    small,
}) => {
    const iconWrapperColorClass = `bg-${color}-100 dark:bg-${color}-900/30`;
    const iconColorClass = `text-${color}-500 dark:text-${color}-400`;
    const _icon = icon ? (
        React.isValidElement<{ className?: string }>(icon) ? (
            React.cloneElement(icon, {
                className: cn(icon.props.className, 'h-6 w-6', color ? iconColorClass : ''),
            })
        ) : (
            icon
        )
    ) : (
        <CircleOff className={cn('h-6 w-6', color ? iconColorClass : '')} />
    );

    return (
        <TableRow noHover>
            <TableCell colSpan={columnsLength} className="h-24 text-center">
                <Card
                    className={cn(
                        'flex h-full flex-col items-center justify-center p-2',
                        small && 'border-0 shadow-none p-0',
                    )}
                >
                    <CardHeader className="flex flex-col items-center">
                        {filtered ? (
                            <div className={cn('mb-3 rounded-full p-3', color ? iconWrapperColorClass : '')}>
                                <SearchX className={cn('h-6 w-6', color ? iconColorClass : '')} />
                            </div>
                        ) : (
                            <div className={cn('mb-3 rounded-full p-3', color ? iconWrapperColorClass : '')}>
                                {_icon}
                            </div>
                        )}
                        <CardTitle {...(small && { className: 'text-base' })}>{title}</CardTitle>
                    </CardHeader>
                    {description && (
                        <CardContent>
                            <CardDescription {...(small && { className: 'text-sm' })}>
                                {description}
                            </CardDescription>
                        </CardContent>
                    )}
                </Card>
            </TableCell>
        </TableRow>
    );
};
