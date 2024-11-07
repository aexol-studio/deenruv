import React from 'react';
import { useTranslation } from 'react-i18next';
import { translationNS } from '../translation-ns';

export const TestComponent = () => {
    const { t } = useTranslation(translationNS);
    return (
        <div>
            <div>Some Test Component</div>
            <div>{t('nav.link')}</div>
        </div>
    );
};
