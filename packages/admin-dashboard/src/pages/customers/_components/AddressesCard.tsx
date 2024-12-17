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
}

export const AddressesCard: React.FC<RolesCardProps> = ({ addresses, customerId }) => {
  const { t } = useTranslation('customers');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('addresses.header')}</CardTitle>
        <CardContent className="flex flex-col gap-4 p-0 pt-4">
          {addresses?.length ? (
            addresses?.map((a) => <Address address={a} customerId={customerId} />)
          ) : (
            <p className="w-full text-center">{t('addresses.empty')}</p>
          )}
        </CardContent>
      </CardHeader>
      <CardFooter className="justify-end">
        <AddressDialog customerId={customerId}>
          <Button variant="secondary" className="flex items-center gap-2">
            <PlusCircle />
            {t('addresses.addBtn')}
          </Button>
        </AddressDialog>
      </CardFooter>
    </Card>
  );
};
