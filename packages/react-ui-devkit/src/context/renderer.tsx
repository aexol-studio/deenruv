import React, { useState, useEffect } from 'react';

import { usePluginStore } from './plugin-context';

export const Renderer: React.FC<{ position: string }> = ({ position }) => {
    const { store } = usePluginStore();
    const [components, setComponents] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const stored = store?.getComponents(position);
        const storedComponents = stored?.map((component, index) => (
            <React.Fragment key={index}>{React.createElement(component)}</React.Fragment>
        ));
        setComponents(storedComponents || []);
        return () => {
            setComponents([]);
        };
    }, []);

    return <>{components}</>;
};
