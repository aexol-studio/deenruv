import React from 'react';

import { usePluginStore } from '@/plugins/plugin-context';
import { Renderer } from '@/components/core';
import { DetailLocationID } from '@/types';

export const DetailViewMaker = ({ position }: { position: DetailLocationID }) => {
    const { viewMarkers, openDropdown, setOpenDropdown } = usePluginStore();

    return (
        <div>
            {viewMarkers && (
                <div>
                    <button onClick={() => setOpenDropdown(!openDropdown)}>
                        Create placement in {position}
                    </button>
                </div>
            )}
            {viewMarkers && openDropdown && (
                <div>
                    <p>Here you can create Yours placement following this code:</p>
                    <pre>
                        {`
                        const DeenruvUIPlugin = createPlugin({
                            ...,
                            components: [{
                                id: ${position},
                                component: YourComponent,
                            }],
                            ...
                        });
                        `}
                    </pre>
                </div>
            )}
            <Renderer position={position} />
        </div>
    );
};
