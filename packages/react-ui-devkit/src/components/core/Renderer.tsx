import React, { useState, useEffect } from 'react';

import { usePluginStore } from '@/context/plugin-context';

export const Renderer: React.FC<{ position: string }> = ({ position }) => {
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
