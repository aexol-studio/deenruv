import {
  useDetailView,
  Spinner,
  useSettings,
  DetailViewMarker,
  PromotionDetailSelector,
} from '@deenruv/react-ui-devkit';
import { useCallback, useEffect, useMemo } from 'react';
import { setInArrayBy } from '@/lists/useGflp';
import { z } from 'zod';
import { BasicFieldsCard } from '@/pages/promotions/_components/BasicFieldsCard';
import { OptionsCard } from '@/pages/promotions/_components/OptionsCard';
import { ConditionsCard } from '@/pages/promotions/_components/ConditionsCard';
import { ActionsCard } from '@/pages/promotions/_components/ActionsCard';
import { typedGql, scalars, $ } from '@deenruv/admin-types';

const FormSchema = z.object({
  enabled: z.boolean(),
  startsAt: z.date().optional(),
  endsAt: z.date().optional(),
  couponCode: z.string().optional(),
  perCustomerUsageLimit: z.number().optional(),
  usageLimit: z.number().optional(),
  conditions: z.array(
    z.object({
      code: z.string(),
      arguments: z.array(z.object({ name: z.string(), value: z.string() })),
    }),
  ),
  actions: z.array(
    z.object({
      code: z.string(),
      arguments: z.array(z.object({ name: z.string(), value: z.string() })),
    }),
  ),
  translations: z.array(
    z.object({
      id: z.string().optional(),
      languageCode: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      customFields: z.record(z.unknown()).optional(),
    }),
  ),
  customFields: z.record(z.unknown()).optional(),
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
        <BasicFieldsCard currentTranslationValue={currentTranslationValue} onChange={setTranslationField} />
        <OptionsCard
          endsAt={state.endsAt?.value}
          startsAt={state.startsAt?.value}
          couponCode={state.couponCode?.value}
          usageLimit={state.usageLimit?.value}
          perCustomerUsageLimit={state.perCustomerUsageLimit?.value}
          setField={setField}
        />
        <ConditionsCard value={state.conditions?.value} onChange={setField} />
        <ActionsCard value={state.actions?.value} onChange={setField} />
        <DetailViewMarker position={'promotions-detail-view'} />
      </form>
    </div>
  );
};
