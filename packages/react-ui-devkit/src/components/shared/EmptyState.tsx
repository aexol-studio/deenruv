import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, TableCell, TableRow } from './../';
import { CircleOff, SearchX } from 'lucide-react';

interface Props {
    columnsLength: number;
    filtered?: boolean;
    title: string;
    description: string;
}

export const EmptyState: React.FC<Props> = ({ columnsLength, filtered, title, description }) => {
    return (
        <TableRow noHover>
            <TableCell colSpan={columnsLength} className="h-24 text-center">
                <Card className="flex h-full flex-col items-center justify-center p-2">
                    <CardHeader className="flex flex-col items-center">
                        {filtered ? (
                            <SearchX size={30} className="mb-4" />
                        ) : (
                            <CircleOff size={30} className="mb-4" />
                        )}
                        <CardTitle>{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <CardDescription>{description}</CardDescription>
                    </CardContent>
                </Card>
            </TableCell>
        </TableRow>
    );
};
