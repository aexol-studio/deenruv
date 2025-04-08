import React from 'react';
import { Button, CardIcons, CustomCard, CustomerDetailType, useTranslation } from '@deenruv/react-ui-devkit';
import { Address } from '@/pages/customers/_components/Address';
import { PlusCircle } from 'lucide-react';
import { AddressDialog } from '@/pages/customers/_components/AddressDialog';

interface RolesCardProps {
  customerId: string;
  addresses: CustomerDetailType['addresses'];
  onActionCompleted: () => void;
}

export const AddressesCard: React.FC<RolesCardProps> = ({ addresses, customerId, onActionCompleted }) => {
  const { t } = useTranslation('customers');

  return (
    <CustomCard
      title={t('addresses.header')}
      icon={<CardIcons.address />}
      color="green"
      bottomRight={
        customerId && (
          <AddressDialog customerId={customerId} onActionCompleted={onActionCompleted}>
            <Button variant="secondary" className="flex items-center gap-2">
              <PlusCircle />
              {t('addresses.addBtn')}
            </Button>
          </AddressDialog>
        )
      }
    >
      <div className="flex gap-4">
        {addresses?.length ? (
          addresses?.map((a) => <Address onActionCompleted={onActionCompleted} address={a} customerId={customerId} />)
        ) : (
          <p className="w-full text-center">{t(customerId ? 'addresses.empty' : 'addresses.createCustomerFirst')}</p>
        )}
      </div>
    </CustomCard>
  );
};
