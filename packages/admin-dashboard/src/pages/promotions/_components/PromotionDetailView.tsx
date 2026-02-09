import {
  useDetailView,
  useSettings,
  DetailViewMarker,
  PromotionDetailSelector,
  setInArrayBy,
  CF,
  EntityCustomFields,
  PromotionConditionAndActionSelector,
} from '@deenruv/react-ui-devkit';
import { useCallback, useEffect, useMemo } from 'react';
import { BasicFieldsCard } from '@/pages/promotions/_components/BasicFieldsCard';
import { OptionsCard } from '@/pages/promotions/_components/OptionsCard';
import { ConditionsCard } from '@/pages/promotions/_components/ConditionsCard';
import { ActionsCard } from '@/pages/promotions/_components/ActionsCard';
import { typedGql, scalars, $ } from '@deenruv/admin-types';

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
  'customFields',
] as const;

export const PromotionQuery = typedGql('query', { scalars })({
  promotion: [{ id: $('id', 'ID!') }, PromotionDetailSelector],
});

export const PromotionDetailView = () => {
  const contentLng = useSettings((p) => p.translationsLanguage);
  const { form, entity, fetchEntity, id } = useDetailView('promotions-detail-view', ...PROMOTION_FORM_KEYS);
  const { base } = form;

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();
      if (!res) return;

      base.setField('translations', res.translations);
      base.setField('endsAt', res.endsAt);
      base.setField('startsAt', res.startsAt);
      base.setField('couponCode', res.couponCode);
      base.setField('usageLimit', res.usageLimit);
      base.setField('perCustomerUsageLimit', res.perCustomerUsageLimit);
      base.setField(
        'conditions',
        res.conditions.map((c) => ({ code: c.code, arguments: c.args })),
      );
      base.setField(
        'actions',
        res.actions.map((a) => ({ code: a.code, arguments: a.args })),
      );
    })();
  }, [contentLng]);

  const translations = useMemo(() => base.watch('translations') || [], [base.watch('translations')]);

  const currentTranslationValue = useMemo(
    () => translations.find((v: any) => v.languageCode === contentLng),
    [translations, contentLng],
  );

  const setTranslationField = useCallback(
    (field: string, e: string) => {
      const baseTranslation = currentTranslationValue ?? {
        languageCode: contentLng,
        name: '',
        description: '',
      };

      base.setField(
        'translations',
        setInArrayBy(translations, (t: any) => t.languageCode === contentLng, {
          ...baseTranslation,
          [field]: e,
          languageCode: contentLng,
        }),
      );
    },

    [contentLng, translations, currentTranslationValue],
  );

  return (
    <div>
      <form className="flex flex-col gap-4">
        <BasicFieldsCard
          currentTranslationValue={currentTranslationValue ?? undefined}
          onChange={setTranslationField}
          errors={base.formState.errors?.translations?.message ? [base.formState.errors.translations.message as string] : undefined}
        />
        <OptionsCard
          endsAt={base.watch('endsAt')}
          startsAt={base.watch('startsAt')}
          couponCode={base.watch('couponCode') ?? undefined}
          usageLimit={base.watch('usageLimit') ?? undefined}
          perCustomerUsageLimit={base.watch('perCustomerUsageLimit') ?? undefined}
          setField={base.setField}
        />
        <DetailViewMarker position={'promotions-detail-view'} />
        <EntityCustomFields
          entityName="promotion"
          id={id}
          hideButton
          onChange={(customFields, translations) => {
            base.setField('customFields', customFields);
            if (translations) base.setField('translations', translations as any);
          }}
          initialValues={
            entity && 'customFields' in entity
              ? { customFields: entity.customFields as CF, translations: entity.translations as any }
              : { customFields: {} }
          }
        />
        <ConditionsCard value={base.watch('conditions')} onChange={base.setField} errors={base.formState.errors?.conditions?.message ? [base.formState.errors.conditions.message as string] : undefined} />
        <ActionsCard value={base.watch('actions')} onChange={base.setField} errors={base.formState.errors?.actions?.message ? [base.formState.errors.actions.message as string] : undefined} />
      </form>
    </div>
  );
};
