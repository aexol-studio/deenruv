import { useDetailViewStore } from '@/state/detail-view';
import React from 'react';

export const ProductVariantDetailView = () => {
  const { getMarker } = useDetailViewStore(({ getMarker }) => ({ getMarker }));
  return <div>{getMarker()}</div>;
};
