import React from 'react';
import { useTranslation } from 'react-i18next';
import { translationNS } from './translation-ns';

export const LocaleTest = () => {
    const { t } = useTranslation(translationNS);

    return (
        <div>
            <h1 className="text-3xl mb-2">{t('heading')}</h1>
            <p>{t('text')}</p>
        </div>
    );
};
