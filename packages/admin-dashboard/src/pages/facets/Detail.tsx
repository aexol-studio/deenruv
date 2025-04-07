import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  useValidators,
  DetailView,
  GFFLPFormField,
  createDeenruvForm,
  getMutation,
  useMutation,
} from '@deenruv/react-ui-devkit';
import { FacetsDetailView } from '@/pages/facets/_components/FacetDetailView.js';
import { useCallback } from 'react';
import { ModelTypes } from '@deenruv/admin-types';

const CreateFacetMutation = getMutation('createFacet');
const EditFacetMutation = getMutation('updateFacet');
const DeleteFacetMutation = getMutation('deleteFacet');

type CreateFacetInput = ModelTypes['CreateFacetInput'];
type FormDataType = Partial<{
  code: GFFLPFormField<CreateFacetInput['code']>;
  isPrivate: GFFLPFormField<CreateFacetInput['isPrivate']>;
  translations: GFFLPFormField<CreateFacetInput['translations']>;
  values: GFFLPFormField<CreateFacetInput['values']>;
  customFields: GFFLPFormField<CreateFacetInput['customFields']>;
}>;

export const FacetsDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'facets']);
  const [update] = useMutation(EditFacetMutation);
  const [create] = useMutation(CreateFacetMutation);
  const [remove] = useMutation(DeleteFacetMutation);
  const { stringValidator, translationsValidator } = useValidators();

  const onSubmitHandler = useCallback(
    (data: FormDataType) => {
      if (!data.code?.validatedValue) {
        throw new Error('Code is required.');
      }

      const inputData = {
        code: data.code.validatedValue,
        isPrivate: data.isPrivate?.value || data.isPrivate?.initialValue,
        translations: data.translations?.validatedValue,
        values: data.values?.validatedValue,
        ...(data.customFields?.validatedValue ? { customFields: data.customFields?.validatedValue } : {}),
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
    return remove({ input: { id } });
  }, [remove, id]);

  return (
    <div className="relative flex flex-col gap-y-4">
      <DetailView
        id={id}
        locationId="facets-detail-view"
        main={{
          name: 'facet',
          label: 'Facet',
          component: <FacetsDetailView />,
          form: createDeenruvForm({
            key: 'CreateFacetInput',
            keys: ['code', 'translations', 'isPrivate'],
            config: {
              code: stringValidator(t('facets:requiredError')),
              translations: translationsValidator,
              isPrivate: { initialValue: false },
            },
            onSubmitted: onSubmitHandler,
            onDeleted: onDeleteHandler,
          }),
        }}
      />
    </div>
  );
};
