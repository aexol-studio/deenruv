import { useParams } from 'react-router-dom';
import { DetailView, GFFLPFormField, createDeenruvForm, useMutation } from '@deenruv/react-ui-devkit';
import { StockLocationDetailView } from './_components/StockLocationDetailView';
import { typedGql, scalars, $, ModelTypes } from '@deenruv/admin-types';
import { useCallback } from 'react';

type CreateStockLocationInput = ModelTypes['CreateStockLocationInput'];
type FormDataType = Partial<{
  name: GFFLPFormField<CreateStockLocationInput['name']>;
  description: GFFLPFormField<CreateStockLocationInput['description']>;
}>;

const CreateStockLocationMutation = typedGql('mutation', { scalars })({
  createStockLocation: [
    {
      input: $('input', 'CreateStockLocationInput!'),
    },
    { id: true },
  ],
});

const EditStockLocationMutation = typedGql('mutation', { scalars })({
  updateStockLocation: [
    {
      input: $('input', 'UpdateStockLocationInput!'),
    },
    { id: true },
  ],
});

const DeleteStockLocationMutation = typedGql('mutation', { scalars })({
  deleteStockLocation: [
    {
      input: $('input', 'DeleteStockLocationInput!'),
    },
    { message: true },
  ],
});

export const StockLocationsDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditStockLocationMutation);
  const [create] = useMutation(CreateStockLocationMutation);
  const [remove] = useMutation(DeleteStockLocationMutation);

  const onSubmitHandler = useCallback(
    (_event: React.FormEvent, data: FormDataType) => {
      if (!data.name?.validatedValue) {
        throw new Error('Name is required.');
      }

      const inputData = {
        name: data.name.validatedValue,
        description: data.description?.validatedValue,
      };

      if (id) {
        return update({
          input: {
            id,
            ...inputData,
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
        locationId="stockLocations-detail-view"
        main={{
          name: 'stockLocation',
          label: 'Stock location',
          component: <StockLocationDetailView />,
          form: createDeenruvForm({
            key: 'CreateStockLocationInput',
            keys: ['description', 'name'],
            config: {},
            onSubmitted: onSubmitHandler,
            onDeleted: onDeleteHandler,
          }),
        }}
      />
    </div>
  );
};
