import { Button, Toggle, ToggleGroupItem } from '@/components/atoms';
import React, { PropsWithChildren } from 'react';

interface EditorButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export const SimpleButton: React.FC<PropsWithChildren<EditorButtonProps>> = ({
    children,
    onClick,
    disabled,
}) => {
    return (
        <Button variant={'outline'} size={'sm'} className="h-8 w-8 p-1" onClick={onClick} disabled={disabled}>
            {children}
        </Button>
    );
};

export const ToggleButton: React.FC<PropsWithChildren<EditorButtonProps>> = ({ children, onClick }) => {
    return (
        <Toggle variant={'outline'} size={'sm'} className="h-8 w-8 p-1" onClick={onClick}>
            {children}
        </Toggle>
    );
};

interface EditorToggleGroupButtonProps {
    value: string;
}

export const ToggleGroupButton: React.FC<PropsWithChildren<EditorToggleGroupButtonProps>> = ({
    children,
    value,
}) => {
    return (
        <ToggleGroupItem variant={'outline'} size={'sm'} className="h-8 w-8 p-1" value={value}>
            {children}
        </ToggleGroupItem>
    );
};
