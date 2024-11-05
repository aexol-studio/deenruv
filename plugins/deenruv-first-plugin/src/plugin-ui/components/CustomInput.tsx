import { Input, Label, useCustomFields, CardDescription } from '@deenruv/react-ui-devkit';
import React from 'react';

export const CustomInput = () => {
    const { setValue, description, label, value } = useCustomFields();

    return (
        <div>
            <Label>{label}</Label>
            <CardDescription>{description}</CardDescription>
            <Input type="number" value={value} onChange={e => setValue(e.target.value)} />
        </div>
    );
};
