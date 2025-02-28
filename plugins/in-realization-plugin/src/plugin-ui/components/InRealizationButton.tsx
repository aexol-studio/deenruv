import { Button, useLazyQuery, useOrder } from '@deenruv/react-ui-devkit';
import { NotepadText } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { translationNS } from '../translation-ns.js';
import { GET_REALIZATION } from '../graphql/queries.js';

export const InRealizationButton = () => {
    const [getRealizationURL, { data }] = useLazyQuery(GET_REALIZATION);
    const { t } = useTranslation(translationNS, {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    const { order, currentPossibilities, setManualChange } = useOrder();
    const needRealization = useMemo(() => {
        if (!currentPossibilities || !order) return false;
        if (currentPossibilities.to.includes('InRealization')) return true;
        return false;
    }, [currentPossibilities, order]);
    useEffect(() => {
        if (!needRealization && order) getRealizationURL({ orderID: order.id });
    }, [needRealization, order]);

    return needRealization ? (
        <Button
            variant="secondary"
            className="flex gap-2"
            onClick={() => setManualChange({ state: true, toAction: 'InRealization' })}
        >
            <NotepadText size={20} /> {t('createRealization')}
        </Button>
    ) : data?.getRealizationURL ? (
        <Button
            variant="outline"
            className="flex gap-2"
            onClick={() => {
                if (!data?.getRealizationURL) return;
                window.open(data.getRealizationURL, '_blank');
            }}
        >
            <NotepadText size={20} /> {t('seeRealization')}
        </Button>
    ) : null;
};
