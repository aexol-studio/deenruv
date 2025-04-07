import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  useValidators,
  getMutation,
  GFFLPFormField,
  useMutation,
  DetailView,
  createDeenruvForm,
} from '@deenruv/react-ui-devkit';
import { ModelTypes } from '@deenruv/admin-types';
import { SellerDetailView } from '@/pages/sellers/_components/SellerDetailView.js';

const CreateSellerMutation = getMutation('createSeller');
const EditSellerMutation = getMutation('updateSeller');
const DeleteSellerMutation = getMutation('deleteSeller');

type CreateSellerInput = ModelTypes['CreateSellerInput'];
type FormDataType = Partial<{
  name: GFFLPFormField<CreateSellerInput['name']>;
  customFields: GFFLPFormField<CreateSellerInput['customFields']>;
}>;

export const SellersDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditSellerMutation);
  const [create] = useMutation(CreateSellerMutation);
  const [remove] = useMutation(DeleteSellerMutation);
  const { nameValidator } = useValidators();

  const onSubmitHandler = useCallback(
    (data: FormDataType) => {
      if (!data.name?.validatedValue) {
        throw new Error('Name is required.');
      }
      const inputData = {
        name: data.name.validatedValue,
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
        locationId="sellers-detail-view"
        main={{
          name: 'seller',
          label: 'Seller',
          component: <SellerDetailView />,
          form: createDeenruvForm({
            key: 'CreateSellerInput',
            keys: ['name', 'customFields'],
            config: { name: nameValidator },
            onSubmitted: onSubmitHandler,
            onDeleted: onDeleteHandler,
          }),
        }}
      />
    </div>
  );
};
