import React from 'react';

import { usePluginStore } from '@/context/plugin-context';
import { Renderer } from '@/components/core';

export const PlacementMarker = ({ position }: { position: string }) => {
    const { viewMarkers, openDropdown, setOpenDropdown } = usePluginStore();

    return (
        <div>
            {viewMarkers && (
                <div>
                    <button onClick={() => setOpenDropdown(!openDropdown)}>Create placement</button>
                </div>
            )}
            {viewMarkers && openDropdown && (
                <div>
                    <p>Here you can create Yours placement</p>
                </div>
            )}
            <Renderer position={position} />
        </div>
    );
};
