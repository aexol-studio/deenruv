import { Input, Label, useCustomFields } from '@deenruv/react-ui-devkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const CustomInput = () => {
    const props = useCustomFields();
    const {
        i18n: { language },
    } = useTranslation();
    return (
        <div className="text-red">
            <Label>{props.field?.label?.find(el => el.languageCode === language)?.value}</Label>
            <Input type="text" onChange={e => props.setValue(e.target.value)} />
        </div>
    );
};
