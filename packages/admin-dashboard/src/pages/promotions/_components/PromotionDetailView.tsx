import {
  useDetailView,
  Spinner,
  useSettings,
  DetailViewMarker,
  PromotionDetailSelector,
  useQuery,
} from '@deenruv/react-ui-devkit';
import { useCallback, useEffect, useMemo } from 'react';
import { setInArrayBy } from '@/lists/useGflp';
import { z } from 'zod';
import { BasicFieldsCard } from '@/pages/promotions/_components/BasicFieldsCard';
import { OptionsCard } from '@/pages/promotions/_components/OptionsCard';
import { ConditionsCard } from '@/pages/promotions/_components/ConditionsCard';
import { ActionsCard } from '@/pages/promotions/_components/ActionsCard';
import { typedGql, scalars, $ } from '@deenruv/admin-types';
import { PromotionConditionAndActionSelector } from '@/graphql/promotions.js';

export const ConditionsQuery = typedGql('query', { scalars })({
  promotionConditions: PromotionConditionAndActionSelector,
});

const PROMOTION_FORM_KEYS = [
  'CreatePromotionInput',
  'enabled',
  'startsAt',
  'endsAt',
  'couponCode',
  'perCustomerUsageLimit',
  'usageLimit',
  'conditions',
  'actions',
  'translations',
] as const;

export const PromotionQuery = typedGql('query', { scalars })({
  promotion: [{ id: $('id', 'ID!') }, PromotionDetailSelector],
});

export const PromotionDetailView = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { form, loading, fetchEntity } = useDetailView('promotions-detail-view', ...PROMOTION_FORM_KEYS);
  const {
    base: { setField, state },
  } = form;
  const { data } = useQuery(ConditionsQuery);

  const availableConditions = useMemo(() => {
    return data?.promotionConditions.filter((c) => !state.conditions?.value?.some((v) => v.code === c.code)) || [];
  }, [data, state.conditions?.value]);

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();
      if (!res) return;

      setField('translations', res.translations);
      setField('endsAt', res.endsAt);
      setField('startsAt', res.startsAt);
      setField('couponCode', res.couponCode);
      setField('usageLimit', res.usageLimit);
      setField('perCustomerUsageLimit', res.perCustomerUsageLimit);
      setField(
        'conditions',
        res.conditions.map((c) => ({ code: c.code, arguments: c.args })),
      );
      setField(
        'actions',
        res.actions.map((a) => ({ code: a.code, arguments: a.args })),
      );
    })();
  }, [contentLng]);

  const translations = useMemo(() => state?.translations?.value || [], [state?.translations?.value]);

  const currentTranslationValue = useMemo(
    () => translations.find((v) => v.languageCode === contentLng),
    [translations, contentLng],
  );

  const setTranslationField = useCallback(
    (field: string, e: string) => {
      setField(
        'translations',
        setInArrayBy(translations, (t) => t.languageCode !== contentLng, {
          [field]: e,
          languageCode: contentLng,
        }),
      );
    },

    [contentLng, translations],
  );

  return loading ? (
    <div>
      <Spinner height={'80vh'} />
    </div>
  ) : (
    <div>
      <form className="flex flex-col gap-4">
        <BasicFieldsCard
          currentTranslationValue={currentTranslationValue ?? undefined}
          onChange={setTranslationField}
          errors={state.translations?.errors}
        />
        <OptionsCard
          endsAt={state.endsAt?.value}
          startsAt={state.startsAt?.value}
          couponCode={state.couponCode?.value ?? undefined}
          usageLimit={state.usageLimit?.value ?? undefined}
          perCustomerUsageLimit={state.perCustomerUsageLimit?.value ?? undefined}
          setField={setField}
        />
        <ConditionsCard value={state.conditions?.value} onChange={setField} errors={state.conditions?.errors} />
        <ActionsCard value={state.actions?.value} onChange={setField} errors={state.actions?.errors} />
        <DetailViewMarker position={'promotions-detail-view'} />
      </form>
    </div>
  );
};
