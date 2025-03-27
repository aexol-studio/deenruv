import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/atoms/accordion.js';
import { Card, CardContent, CardFooter } from '@/components/atoms/card.js';
import { CustomCardHeader } from '@/components/molecules';
import { cn } from '@/lib/utils.js';
import React, { cloneElement, PropsWithChildren, ReactElement, ReactNode, useState } from 'react';

export type TailwindColor =
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
    bottomRight?: ReactNode;
    color?: TailwindColor;
    wrapperClassName?: string;
    collapsed?: boolean;
    notCollapsible?: boolean;
}

export const CustomCard: React.FC<PropsWithChildren<OrderCardTitleProps>> = ({
    children,
    icon,
    description,
    title,
    upperRight,
    bottomRight,
    color,
    wrapperClassName,
    collapsed,
    notCollapsible,
}) => {
    const textColor = color ? `text-${color}-500 dark:text-${color}-400` : '';
    const borderColor = color ? `border-l-4 border-l-${color}-500 dark:border-l-${color}-400` : '';
    const baseClasses = 'h-5 w-5';
    const defaultOpen = collapsed ? undefined : title;

    const iconWithClassName =
        icon && typeof icon === 'object' && 'type' in icon
            ? cloneElement(icon as ReactElement, {
                  className: `${baseClasses} ${textColor}`,
              })
            : icon;

    const [openItem, setOpenItem] = useState(defaultOpen);
    const HeaderJSX = (
        <CustomCardHeader
            {...{ description, title }}
            icon={iconWithClassName}
            isCollapsed={!openItem}
            fullWidth={notCollapsible}
        >
            <div onClick={e => e.stopPropagation()} className="cursor-auto hover:no-underline">
                {upperRight}
            </div>
        </CustomCardHeader>
    );

    return (
        <Accordion
            type="single"
            collapsible
            className={cn('w-full', wrapperClassName)}
            defaultValue={defaultOpen}
            onValueChange={setOpenItem}
        >
            <AccordionItem value={title} className="h-full">
                <Card
                    className={cn(
                        'shadow-sm transition-shadow duration-200 hover:shadow h-full',
                        borderColor,
                    )}
                >
                    {notCollapsible ? (
                        HeaderJSX
                    ) : (
                        <AccordionTrigger className={cn('p-0 pr-6 w-full')}>{HeaderJSX}</AccordionTrigger>
                    )}
                    <AccordionContent>
                        <div>
                            <CardContent>{children}</CardContent>
                            {bottomRight && (
                                <CardFooter className="justify-end pb-2">{bottomRight}</CardFooter>
                            )}
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
        </Accordion>
    );
};
