import { Input, Label, useCustomFields, CardDescription } from '@deenruv/react-ui-devkit';
import React from 'react';

export const CustomInput = () => {
    const { setValue, description, label, value } = useCustomFields();

    return (
        <div>
            This is custom input field for custom fields
            <Label>{label}</Label>
            <CardDescription>{description}</CardDescription>
            <Input value={value} onChange={e => setValue(e.target.value)} />
        </div>
    );
};
