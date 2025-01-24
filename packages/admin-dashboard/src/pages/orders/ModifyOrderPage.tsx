import React from 'react';
import {
  CustomerSelectCard,
  AddressCard,
  ShippingMethod,
  ProductsCard,
  SurchargeCard,
} from '@/pages/orders/_components';
import { OrderListType } from '@/graphql/orders';
import { PromotionsList } from './_components/PromotionsList.js';

export const ModifyOrderPage: React.FC<{ currentOrder?: OrderListType }> = () => {
  return (
    <>
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CustomerSelectCard />
        <AddressCard type="billing" />
        <AddressCard type="shipping" />
        <ShippingMethod />
      </div>
      <ProductsCard />
      <SurchargeCard />
      <PromotionsList />
    </>
  );
};
