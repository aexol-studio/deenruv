import { Button } from '@/components';
import React, { PropsWithChildren } from 'react';

export const DefaultListLineWrapper: React.FC<
    PropsWithChildren<{ removeText: string; removeEntry: () => void }>
> = ({ children, removeText, removeEntry }) => {
    return (
        <div>
            {children}
            <Button onClick={removeEntry} variant="destructive" size="sm">
                {removeText}
            </Button>
        </div>
    );
};
