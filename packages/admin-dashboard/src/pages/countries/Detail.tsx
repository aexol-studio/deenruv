import { useParams } from 'react-router';

import {
  useValidators,
  DetailView,
  createDeenruvForm,
  getMutation,
  useMutation,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { CountryDetailView } from '@/pages/countries/_components/CountryDetailView.js';
import { useCallback } from 'react';
import { ModelTypes } from '@deenruv/admin-types';

const CreateCountryMutation = getMutation('createCountry');
const EditCountryMutation = getMutation('updateCountry');
const DeleteCountryMutation = getMutation('deleteCountry');

type CreateCountryInput = ModelTypes['CreateCountryInput'];
type FormDataType = Record<string, unknown>;

export const CountriesDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation('countries');
  const [update] = useMutation(EditCountryMutation);
  const [create] = useMutation(CreateCountryMutation);
  const [remove] = useMutation(DeleteCountryMutation);
  const { translationsValidator, stringValidator } = useValidators();

  const onSubmitHandler = useCallback(
    (data: FormDataType) => {
      if (!data.code) {
        throw new Error('Code is required.');
      }

      const inputData = {
        code: data.code as CreateCountryInput['code'],
        enabled: data.enabled as CreateCountryInput['enabled'],
        translations: data.translations as CreateCountryInput['translations'],
        ...(data.customFields ? { customFields: data.customFields } : {}),
      };

      if (id) {
        return update({ input: { id, ...inputData } });
      } else {
        return create({ input: inputData });
      }
    },
    [id, update, create],
  );

  const onDeleteHandler = useCallback(() => {
    if (!id) {
      throw new Error('Could not find the id.');
    }

    return remove({ id });
  }, [remove, id]);

  return (
    <div className="relative flex flex-col gap-y-4">
      <DetailView
        id={id}
        locationId="countries-detail-view"
        main={{
          name: 'country',
          label: 'Country',
          component: <CountryDetailView />,
          form: createDeenruvForm({
            key: 'CreateCountryInput',
            keys: ['code', 'enabled', 'translations'],
            config: {
              enabled: {
                initialValue: true,
              },
              code: stringValidator(t('validation.required')),
              translations: translationsValidator,
            },
            onSubmitted: onSubmitHandler,
            onDeleted: onDeleteHandler,
          }),
        }}
      />
    </div>
  );
};
