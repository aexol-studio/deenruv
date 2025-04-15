import React, { PropsWithChildren, useCallback, useMemo, useRef, useState } from 'react';
import {
  Button,
  CustomerAddressType,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  useMutation,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { typedGql, scalars, $, ModelTypes } from '@deenruv/admin-types';
import { toast } from 'sonner';
import { AddressForm, AddressFormRef } from '@/pages/customers/_components/AddressForm.js';
import { addressBaseSelector } from '@/graphql/draft_order.js';

interface RolesCardProps {
  customerId: string;
  address?: CustomerAddressType;
  onActionCompleted: () => void;
}

export const CreateCustomerAddressMutation = typedGql('mutation', { scalars })({
  createCustomerAddress: [
    { customerId: $('customerId', 'ID!'), input: $('input', 'CreateAddressInput!') },
    {
      id: true,
      ...addressBaseSelector,
    },
  ],
});

export const UpdateCustomerAddressMutation = typedGql('mutation', { scalars })({
  updateCustomerAddress: [{ input: $('input', 'UpdateAddressInput!') }, { id: true }],
});

export const AddressDialog: React.FC<PropsWithChildren<RolesCardProps>> = ({
  address,
  customerId,
  onActionCompleted,
  children,
}) => {
  const formRef = useRef<AddressFormRef>(null);
  const [createAddress] = useMutation(CreateCustomerAddressMutation);
  const [updateAddress] = useMutation(UpdateCustomerAddressMutation);
  const { t } = useTranslation('customers');
  const [open, setOpen] = useState(false);
  const isEdit = useMemo(() => !!address, [address]);
  const [input, setInput] = useState<ModelTypes['CreateAddressInput']>();

  const handleSubmit = useCallback(async () => {
    if (!input) return;
    const isValid = formRef.current?.validate();
    console.log('VALID', isValid);
    if (!isValid) return;

    isEdit
      ? await updateAddress({ input: { ...input, id: address?.id! } }).then((resp) => {
          if (resp.updateCustomerAddress.id) {
            setOpen(false);
            toast.success(t('selectAddress.addressSuccessUpdateToast'));
            onActionCompleted();
          } else toast.error(t('selectAddress.addressFailedUpdateToast'));
        })
      : await createAddress({ customerId, input }).then((resp) => {
          if (resp.createCustomerAddress.id) {
            setOpen(false);
            toast.success(t('selectAddress.addressSuccessCreateToast'));
            onActionCompleted();
          } else toast.error(t('selectAddress.addressFailedCreateToast'));
        });
  }, [input, isEdit, customerId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col">
        <DialogHeader className="mb-4">
          <DialogTitle>{t(isEdit ? 'selectAddress.editAddress' : 'selectAddress.createAddress')}</DialogTitle>
        </DialogHeader>
        <AddressForm ref={formRef} initialValues={address} onInputChange={setInput} addressId={address?.id} />
        <DialogFooter className="mt-2">
          <Button className="w-min place-self-end" onClick={handleSubmit}>
            {t('addresses.save')}
          </Button>
          <Button className="w-min place-self-end" onClick={() => setOpen(false)}>
            {t('addresses.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
