import { useOrder } from '@deenruv/react-ui-devkit';
import React from 'react';

export const InRealizationCard = () => {
    const { order } = useOrder();
    console.log(order);
    return <div></div>;
};
