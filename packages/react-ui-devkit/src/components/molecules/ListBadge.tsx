import { Badge, BadgeProps } from '@/components/atoms/badge.js';
import React from 'react';

export const ListBadge = (props: BadgeProps) => {
    return (
        <Badge
            {...props}
            className={`w-fit py-1 flex items-center justify-center whitespace-nowrap rounded-md text-muted-foreground ${props.className}`}
            variant="outline"
        />
    );
};

export default ListBadge;
