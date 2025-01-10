import { useParams } from 'react-router-dom';
import { createDeenruvForm, DetailView, useMutation } from '@deenruv/react-ui-devkit';
import { $, scalars, typedGql } from '@deenruv/admin-types';
import { PromotionDetailView } from '@/pages/promotions/_components/PromotionDetailView';
import { PromotionDetailSidebar } from '@/pages/promotions/_components/PromotionDetailSidebar';

const EditPromotionMutation = typedGql('mutation', { scalars })({
  updatePromotion: [
    {
      input: $('input', 'UpdatePromotionInput!'),
    },
    {
      '...on Promotion': {
        id: true,
      },
    },
  ],
});

const CreatePromotionMutation = typedGql('mutation', { scalars })({
  createPromotion: [
    {
      input: $('input', 'CreatePromotionInput!'),
    },
    {
      '...on Promotion': {
        id: true,
      },
    },
  ],
});

const DeletePromotionMutation = typedGql('mutation', { scalars })({
  deletePromotion: [
    {
      id: $('id', 'ID!'),
    },
    {
      result: true,
    },
  ],
});

export const PromotionsDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditPromotionMutation);
  const [create] = useMutation(CreatePromotionMutation);
  const [remove] = useMutation(DeletePromotionMutation);

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
            ],
            config: {},
            onSubmitted: (data) => {
              if (!data.translations || !data.actions || !data.conditions || !data.enabled)
                throw new Error('Fill required fields.');
              const sharedInput = {
                translations: data.translations?.validatedValue,
                enabled: data.enabled?.validatedValue,
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
              };

              return id
                ? update({
                    input: {
                      id: id!,
                      ...sharedInput,
                    },
                  })
                : create({
                    input: sharedInput,
                  });
            },
            onDeleted: () => {
              if (id) return remove({ id: id });
              else throw new Error('No id');
            },
          }),
        }}
      />
    </div>
  );
};
