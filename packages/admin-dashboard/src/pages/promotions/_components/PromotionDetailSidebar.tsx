import { EnabledCard } from '@/pages/promotions/_components/EnabledCard';
import { PromotionQuery } from '@/pages/promotions/_components/PromotionDetailView';
import { useDetailView, useQuery } from '@deenruv/react-ui-devkit';
import { useEffect } from 'react';

export const PromotionDetailSidebar = () => {
  const { id, form } = useDetailView('promotions-detail-view', 'CreatePromotionInput', 'enabled');
  const {
    base: { state, setField },
  } = form;

  const { data } = id ? useQuery(PromotionQuery, { initialVariables: { id } }) : { data: undefined };

  useEffect(() => {
    if (data) setField('enabled', data.promotion!.enabled);
  }, [data]);

  return (
    <div className="flex w-full flex-col gap-4">
      <EnabledCard enabledValue={state.enabled?.value} onEnabledChange={(e) => setField('enabled', e)} />
    </div>
  );
};
