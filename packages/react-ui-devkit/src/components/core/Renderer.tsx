import React, { useState, useEffect } from 'react';

import { usePluginStore } from '@/plugins/plugin-context';
import { DetailLocationID } from '@/types';

export const Renderer: React.FC<{ position: DetailLocationID }> = ({ position }) => {
    const { getComponents } = usePluginStore();
    const [components, setComponents] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const stored = getComponents(position);
        setComponents(
            stored.map((component, index) => (
                <React.Fragment key={index}>{React.createElement(component)}</React.Fragment>
            )),
        );
        return () => {
            setComponents([]);
        };
    }, []);

    return <>{components}</>;
};
