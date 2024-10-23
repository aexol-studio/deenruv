import { Input, Label, useCustomFields, CardDescription } from '@deenruv/react-ui-devkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const CustomInput = () => {
    const props = useCustomFields();

    return (
        <div>
            <Label>{props.label}</Label>
            <CardDescription>{props.description}</CardDescription>
            <Input type="number" onChange={e => props.setValue(e.target.value)} />
        </div>
    );
};
