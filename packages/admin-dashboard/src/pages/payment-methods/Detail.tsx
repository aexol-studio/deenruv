import { useCallback } from 'react';
import { useParams } from 'react-router';

import {
  useValidators,
  DetailView,
  createDeenruvForm,
  GFFLPFormField,
  useMutation,
  getMutation,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { ModelTypes } from '@deenruv/admin-types';
import { PaymentMethodDetailView } from '@/pages/payment-methods/_components/PaymentMethodDetailView.js';

type CreatePaymentMethodInput = ModelTypes['CreatePaymentMethodInput'];
type FormDataType = Partial<{
  code: GFFLPFormField<CreatePaymentMethodInput['code']>;
  enabled: GFFLPFormField<CreatePaymentMethodInput['enabled']>;
  translations: GFFLPFormField<CreatePaymentMethodInput['translations']>;
  handler: GFFLPFormField<CreatePaymentMethodInput['handler']>;
  checker: GFFLPFormField<CreatePaymentMethodInput['checker']>;
  customFields: GFFLPFormField<CreatePaymentMethodInput['customFields']>;
}>;

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
      if (!data.code?.validatedValue) {
        throw new Error('Name is required.');
      }

      const inputData = {
        code: data.code?.validatedValue,
        handler: data.handler?.validatedValue,
        enabled: data.enabled?.validatedValue || data.enabled?.initialValue,
        translations: data.translations?.validatedValue,
        ...(data.customFields?.validatedValue ? { customFields: data.customFields?.validatedValue } : {}),
      };

      if (id) {
        return update({
          input: {
            id,
            ...inputData,
            checker: data.checker?.validatedValue?.code !== '' ? data.checker?.validatedValue : undefined,
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
