import { EnabledCard } from '@/pages/promotions/_components/EnabledCard';
import { PromotionQuery } from '@/pages/promotions/_components/PromotionDetailView';
import { useDetailView, useQuery } from '@deenruv/react-ui-devkit';
import { useEffect } from 'react';

export const PromotionDetailSidebar = () => {
  const { id, form } = useDetailView('promotions-detail-view', 'CreatePromotionInput', 'enabled');
  const { base } = form;
  const enabledValue = base.watch('enabled');

  // Always call useQuery unconditionally to preserve hook order.
  // Pass a placeholder id when none exists; the result will simply be ignored.
  const { data } = useQuery(PromotionQuery, { initialVariables: { id: id ?? '' } });

  useEffect(() => {
    if (id && data?.promotion) {
      base.setField('enabled', data.promotion.enabled);
    }
  }, [data, id]);

  return (
    <div className="flex w-full flex-col gap-4">
      <EnabledCard
        enabledValue={id ? enabledValue : (enabledValue ?? true)}
        onEnabledChange={(e) => base.setField('enabled', e)}
      />
    </div>
  );
};
