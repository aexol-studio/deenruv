import React from 'react';
import { BarChart3 } from 'lucide-react';

interface Props {
    text?: string;
}

export const EmptyData: React.FC<Props> = ({ text }) => {
    return (
        <div className="flex h-full flex-col items-center justify-center p-6">
            <div className="flex flex-col items-center">
                <BarChart3 size={48} className="mb-4" />
            </div>
            <div className="text-lg">{text}</div>
        </div>
    );
};
