import { useParams } from 'react-router-dom';
import { DetailView, createDeenruvForm, useMutation } from '@deenruv/react-ui-devkit';
import { StockLocationDetailView } from './_components/StockLocationDetailView';
import { typedGql, scalars, $ } from '@deenruv/admin-types';

const EditStockLocationMutation = typedGql('mutation', { scalars })({
  updateStockLocation: [
    {
      input: $('input', 'UpdateStockLocationInput!'),
    },
    { id: true },
  ],
});

export const StockLocationsDetailPage = () => {
  const { id } = useParams();
  const [update] = useMutation(EditStockLocationMutation);

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
            onSubmitted: (_event, data) => {
              update({
                input: {
                  id: id!,
                  name: data.name?.validatedValue,
                  // @ts-ignore
                  description: data.description?.validatedValue,
                },
              });
            },
            onDeleted: (_event, data) => {
              console.log('deleted', data);
            },
          }),
        }}
      />
    </div>
  );
};
