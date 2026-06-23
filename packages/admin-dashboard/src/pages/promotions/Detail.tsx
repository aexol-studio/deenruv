import { useParams } from 'react-router';
import {
  useTranslation,
  useValidators,
  createDeenruvForm,
  DetailView,
  useMutation,
  useSettings,
} from '@deenruv/react-ui-devkit';
import { $, Permission, scalars, typedGql } from '@deenruv/admin-types';
import { PromotionDetailView } from '@/pages/promotions/_components/PromotionDetailView';
import { PromotionDetailSidebar } from '@/pages/promotions/_components/PromotionDetailSidebar';

type PromotionTranslationInput = {
  languageCode: string;
  name?: string | null;
  description?: string | null;
  [key: string]: unknown;
};

const DEFAULT_PROMOTION_LANGUAGE_CODE = 'en';

const ensureDefaultPromotionTranslation = (
  translations: PromotionTranslationInput[],
  defaultLanguageCode: string,
): PromotionTranslationInput[] => {
  const sourceTranslation = translations.find((translation) => !!translation.name?.trim()) ?? translations[0];

  if (!sourceTranslation?.name?.trim()) return translations;

  let hasDefaultLanguage = false;
  const normalizedTranslations = translations.map((translation) => {
    if (translation.languageCode !== defaultLanguageCode) return translation;
    hasDefaultLanguage = true;

    if (translation.name?.trim()) return translation;

    return {
      ...translation,
      name: sourceTranslation.name,
      description: translation.description ?? sourceTranslation.description ?? '',
    };
  });

  if (hasDefaultLanguage) return normalizedTranslations;

  return [
    ...normalizedTranslations,
    {
      languageCode: defaultLanguageCode,
      name: sourceTranslation.name,
      description: sourceTranslation.description ?? '',
    },
  ];
};

const EditPromotionMutation = typedGql('mutation', { scalars })({
  updatePromotion: [{ input: $('input', 'UpdatePromotionInput!') }, { '...on Promotion': { id: true } }],
});

const CreatePromotionMutation = typedGql('mutation', { scalars })({
  createPromotion: [{ input: $('input', 'CreatePromotionInput!') }, { '...on Promotion': { id: true } }],
});

const DeletePromotionMutation = typedGql('mutation', { scalars })({
  deletePromotion: [{ id: $('id', 'ID!') }, { result: true }],
});

export const PromotionsDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation('common');
  const [update] = useMutation(EditPromotionMutation);
  const [create] = useMutation(CreatePromotionMutation);
  const [remove] = useMutation(DeletePromotionMutation);
  const { translationsValidator, configurableOperationArrayValidator } = useValidators();
  const defaultLanguageCode = useSettings(
    (state) => state.selectedChannel?.defaultLanguageCode ?? DEFAULT_PROMOTION_LANGUAGE_CODE,
  );

  return (
    <div className="relative flex flex-col gap-y-4">
      <DetailView
        id={id}
        locationId="promotions-detail-view"
        main={{
          name: 'promotion',
          label: 'Promotion',
          component: <PromotionDetailView />,
          sidebar: <PromotionDetailSidebar />,
          form: createDeenruvForm({
            key: 'CreatePromotionInput',
            keys: [
              'translations',
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
            ],
            config: {
              translations: translationsValidator,
              actions: configurableOperationArrayValidator(t('validation.actionsCode'), t('validation.actionsArgs')),
              conditions: configurableOperationArrayValidator(
                t('validation.conditionsCode'),
                t('validation.conditionsArgs'),
              ),
            },
            onSubmitted: (data) => {
              if (!data.translations || !data.actions || !data.conditions) throw new Error('Fill required fields.');
              const conditions = data.conditions as Array<{
                code: string;
                arguments: Array<{ name: string; value: string }>;
              }>;
              const actions = data.actions as Array<{
                code: string;
                arguments: Array<{ name: string; value: string }>;
              }>;
              const translations = data.translations as PromotionTranslationInput[];
              const input = {
                translations: id
                  ? translations
                  : ensureDefaultPromotionTranslation(translations, defaultLanguageCode),
                enabled: typeof data.enabled === 'boolean' ? data.enabled : true,
                actions,
                conditions: conditions?.map((el) => ({
                  ...el,
                  arguments: el.arguments.map((arg) => ({ ...arg, value: arg.value.toString() })),
                })),
                couponCode: data.couponCode as string | undefined,
                endsAt: data.endsAt as string | undefined,
                startsAt: data.startsAt as string | undefined,
                perCustomerUsageLimit: data.perCustomerUsageLimit as number | undefined,
                usageLimit: data.usageLimit as number | undefined,
                ...(data.customFields ? { customFields: data.customFields } : {}),
              };

              return id ? update({ input: { id, ...input } as any }) : create({ input: input as any });
            },
            onDeleted: () => {
              if (id) return remove({ id });
              else throw new Error('No id');
            },
          }),
        }}
        permissions={{
          create: Permission.CreatePromotion,
          edit: Permission.UpdatePromotion,
          delete: Permission.DeletePromotion,
        }}
      />
    </div>
  );
};
