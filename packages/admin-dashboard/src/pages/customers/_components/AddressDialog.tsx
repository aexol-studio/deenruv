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
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useGFFLP,
  useMutation,
  useServer,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { typedGql, scalars, $, GraphQLTypes } from '@deenruv/admin-types';

interface RolesCardProps {
  customerId: string;
  address?: CustomerAddressType;
}

const CreateCustomerAddressMutation = typedGql('mutation', { scalars })({
  createCustomerAddress: [
    { customerId: $('customerId', 'ID!'), input: $('input', 'CreateAddressInput') },
    { id: true },
  ],
});

const UpdateCustomerAddressMutation = typedGql('mutation', { scalars })({
  updateCustomerAddress: [
    { customerId: $('customerId', 'ID!'), input: $('input', 'UpdateAddressInput') },
    { id: true },
  ],
});

export const AddressDialog: React.FC<PropsWithChildren<RolesCardProps>> = ({ address, customerId, children }) => {
  const [createAddress] = useMutation(CreateCustomerAddressMutation);
  const [updateAddress] = useMutation(UpdateCustomerAddressMutation);
  const { t } = useTranslation('customers');
  const countries = useServer((p) => p.countries);
  const [open, setOpen] = useState(false);
  const isEdit = useMemo(() => !!address, [address]);

  const { state, setField } = useGFFLP(
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
    },
  });

  const handleSubmit = useCallback(() => {
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
      ? updateAddress({ customerId, input: { ...input, id: address?.id! } })
      : createAddress({ customerId, input });
  }, [state, isEdit]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
        {/* <Edit size={20} className="cursor-pointer self-center" onClick={() => setOpen(true)} /> */}
      </DialogTrigger>
      <DialogContent className="flex h-[80vh] max-h-[80vh] min-h-[80vh] flex-col">
        <DialogHeader>
          <DialogTitle>{t('selectAddress.selectAddress')}</DialogTitle>
        </DialogHeader>
        <ScrollArea>
          <Input
            label={t('selectAddress.inputNameLabel')}
            placeholder={t('selectAddress.inputNamePlaceholder')}
            value={state.fullName?.value}
            defaultValue={state?.fullName?.value}
            onChange={(e) => setField('fullName', e.target.value)}
            required
          />
          <p className="text-destructive mb-2  mt-1 min-h-5 border-orange-800 text-sm font-medium">
            {(state.fullName?.errors || []).toString()}
          </p>
          <Input
            label={t('selectAddress.inputStreetLabel')}
            placeholder={t('selectAddress.inputStreetPlaceholder')}
            value={state.streetLine1?.value}
            defaultValue={state?.streetLine1?.value}
            onChange={(e) => setField('streetLine1', e.target.value)}
            required
          />
          <p className="text-destructive mb-2  mt-1 min-h-5 border-orange-800 text-sm font-medium">
            {(state.streetLine1?.errors || []).toString()}
          </p>
          <Input
            label={t('selectAddress.inputStreet2Label')}
            placeholder={t('selectAddress.inputStreet2Placeholder')}
            value={state.streetLine2?.value}
            defaultValue={state?.streetLine2?.value}
            onChange={(e) => setField('streetLine2', e.target.value)}
          />
          <p className="text-destructive mb-2  mt-1 min-h-5 border-orange-800 text-sm font-medium">
            {(state.streetLine2?.errors || []).toString()}
          </p>
          <Input
            label={t('selectAddress.inputCityLabel')}
            placeholder={t('selectAddress.inputCityPlaceholder')}
            defaultValue={state?.city?.value}
            onChange={(e) => setField('city', e.target.value)}
            required
          />
          <p className="text-destructive mb-2  mt-1 min-h-5 border-orange-800 text-sm font-medium">
            {(state.city?.errors || []).toString()}
          </p>
          <Input
            label={t('selectAddress.inputProvinceLabel')}
            placeholder={t('selectAddress.inputProvincePlaceholder')}
            defaultValue={state?.province?.value}
            onChange={(e) => setField('province', e.target.value)}
          />
          <p className="text-destructive mb-2  mt-1 min-h-5 border-orange-800 text-sm font-medium">
            {(state.province?.errors || []).toString()}
          </p>
          <Input
            label={t('selectAddress.inputPostalLabel')}
            placeholder={t('selectAddress.inputPostalPlaceholder')}
            value={state.postalCode?.value}
            defaultValue={state?.postalCode?.value}
            onChange={(e) => setField('postalCode', e.target.value)}
            required
          />
          <p className="text-destructive mb-2  mt-1 min-h-5 border-orange-800 text-sm font-medium">
            {(state.postalCode?.errors || []).toString()}
          </p>
          <Input
            label={t('selectAddress.inputPhoneLabel')}
            placeholder={t('selectAddress.inputPhonePlaceholder')}
            value={state.phoneNumber?.value}
            defaultValue={state?.phoneNumber?.value}
            onChange={(e) => setField('phoneNumber', e.target.value)}
            required
          />
          <p className="text-destructive mb-2  mt-1 min-h-5 border-orange-800 text-sm font-medium">
            {(state.phoneNumber?.errors || []).toString()}
          </p>
          <div className="flex flex-row items-center gap-2">
            <Label
              htmlFor="createForCustomer"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {t('selectAddress.countrySelectLabel')}
            </Label>
            <Select value={state.countryCode?.value} onValueChange={(value) => setField('countryCode', value)} required>
              <SelectTrigger className="my-2 ml-1 w-auto">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <p className="text-destructive mb-2  mt-1 min-h-5 border-orange-800 text-sm font-medium">
            {(state.countryCode?.errors || []).toString()}
          </p>
        </ScrollArea>
        <DialogFooter>
          <Button className="w-min place-self-end" onClick={handleSubmit}>
            {t('customers.save')}
          </Button>
          <Button className="w-min place-self-end">{t('customers.cancel')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
