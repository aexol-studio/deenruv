import { useTranslation } from '@deenruv/react-ui-devkit';

export const ModifyHistoryInfo = ({ modificationId }: { modificationId: string }) => {
  const { t } = useTranslation('orders');

  return (
    <div className="flex gap-2 text-sm text-muted-foreground">
      {t('modifyInfo')}: {modificationId}
    </div>
  );
};
