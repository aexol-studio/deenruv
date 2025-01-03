import { EnabledCard } from '@/pages/promotions/_components/EnabledCard';
import { PromotionQuery } from '@/pages/promotions/_components/PromotionDetailView';
import { useDetailView, useQuery } from '@deenruv/react-ui-devkit';
import { useEffect } from 'react';

export const PromotionDetailSidebar = () => {
  const { id, view, form } = useDetailView(
    'promotions-detail-view',
    ({ contentLanguage, setContentLanguage, view, form, id }) => ({
      contentLanguage,
      setContentLanguage,
      view,
      form,
      id,
    }),
    'CreatePromotionInput',
    'enabled',
  );
  const {
    base: { state, setField },
  } = form;

  const { data } = id ? useQuery(PromotionQuery, { initialVariables: { id } }) : { data: undefined };

  useEffect(() => {
    setField('enabled', data ? data.promotion!.enabled : true);
  }, [data]);

  // useEffect(() => {
  //   setField('enabled', view.entity ? view.entity.enabled : true);
  // }, [view.entity]);

  return (
    <div className="flex w-full flex-col gap-4">
      <EnabledCard enabledValue={state.enabled?.value} onEnabledChange={(e) => setField('enabled', e)} />
    </div>
  );
};
