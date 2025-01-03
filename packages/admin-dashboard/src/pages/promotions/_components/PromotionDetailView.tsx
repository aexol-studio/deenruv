import {
  useDetailView,
  Spinner,
  useSettings,
  DetailViewMarker,
  useQuery,
  PromotionDetailSelector,
} from '@deenruv/react-ui-devkit';
import { useCallback, useEffect } from 'react';
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
  const { id, view, form } = useDetailView(
    'promotions-detail-view',
    ({ id, view, form }) => ({
      id,
      view,
      state: form.base.state,
      setField: form.base.setField,
      form,
    }),
    ...PROMOTION_FORM_KEYS,
  );

  const { data } = id ? useQuery(PromotionQuery, { initialVariables: { id } }) : { data: undefined };

  const {
    base: { setField, state },
  } = form;

  useEffect(() => {
    view.refetch();
  }, [contentLng]);

  useEffect(() => {
    if (!data) return;
    setField('translations', data.promotion!.translations);
    setField('endsAt', data.promotion!.endsAt);
    setField('startsAt', data.promotion!.startsAt);
    setField('couponCode', data.promotion!.couponCode);
    setField('usageLimit', data.promotion!.usageLimit);
    setField('perCustomerUsageLimit', data.promotion!.perCustomerUsageLimit);
    setField(
      'conditions',
      data.promotion!.conditions.map((c) => ({ code: c.code, arguments: c.args })),
    );
    setField(
      'actions',
      data.promotion!.actions.map((a) => ({ code: a.code, arguments: a.args })),
    );
  }, [data]);

  // useEffect(() => {
  //   if (!view.entity) return;
  //   else {
  //     setField('translations', view.entity.translations);
  //     setField('endsAt', view.entity.endsAt);
  //     setField('startsAt', view.entity.startsAt);
  //     setField('couponCode', view.entity.couponCode);
  //     setField('usageLimit', view.entity.usageLimit);
  //     setField('perCustomerUsageLimit', view.entity.perCustomerUsageLimit);
  //     setField(
  //       'conditions',
  //       view.entity.conditions.map((c) => ({ code: c.code, arguments: c.args })),
  //     );
  //     setField(
  //       'actions',
  //       view.entity.actions.map((a) => ({ code: a.code, arguments: a.args })),
  //     );
  //   }
  // }, [view.entity]);

  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === contentLng);
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

  return view.loading ? (
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
