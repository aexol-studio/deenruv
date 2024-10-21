import { useCustomFields } from '@deenruv/react-ui-devkit';
import React from 'react';

export const CustomInput = () => {
    const props = useCustomFields();
    console.log('PROPS', props);
    return (
        <div>
            <input type="text" onChange={e => props.setValue(e.target.value)} />
        </div>
    );
};
