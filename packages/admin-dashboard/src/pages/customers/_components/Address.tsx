import React from 'react';
import {
  Card,
  CardContent,
  CustomerAddressType,
  CardFooter,
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  useMutation,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { AddressDialog } from '@/pages/customers/_components/AddressDialog';
import { CreditCard, MoreHorizontal, Trash, Truck } from 'lucide-react';
import { typedGql, scalars, $ } from '@deenruv/admin-types';
import { toast } from 'sonner';

interface RolesCardProps {
  address: CustomerAddressType;
  customerId: string;
  onActionCompleted: () => void;
}

const DeleteCustomerAddressMutation = typedGql('mutation', { scalars })({
  deleteCustomerAddress: [{ id: $('addressId', 'ID!') }, { success: true }],
});

const SetAsDefaultBillingAddressMutation = typedGql('mutation', { scalars })({
  updateCustomerAddress: [
    {
      input: {
        id: $('addressId', 'ID!'),
        defaultBillingAddress: true,
      },
    },
    { id: true },
  ],
});

const SetAsDefaultShippingAddressMutation = typedGql('mutation', { scalars })({
  updateCustomerAddress: [
    {
      input: {
        id: $('addressId', 'ID!'),
        defaultShippingAddress: true,
      },
    },
    { id: true },
  ],
});

export const Address: React.FC<RolesCardProps> = ({ address, customerId, onActionCompleted }) => {
  const { t } = useTranslation('customers');
  const [deleteAddress] = useMutation(DeleteCustomerAddressMutation);
  const [setAsDefaultBillingAddress] = useMutation(SetAsDefaultBillingAddressMutation);
  const [setAsDefaultShippingAddress] = useMutation(SetAsDefaultShippingAddressMutation);

  return (
    <Card className="flex w-56 flex-col justify-between bg-secondary text-primary">
      <CardContent className="mt-4 flex flex-col gap-1">
        <h5 className="mb-2">{address.streetLine1}</h5>
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
      </CardContent>
      <CardFooter className="justify-between">
        <div className="flex items-center gap-3">
          {address.defaultBillingAddress && (
            <Tooltip>
              <TooltipTrigger>
                <CreditCard size={20} />
              </TooltipTrigger>
              <TooltipContent>{t('selectAddress.defaultBilling')}</TooltipContent>
            </Tooltip>
          )}
          {address.defaultShippingAddress && (
            <Tooltip>
              <TooltipTrigger>
                <Truck size={20} />
              </TooltipTrigger>
              <TooltipContent>{t('selectAddress.defaultShipping')}</TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="flex items-center">
          <AddressDialog address={address} customerId={customerId} onActionCompleted={onActionCompleted}>
            <Button variant="outline" className="h-8 px-8">
              {t('addresses.edit')}
            </Button>
          </AddressDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="size-8 p-0">
                <span className="sr-only">{t('selectAddress.more')}</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="flex items-center gap-2"
                disabled={address.defaultBillingAddress ?? undefined}
                onClick={() =>
                  setAsDefaultBillingAddress({ addressId: address.id }).then((resp) => {
                    if (resp.updateCustomerAddress.id) {
                      toast.success(t('selectAddress.addressSuccessSetAsDefaultBillingToast'));
                      onActionCompleted();
                    } else toast.error(t('selectAddress.addressFailedSetAsDefaultToast'));
                  })
                }
              >
                <CreditCard size={16} />
                {t('selectAddress.setAsDefaultBilling')}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2"
                disabled={address.defaultShippingAddress ?? undefined}
                onClick={() =>
                  setAsDefaultShippingAddress({ addressId: address.id }).then((resp) => {
                    if (resp.updateCustomerAddress.id) {
                      toast.success(t('selectAddress.addressSuccessSetAsDefaultShippingToast'));
                      onActionCompleted();
                    } else toast.error(t('selectAddress.addressFailedSetAsDefaultToast'));
                  })
                }
              >
                <Truck size={16} />
                {t('selectAddress.setAsDefaultShipping')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  deleteAddress({ addressId: address.id }).then((resp) => {
                    if (resp.deleteCustomerAddress.success) {
                      toast.success(t('selectAddress.addressSuccessDeleteToast'));
                      onActionCompleted();
                    } else toast.error(t('selectAddress.addressFailedDeleteToast'));
                  })
                }
              >
                <div className="flex items-center gap-2 text-red-400 hover:text-red-400 dark:hover:text-red-400">
                  <Trash size={16} />
                  {t('selectAddress.deleteAddress')}
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardFooter>
    </Card>
  );
};
