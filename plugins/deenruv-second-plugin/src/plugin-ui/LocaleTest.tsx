import React from 'react';
import { useTranslation } from 'react-i18next';
import { translationNs } from '.';

export const LocaleTest = () => {
    const { t } = useTranslation(translationNs);

    return (
        <div>
            <h1 className="text-3xl mb-2">{t('heading')}</h1>
            <p>{t('text')}</p>
        </div>
    );
};
