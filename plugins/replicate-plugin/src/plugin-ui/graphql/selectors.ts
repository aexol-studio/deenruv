import { scalars } from '@deenruv/admin-types';
import { Selector } from '../zeus';

export const PredictionSelector = Selector('PredictionResult')({
    predictions: { id: true, score: true, email: true },
    status: true,
});
