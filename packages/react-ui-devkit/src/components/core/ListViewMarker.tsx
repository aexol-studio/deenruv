import React from 'react';

import { usePluginStore } from '@/plugins/plugin-context';
import { ListLocationID } from '@/types';

export const ListViewMaker = ({ position }: { position: ListLocationID }) => {
    const { viewMarkers, openDropdown, setOpenDropdown } = usePluginStore();

    return (
        <div>
            {viewMarkers && (
                <div>
                    <button onClick={() => setOpenDropdown(!openDropdown)}>
                        Add content to table view at {position}
                    </button>
                </div>
            )}
            {viewMarkers && openDropdown && (
                <div>
                    <p>Here you can add content to table following this code:</p>
                    <pre>
                        {`
                        const DeenruvUIPlugin = createPlugin({
                            ...,
                            tables: {
                                id: ${position},
                                bulkActions: [],
                                columns: [],
                            },
                            ...
                        });
                        `}
                    </pre>
                </div>
            )}
        </div>
    );
};
