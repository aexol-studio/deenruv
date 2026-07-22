import { useParams } from 'react-router';
import {
  useValidators,
  DetailView,
  createDeenruvForm,
  getMutation,
  useMutation,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { FacetsDetailView } from '@/pages/facets/_components/FacetDetailView.js';
import { useCallback } from 'react';
import { ModelTypes } from '@deenruv/admin-types';

const CreateFacetMutation = getMutation('createFacet');
const EditFacetMutation = getMutation('updateFacet');
const DeleteFacetMutation = getMutation('deleteFacet');

type FormDataType = Record<string, unknown>;

export const FacetsDetailPage = () => {
  const { id } = useParams();
  const { t } = useTranslation(['common', 'facets']);
  const [update] = useMutation(EditFacetMutation);
  const [create] = useMutation(CreateFacetMutation);
  const [remove] = useMutation(DeleteFacetMutation);
  const { stringValidator, translationsValidator } = useValidators();

  const onSubmitHandler = useCallback(
    (data: FormDataType) => {
      if (!data.code) {
        throw new Error('Code is required.');
      }

      const inputData = {
        code: data.code as string,
        isPrivate: data.isPrivate as boolean | undefined,
        translations: data.translations as ModelTypes['CreateFacetInput']['translations'],
        values: data.values as ModelTypes['CreateFacetInput']['values'],
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
