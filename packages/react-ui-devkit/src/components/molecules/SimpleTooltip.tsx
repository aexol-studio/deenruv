import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/atoms/tooltip.js';
import React, { PropsWithChildren } from 'react';

interface SimpleTooltipProps {
    content?: string;
}

export const SimpleTooltip: React.FC<PropsWithChildren<SimpleTooltipProps>> = ({ children, content }) => {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span tabIndex={0}>{children}</span>
            </TooltipTrigger>
            {content && <TooltipContent>{content}</TooltipContent>}
        </Tooltip>
    );
};
