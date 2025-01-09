import React, { PropsWithChildren, useCallback, useMemo, useState } from 'react';
import {
  Button,
  CustomerAddressType,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  SimpleSelect,
  useGFFLP,
  useMutation,
  useServer,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { typedGql, scalars, $, GraphQLTypes } from '@deenruv/admin-types';
import { Stack } from '@/components';
import { toast } from 'sonner';

interface RolesCardProps {
  customerId: string;
  address?: CustomerAddressType;
  onActionCompleted: () => void;
}

const CreateCustomerAddressMutation = typedGql('mutation', { scalars })({
  createCustomerAddress: [
    { customerId: $('customerId', 'ID!'), input: $('input', 'CreateAddressInput!') },
    { id: true },
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
  const [createAddress] = useMutation(CreateCustomerAddressMutation);
  const [updateAddress] = useMutation(UpdateCustomerAddressMutation);
  const { t } = useTranslation('customers');
  const countries = useServer((p) => p.countries);
  const [open, setOpen] = useState(false);
  const isEdit = useMemo(() => !!address, [address]);

  const { state, setField, checkIfAllFieldsAreValid } = useGFFLP(
    'CreateAddressInput',
    'city',
    'company',
    'countryCode',
    'fullName',
    'phoneNumber',
    'postalCode',
    'streetLine1',
    'streetLine2',
    'province',
  )({
    fullName: {
      initialValue: address?.fullName,
      validate: (v) => {
        if (!v || v === '') return [t('selectAddress.nameRequired')];
      },
    },
    company: { initialValue: '' },
    streetLine1: {
      initialValue: address?.streetLine1,
      validate: (v) => {
        if (!v || v === '') return [t('selectAddress.streetRequired')];
      },
    },
    streetLine2: { initialValue: '' },
    postalCode: {
      initialValue: address?.streetLine2,
      validate: (v) => {
        if (!v || v === '') return [t('selectAddress.postalCodeRequired')];
      },
    },
    countryCode: {
      initialValue: address?.country.code,
      validate: (v) => {
        if (!v || v === '') return [t('selectAddress.countryRequired')];
      },
    },
    phoneNumber: {
      initialValue: address?.phoneNumber,
      validate: (v) => {
        if (!v || v === '') return [t('selectAddress.phoneNumberRequired')];
      },
    },
    city: {
      initialValue: address?.city,
      validate: (v) => {
        if (!v || v === '') return [t('selectAddress.cityRequired')];
      },
    },
    province: { initialValue: address?.province },
  });

  const handleSubmit = useCallback(async () => {
    const valid = checkIfAllFieldsAreValid();
    if (!valid) return;

    const input: GraphQLTypes['CreateAddressInput'] = {
      countryCode: state.countryCode!.validatedValue,
      streetLine1: state.streetLine1!.validatedValue,
      streetLine2: state.streetLine2!.validatedValue,
      city: state.city!.validatedValue,
      company: state.company!.validatedValue,
      fullName: state.fullName!.validatedValue,
      phoneNumber: state.phoneNumber!.validatedValue,
      postalCode: state.postalCode!.validatedValue,
      province: state.province?.validatedValue,
    };

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
  }, [state, isEdit, customerId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col">
        <DialogHeader className="mb-4">
          <DialogTitle>{t(isEdit ? 'selectAddress.editAddress' : 'selectAddress.createAddress')}</DialogTitle>
        </DialogHeader>
        <Stack column className="gap-3 overflow-auto">
          <Input
            label={t('selectAddress.inputNameLabel')}
            placeholder={t('selectAddress.inputNamePlaceholder')}
            value={state.fullName?.value}
            defaultValue={state?.fullName?.value}
            onChange={(e) => setField('fullName', e.target.value)}
            errors={state.fullName?.errors}
            required
          />

          <Input
            label={t('selectAddress.inputCompanyLabel')}
            placeholder={t('selectAddress.inputCompanyPlaceholder')}
            value={state.company?.value}
            defaultValue={state?.company?.value}
            onChange={(e) => setField('company', e.target.value)}
            errors={state.company?.errors}
          />

          <Input
            label={t('selectAddress.inputStreetLabel')}
            placeholder={t('selectAddress.inputStreetPlaceholder')}
            value={state.streetLine1?.value}
            defaultValue={state?.streetLine1?.value}
            onChange={(e) => setField('streetLine1', e.target.value)}
            errors={state.streetLine1?.errors}
            required
          />

          <Input
            label={t('selectAddress.inputStreet2Label')}
            placeholder={t('selectAddress.inputStreet2Placeholder')}
            value={state.streetLine2?.value}
            defaultValue={state?.streetLine2?.value}
            onChange={(e) => setField('streetLine2', e.target.value)}
            errors={state.streetLine2?.errors}
          />

          <Input
            label={t('selectAddress.inputCityLabel')}
            placeholder={t('selectAddress.inputCityPlaceholder')}
            defaultValue={state?.city?.value}
            onChange={(e) => setField('city', e.target.value)}
            errors={state.city?.errors}
            required
          />

          <Input
            label={t('selectAddress.inputProvinceLabel')}
            placeholder={t('selectAddress.inputProvincePlaceholder')}
            defaultValue={state?.province?.value}
            onChange={(e) => setField('province', e.target.value)}
            errors={state.province?.errors}
          />

          <Input
            label={t('selectAddress.inputPostalLabel')}
            placeholder={t('selectAddress.inputPostalPlaceholder')}
            value={state.postalCode?.value}
            defaultValue={state?.postalCode?.value}
            onChange={(e) => setField('postalCode', e.target.value)}
            errors={state.postalCode?.errors}
            required
          />

          <Input
            label={t('selectAddress.inputPhoneLabel')}
            placeholder={t('selectAddress.inputPhonePlaceholder')}
            value={state.phoneNumber?.value}
            defaultValue={state?.phoneNumber?.value}
            onChange={(e) => setField('phoneNumber', e.target.value)}
            errors={state.phoneNumber?.errors}
            required
          />

          <SimpleSelect
            label={t('selectAddress.countrySelectLabel')}
            options={countries.map((c) => ({ label: c.name, value: c.code }))}
            value={state.countryCode?.value}
            onValueChange={(value) => setField('countryCode', value)}
            errors={state.countryCode?.errors}
            required
          />
        </Stack>
        <DialogFooter className="mt-2">
          <Button variant="action" className="w-min place-self-end" onClick={handleSubmit}>
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
