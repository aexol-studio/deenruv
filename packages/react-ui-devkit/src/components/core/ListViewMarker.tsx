import React, { useMemo } from 'react';

import { usePluginStore } from '@/plugins/plugin-context';
import { ListLocationID } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { CopyIcon, PlugZap } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../atoms/popover.js';
import { Button } from '../atoms/button.js';
import { toast } from 'sonner';

export const ListViewMarker = ({
    column,
    position,
}: {
    column: ColumnDef<any, any>;
    position: ListLocationID;
}) => {
    const { viewMarkers, openDropdown, setOpenDropdown } = usePluginStore();

    const code = `const DeenruvUIPlugin = createPlugin({
    tables: [{
        id: "${position}",
        bulkActions: [],
        columns: [{
            id: "${column.id?.includes('customFields') ? column.id?.replace('_', '.') : column.id}",
        }],
    }],
});`;
    const highlightedCode = code.replace(
        /(id: )([^,]*)/g,
        `$1<span class="text-green-500 font-bold">$2</span>`,
    );
    const copyCode = () => {
        try {
            navigator.clipboard.writeText(code);
            toast.success('Code copied to clipboard');
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };
    if (!viewMarkers || (column.id && ['actions', 'select-id'].includes(column.id))) return null;
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="p-1 h-auto">
                    <PlugZap className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96">
                <p className="max-w-sm text-sm">Create a new component using following code</p>
                <div className="relative p-4 rounded-md bg-card">
                    <pre
                        className="text-xs leading-4 whitespace-pre-wrap text-gray-200"
                        dangerouslySetInnerHTML={{ __html: highlightedCode }}
                    />
                    <Button
                        size="icon"
                        variant="outline"
                        onClick={copyCode}
                        className="absolute top-2 right-2"
                    >
                        <CopyIcon size={16} />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
};
