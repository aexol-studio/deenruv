import { Construction } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui';

interface Props {
    title: string;
    text: string;
}

export const UnderMaintenance: React.FC<Props> = ({ title, text }) => {
    return (
        <Card className="absolute left-[50%] top-[50%] flex translate-x-[-50%] translate-y-[-50%] flex-col items-center justify-center p-24 text-center">
            <CardHeader className="flex flex-col items-center">
                <Construction size={144} className="mb-4" />
                <CardTitle className="text-3xl">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription className="text-xl">{text}</CardDescription>
            </CardContent>
        </Card>
    );
};
