import { useCallback } from 'react';
import { useParams } from 'react-router';

import {
  useValidators,
  DetailView,
  createDeenruvForm,
  useMutation,
  getMutation,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { ModelTypes } from '@deenruv/admin-types';
import { PaymentMethodDetailView } from '@/pages/payment-methods/_components/PaymentMethodDetailView.js';

type FormDataType = Record<string, unknown>;

const CreatePaymentMethodMutation = getMutation('createPaymentMethod');
const EditPaymentMethodMutation = getMutation('updatePaymentMethod');
const DeletePaymentMethodMutation = getMutation('deletePaymentMethod');

export const PaymentMethodsDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditPaymentMethodMutation);
  const [create] = useMutation(CreatePaymentMethodMutation);
  const [remove] = useMutation(DeletePaymentMethodMutation);
  const { t } = useTranslation('paymentMethods');
  const { translationsValidator, stringValidator, configurableOperationValidator } = useValidators();

  const onSubmitHandler = useCallback(
    (data: FormDataType) => {
      if (!data.code) {
        throw new Error('Name is required.');
      }

      const checker = data.checker as ModelTypes['CreatePaymentMethodInput']['checker'];
      const inputData = {
        code: data.code as string,
        handler: data.handler as ModelTypes['CreatePaymentMethodInput']['handler'],
        enabled: (data.enabled ?? false) as boolean,
        translations: data.translations as ModelTypes['CreatePaymentMethodInput']['translations'],
        ...(data.customFields ? { customFields: data.customFields } : {}),
      };

      if (id) {
        return update({
          input: {
            id,
            ...inputData,
            checker: checker?.code !== '' ? checker : undefined,
          },
        });
      } else {
        return create({
          input: inputData,
        });
      }
    },
    [id, update, create],
  );

  const onDeleteHandler = useCallback(() => {
    if (!id) {
      throw new Error('Could not find the id.');
    }

    return remove({ input: { id } });
  }, [remove, id]);

  return (
    <div className="relative flex flex-col gap-y-4">
      <DetailView
        id={id}
        locationId="paymentMethods-detail-view"
        main={{
          name: 'paymentMethod',
          label: 'Payment method',
          component: <PaymentMethodDetailView />,
          form: createDeenruvForm({
            key: 'CreatePaymentMethodInput',
            keys: ['code', 'enabled', 'translations', 'handler', 'checker', 'customFields'],
            config: {
              enabled: {
                initialValue: false,
              },
              translations: translationsValidator,
              code: stringValidator(t('validation.codeRequired')),
              handler: configurableOperationValidator(
                t('validation.handlerCodeRequired'),
                t('validation.handlerArgsRequired'),
              ),
            },
            onSubmitted: onSubmitHandler,
            onDeleted: onDeleteHandler,
          }),
        }}
      />
    </div>
  );
};
