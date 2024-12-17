import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CustomerAddressType,
  CardFooter,
  Button,
} from '@deenruv/react-ui-devkit';
import { Stack } from '@/components';
import { useTranslation } from 'react-i18next';
import { AddressDialog } from '@/pages/customers/_components/AddressDialog';

interface RolesCardProps {
  address: CustomerAddressType;
  customerId: string;
}

export const Address: React.FC<RolesCardProps> = ({ address, customerId }) => {
  const { t } = useTranslation('customers');

  return (
    <Card className="border-primary">
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('address.header')}</CardTitle>
        <CardContent className="flex flex-col gap-4 p-0 pt-4">
          <Stack className="gap-2">Test</Stack>
        </CardContent>
        <CardDescription className="pt-2">
          {/* <Label className="flex flex-col "> */}
          <span className="block text-sm">{address?.fullName}</span>
          <span className="block text-sm">
            {address.streetLine1} {address?.streetLine2}
          </span>
          <span className="block text-sm">
            {address.city} {address.postalCode} {address.province} {address.country.code}
          </span>
          <span className="block text-sm">
            {address.company} {address.phoneNumber && t('addresses.phoneNumberShort', { value: address.phoneNumber })}
          </span>
          {/* </Label> */}
        </CardDescription>
        <CardFooter>
          <AddressDialog address={address} customerId={customerId}>
            <Button size="sm" variant="ghost">
              {t('addresses.edit')}
            </Button>
          </AddressDialog>
        </CardFooter>
      </CardHeader>
    </Card>
  );
};
