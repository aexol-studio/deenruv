import { Button, ScrollArea } from '@/components';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { GraphQLTypes } from '@/zeus';
import React, { PropsWithChildren } from 'react';

export const DefaultListWrapper: React.FC<
    PropsWithChildren<{
        texts: { open: string; add: string };
        field: GraphQLTypes['CustomField'];
        addNewEntry: () => void;
    }>
> = ({ field, texts, children, addNewEntry }) => {
    return (
        <Dialog>
            <div className="flex items-center justify-between p-4">
                <span>{field.name}</span>
                <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                        {texts.open}
                    </Button>
                </DialogTrigger>
            </div>
            <DialogContent>
                <div className="flex flex-col gap-2 p-4">
                    <ScrollArea className="h-96 p-4">{children}</ScrollArea>
                    <Button onClick={addNewEntry} variant="secondary" size="sm">
                        {texts.add}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
