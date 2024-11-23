import { Button } from '@deenruv/react-ui-devkit';
import { RefreshCcw } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface RefreshCacheButtonProps {
    fetchData: () => void;
    lastCacheRefreshTime?: string;
}

export const RefreshCacheButton: React.FC<RefreshCacheButtonProps> = ({
    fetchData,
    lastCacheRefreshTime,
}) => {
    const { t } = useTranslation('dashboard-widgets-plugin');
    return (
        <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">
                <span className="text-muted-foreground">
                    {t('lastRefresh')}
                    {lastCacheRefreshTime
                        ? lastCacheRefreshTime.replace('T', ' ').replace('Z', '').split('.')[0]
                        : '-'}
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
