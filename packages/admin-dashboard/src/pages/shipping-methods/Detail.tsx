import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DetailView, createDeenruvForm, GFFLPFormField, getMutation, useMutation } from '@deenruv/react-ui-devkit';
import { ModelTypes } from '@deenruv/admin-types';
import { ShippingMethodDetailView } from '@/pages/shipping-methods/_components/ShippingMethodDetailView.js';

type CreateShippingMethodInput = ModelTypes['CreateShippingMethodInput'];
type FormDataType = Partial<{
  code: GFFLPFormField<CreateShippingMethodInput['code']>;
  calculator: GFFLPFormField<CreateShippingMethodInput['calculator']>;
  translations: GFFLPFormField<CreateShippingMethodInput['translations']>;
  fulfillmentHandler: GFFLPFormField<CreateShippingMethodInput['fulfillmentHandler']>;
  checker: GFFLPFormField<CreateShippingMethodInput['checker']>;
}>;

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
      if (!data.code?.validatedValue) {
        throw new Error('Name is required.');
      }

      const inputData = {
        code: data.code?.validatedValue,
        calculator: data.calculator?.validatedValue,
        fulfillmentHandler: data.fulfillmentHandler?.validatedValue,
        translations: data.translations!.validatedValue!,
        checker: data.checker?.validatedValue,
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
        locationId="shippingMethods-detail-view"
        main={{
          name: 'shippingMethod',
          label: 'Shipping method',
          component: <ShippingMethodDetailView />,
          form: createDeenruvForm({
            key: 'CreateShippingMethodInput',
            keys: ['code', 'translations', 'checker', 'calculator', 'fulfillmentHandler'],
            config: {
              fulfillmentHandler: {
                validate: (v) => {
                  if (!v) return [t('validation.fulfillmentHandlerRequired')];
                },
              },
              checker: {
                validate: (v) => {
                  const hasCode = !!v?.code;
                  const hasArguments = v?.arguments.filter((a) => a.value).length;
                  const errors = [];
                  if (!hasCode) errors.push(t('validation.checkerCodeRequired'));
                  if (!hasArguments) errors.push(t('validation.checkerArgsRequired'));
                  return errors;
                },
              },
              calculator: {
                validate: (v) => {
                  const hasCode = !!v?.code;
                  const hasInvalidArguments = v?.arguments.filter((a) => !a.value || a.value === 'false').length; // args have 'false' value by default
                  const errors = [];
                  console.log(v?.arguments);
                  if (!hasCode) errors.push(t('validation.checkerCodeRequired'));
                  if (hasInvalidArguments) errors.push(t('validation.checkerArgsRequired'));
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
                  const { name } = v[0];

                  if (!name) return [t('validation.nameRequired')];
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
