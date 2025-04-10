import { useTranslation } from '@deenruv/react-ui-devkit';

export const ModifyHistoryInfo = ({ modificationId }: { modificationId: string }) => {
  const { t } = useTranslation('orders');

  return (
    <div className="text-muted-foreground flex gap-2 text-sm">
      {t('modifyInfo')}: {modificationId}
    </div>
  );
};
