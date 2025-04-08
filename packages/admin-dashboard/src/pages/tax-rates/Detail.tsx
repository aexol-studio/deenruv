import { useCallback } from 'react';
import { useParams } from 'react-router-dom';

import {
  useValidators,
  DetailView,
  createDeenruvForm,
  GFFLPFormField,
  getMutation,
  useMutation,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { TaxRateDetailView } from '@/pages/tax-rates/_components/TaxRateDetailView.js';
import { ModelTypes } from '@deenruv/admin-types';

type CreateTaxRateInput = ModelTypes['CreateTaxRateInput'];
type FormDataType = Partial<{
  name: GFFLPFormField<CreateTaxRateInput['name']>;
  categoryId: GFFLPFormField<CreateTaxRateInput['categoryId']>;
  customerGroupId: GFFLPFormField<CreateTaxRateInput['customerGroupId']>;
  enabled: GFFLPFormField<CreateTaxRateInput['enabled']>;
  value: GFFLPFormField<CreateTaxRateInput['value']>;
  zoneId: GFFLPFormField<CreateTaxRateInput['zoneId']>;
  customFields: GFFLPFormField<CreateTaxRateInput['customFields']>;
}>;

const CreateTaxRateMutation = getMutation('createTaxRate');
const EditTaxRateMutation = getMutation('updateTaxRate');
const DeleteTaxRateMutation = getMutation('deleteTaxRate');

export const TaxRatesDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditTaxRateMutation);
  const [create] = useMutation(CreateTaxRateMutation);
  const [remove] = useMutation(DeleteTaxRateMutation);
  const { t } = useTranslation('taxRates');
  const { nameValidator, stringValidator, numberValidator } = useValidators();

  const onSubmitHandler = useCallback(
    (data: FormDataType) => {
      if (!data.name?.validatedValue) {
        throw new Error('Name is required.');
      }

      const inputData = {
        name: data.name!.validatedValue!,
        enabled: data.enabled!.value!,
        categoryId: data.categoryId!.validatedValue!,
        value: data.value?.validatedValue || data.value?.initialValue,
        zoneId: data.zoneId!.validatedValue!,
        customerGroupId: data.customerGroupId?.validatedValue,
        ...(data.customFields?.validatedValue ? { customFields: data.customFields?.validatedValue } : {}),
      };

      if (id) {
        return update({ input: { id, ...inputData } });
      } else {
        return create({ input: { ...inputData } });
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
        locationId="taxRates-detail-view"
        main={{
          name: 'taxRate',
          label: 'Tax Rate',
          component: <TaxRateDetailView />,
          form: createDeenruvForm({
            key: 'CreateTaxRateInput',
            keys: ['name', 'categoryId', 'customerGroupId', 'enabled', 'value', 'zoneId', 'customFields'],
            config: {
              name: nameValidator,
              categoryId: stringValidator(t('validation.taxCategoryRequired')),
              value: numberValidator(t('validation.valueRequired')),
              zoneId: stringValidator(t('validation.zoneRequired')),
              enabled: {
                initialValue: true,
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
