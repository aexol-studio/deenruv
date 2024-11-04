import React from 'react';
import {
  CustomerSelectCard,
  AddressCard,
  ShippingMethod,
  TaxSummary,
  ProductsCard,
  Payments,
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
      <TaxSummary />
      <Payments />
      <div className="my-8 flex flex-col gap-4">
        <PromotionsList />
      </div>
    </>
  );
};
