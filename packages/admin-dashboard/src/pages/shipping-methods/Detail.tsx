import { useCallback } from 'react';
import { useParams } from 'react-router';
import { useTranslation, DetailView, createDeenruvForm, getMutation, useMutation } from '@deenruv/react-ui-devkit';
import { ModelTypes } from '@deenruv/admin-types';
import { ShippingMethodDetailView } from '@/pages/shipping-methods/_components/ShippingMethodDetailView.js';

type FormDataType = Record<string, unknown>;

const isMissingConfigArgValue = (value: string | null | undefined) => value == null || value.trim() === '';

const hasMissingConfigArgs = (operation: ModelTypes['ConfigurableOperationInput'] | undefined) => {
  return !!operation?.arguments?.some((argument) => isMissingConfigArgValue(argument.value));
};

const CreateShippingMethodMutation = getMutation('createShippingMethod');
const EditShippingMethodMutation = getMutation('updateShippingMethod');
const DeleteShippingMethodMutation = getMutation('deleteShippingMethod');

export const ShippingMethodsDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditShippingMethodMutation);
  const [create] = useMutation(CreateShippingMethodMutation);
  const [remove] = useMutation(DeleteShippingMethodMutation);
  const { t } = useTranslation('shippingMethods');

  const onSubmitHandler = useCallback(
    (data: FormDataType) => {
      if (!data.code) {
        throw new Error('Name is required.');
      }

      const checker = data.checker as ModelTypes['CreateShippingMethodInput']['checker'];
      const inputData = {
        code: data.code as string,
        calculator: data.calculator as ModelTypes['CreateShippingMethodInput']['calculator'],
        fulfillmentHandler: data.fulfillmentHandler as string,
        translations: data.translations as ModelTypes['CreateShippingMethodInput']['translations'],
        checker,
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
        locationId="shippingMethods-detail-view"
        main={{
          name: 'shippingMethod',
          label: 'Shipping method',
          component: <ShippingMethodDetailView />,
          form: createDeenruvForm({
            key: 'CreateShippingMethodInput',
            keys: ['code', 'translations', 'checker', 'calculator', 'fulfillmentHandler', 'customFields'],
            config: {
              fulfillmentHandler: {
                validate: (v) => {
                  if (!v) return [t('validation.fulfillmentHandlerRequired')];
                },
              },
              checker: {
                validate: (v) => {
                  const hasCode = !!v?.code;
                  const hasInvalidArguments = hasMissingConfigArgs(v);
                  const errors = [];
                  if (!hasCode) errors.push(t('validation.checkerCodeRequired'));
                  if (hasInvalidArguments) errors.push(t('validation.checkerArgsRequired'));
                  return errors;
                },
              },
              calculator: {
                validate: (v) => {
                  const hasCode = !!v?.code;
                  const hasInvalidArguments = hasMissingConfigArgs(v);
                  const errors = [];
                  if (!hasCode) errors.push(t('validation.calculatorCodeRequired'));
                  if (hasInvalidArguments) errors.push(t('validation.calculatorArgsRequired'));
                  return errors;
                },
              },
              code: {
                validate: (v) => {
                  if (!v || v === '') return [t('validation.required')];
                },
              },
              translations: {
                validate: (v) => {
                  if (!Array.isArray(v) || v.length === 0) return [t('validation.nameRequired')];
                  const hasName = v.some((entry: Record<string, unknown>) => entry && entry.name);
                  if (!hasName) return [t('validation.nameRequired')];
                },
              },
            },
            onSubmitted: onSubmitHandler,
            onDeleted: onDeleteHandler,
          }),
        }}
      />
    </div>
  );
};
