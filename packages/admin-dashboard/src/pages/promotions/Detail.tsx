import { useParams } from 'react-router-dom';
import { useValidators, createDeenruvForm, DetailView, useMutation } from '@deenruv/react-ui-devkit';
import { $, Permission, scalars, typedGql } from '@deenruv/admin-types';
import { PromotionDetailView } from '@/pages/promotions/_components/PromotionDetailView';
import { PromotionDetailSidebar } from '@/pages/promotions/_components/PromotionDetailSidebar';
import { useTranslation } from 'react-i18next';

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
              const input = {
                translations: data.translations?.validatedValue,
                enabled: data.enabled?.validatedValue || false,
                actions: data.actions?.validatedValue,
                conditions: data.conditions?.validatedValue?.map((el) => ({
                  ...el,
                  arguments: el.arguments.map((arg) => ({ ...arg, value: arg.value.toString() })),
                })),
                couponCode: data.couponCode?.validatedValue,
                endsAt: data.endsAt?.validatedValue,
                startsAt: data.startsAt?.validatedValue,
                perCustomerUsageLimit: data.perCustomerUsageLimit?.validatedValue,
                usageLimit: data.usageLimit?.validatedValue,
                ...(data.customFields?.validatedValue ? { customFields: data.customFields?.validatedValue } : {}),
              };

              return id ? update({ input: { id, ...input } }) : create({ input });
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
