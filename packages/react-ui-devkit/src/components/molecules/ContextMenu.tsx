import { Button } from '@/components/atoms/button.js';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu.js';
import { EllipsisVertical } from 'lucide-react';
import React, { PropsWithChildren } from 'react';

export const ContextMenu: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} className="h-8 w-8 p-0">
                    <EllipsisVertical size={20} className="cursor-pointer" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="bottom" align="end">
                <DropdownMenuGroup>{children}</DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
