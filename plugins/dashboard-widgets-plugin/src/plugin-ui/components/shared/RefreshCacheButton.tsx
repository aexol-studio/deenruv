import { Button, cn } from '@deenruv/react-ui-devkit';
import { RefreshCcw } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface RefreshCacheButtonProps {
    fetchData: () => void;
    lastCacheRefreshTime?: string;
    className?: string;
}

export const RefreshCacheButton: React.FC<RefreshCacheButtonProps> = ({
    fetchData,
    lastCacheRefreshTime,
    className,
}) => {
    const { t } = useTranslation('dashboard-widgets-plugin', {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    return (
        <div className={cn('flex items-center gap-2', className)}>
            <span className="text-muted-foreground text-xs">
                <span className="text-muted-foreground">
                    {t('lastRefresh')}
                    {lastCacheRefreshTime
                        ? lastCacheRefreshTime.replace('T', ' ').replace('Z', '').split('.')[0]
                        : '—'}
                </span>
            </span>
            <Button
                variant="outline"
                size="icon"
                className="text-muted-foreground size-auto p-1"
                onClick={fetchData}
            >
                <RefreshCcw size={16} />
            </Button>
        </div>
    );
};
