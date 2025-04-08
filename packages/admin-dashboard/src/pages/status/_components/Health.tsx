import {
  useTranslation,
  Badge,
  Button,
  CardIcons,
  cn,
  CustomCard,
  Skeleton,
  useServer,
} from '@deenruv/react-ui-devkit';
import { RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const getStatusBadge = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower === 'up' || statusLower === 'ok' || statusLower === 'healthy') {
    return (
      <Badge
        variant="outline"
        className="flex select-none items-center gap-1 border-green-200 bg-green-50 text-green-700"
      >
        <CheckCircle className="size-3.5" />
        {status}
      </Badge>
    );
  } else if (statusLower === 'degraded' || statusLower === 'warning') {
    return (
      <Badge
        variant="outline"
        className="flex select-none items-center gap-1 border-amber-200 bg-amber-50 text-amber-700"
      >
        <AlertCircle className="size-3.5" />
        {status}
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="flex select-none items-center gap-1 border-red-200 bg-red-50 text-red-700">
        <XCircle className="size-3.5" />
        {status}
      </Badge>
    );
  }
};
export const Health = () => {
  const { t } = useTranslation('system');
  const {
    fetchStatus,
    status: { data, lastUpdated, loading },
  } = useServer(({ fetchStatus, status }) => ({ fetchStatus, status }));

  return (
    <CustomCard
      title={t('health.title')}
      {...(lastUpdated && { description: t('health.updated') + '' + lastUpdated.toLocaleTimeString() })}
      color={data.status ? (data.status === 'up' ? 'green' : 'red') : 'gray'}
      icon={<CardIcons.action />}
      upperRight={
        <Button variant="outline" size="sm" onClick={fetchStatus} disabled={loading} className="h-9">
          <RefreshCw className={cn('mr-2 h-4 w-4', loading && 'animate-spin')} />
          {loading ? t('health.refreshing') : t('health.refresh')}
        </Button>
      }
    >
      {loading && !data.status ? (
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
          </div>
        </div>
      ) : data.status ? (
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-medium">{t('health.status')}</h3>
            {getStatusBadge(data.status)}
          </div>

          <div>
            <h3 className="mb-3 text-base font-medium">{t('health.details')}</h3>
            <div className="divide-y rounded-md border">
              {Object.entries(data.details).map(([key, detail], index) => (
                <div
                  key={key}
                  className={cn(
                    'flex items-center justify-between px-4 py-3',
                    index % 2 === 0 ? 'bg-muted/20' : 'bg-background',
                  )}
                >
                  <span className="text-sm font-medium">{key}</span>
                  {getStatusBadge(detail.status)}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <AlertCircle className="text-muted-foreground mb-3 size-10" />
          <h3 className="text-lg font-medium">{t('health.error.title')}</h3>
          <p className="text-muted-foreground mt-1 text-sm">{t('health.error.description')}</p>
          <Button variant="outline" size="sm" onClick={fetchStatus} className="mt-4">
            {t('health.error.button')}
          </Button>
        </div>
      )}
    </CustomCard>
  );
};
