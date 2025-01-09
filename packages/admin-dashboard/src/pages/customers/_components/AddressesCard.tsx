import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CustomerDetailType,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
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
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('addresses.header')}</CardTitle>
        <CardContent className="flex gap-4 p-0 pt-4">
          {addresses?.length ? (
            addresses?.map((a) => <Address onActionCompleted={onActionCompleted} address={a} customerId={customerId} />)
          ) : (
            <p className="w-full text-center">{t(customerId ? 'addresses.empty' : 'addresses.createCustomerFirst')}</p>
          )}
        </CardContent>
      </CardHeader>
      <CardFooter className="justify-end">
        {customerId && (
          <AddressDialog customerId={customerId} onActionCompleted={onActionCompleted}>
            <Button variant="secondary" className="flex items-center gap-2">
              <PlusCircle />
              {t('addresses.addBtn')}
            </Button>
          </AddressDialog>
        )}
      </CardFooter>
    </Card>
  );
};
