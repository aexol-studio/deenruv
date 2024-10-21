import { apiCall } from '@/graphql/client';
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  SelectGroup,
  CardDescription,
  Checkbox,
  Label,
  SelectItem,
  ScrollArea,
} from '@/components';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddressBaseType, addressBaseSelector, draftOrderSelector } from '@/graphql/draft_order';
import { cn } from '@/lib/utils';
import { useGFFLP } from '@/lists/useGflp';
import { useServer } from '@/state/server';
import { phoneNumberRegExp } from '@/utils/regExp';
import { Edit } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ResolverInputTypes } from '@/zeus';
import { useOrder } from '@/state/order';

type DefaultAddress = AddressBaseType & {
  id?: string;
  defaultBillingAddress?: boolean;
  defaultShippingAddress?: boolean;
  country?: { code?: string; name?: string };
};

export const AddressCard: React.FC<{
  type: 'shipping' | 'billing';
}> = ({ type }) => {
  const { mode, order, modifiedOrder, setModifiedOrder } = useOrder();
  const currentOrder = useMemo(
    () => (mode === 'update' ? (modifiedOrder ? modifiedOrder : order) : order),
    [mode, order, modifiedOrder],
  );
  const { t } = useTranslation('orders');
  const countries = useServer((p) => p.countries);

  const [createForCustomer, setCreateForCustomer] = useState(false);
  // const [createAsDefault, setCreateAsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const currentAddress = useMemo(
    () =>
      type === 'shipping' &&
      currentOrder?.shippingAddress &&
      currentOrder.shippingAddress.streetLine1 &&
      currentOrder.shippingAddress.countryCode
        ? currentOrder.shippingAddress
        : type === 'billing' &&
            currentOrder?.billingAddress &&
            currentOrder.billingAddress.countryCode &&
            currentOrder.billingAddress.streetLine1
          ? currentOrder.billingAddress
          : undefined,
    [currentOrder, type],
  );

  const [tab, setTab] = useState<'select' | 'create'>('create');

  const [selectedAddress, setSelectedAddress] = useState<DefaultAddress | undefined>(undefined);

  const isShipping = type === 'shipping';

  const { state, setField, checkIfAllFieldsAreValid, setState } = useGFFLP(
    'CreateAddressInput',
    'city',
    'company',
    'countryCode',
    'postalCode',
    'fullName',
    'phoneNumber',
    'postalCode',
    'streetLine1',
    'streetLine2',
    'province',
    'customFields',
  )({
    fullName: {
      initialValue: '',
      validate: (v) => {
        if (!v || v === '') return [t('selectAddress.nameRequired')];
      },
    },
    company: { initialValue: '' },
    streetLine1: {
      initialValue: '',
      validate: (v) => {
        if (!v || v === '') return [t('selectAddress.streetRequired')];
      },
    },
    streetLine2: { initialValue: '' },
    postalCode: {
      initialValue: '',
      validate: (v) => {
        if (!v || v === '') return [t('selectAddress.postalCodeRequired')];
      },
    },
    countryCode: {
      initialValue: '',
      validate: (v) => {
        if (!v || v === '') return [t('selectAddress.countryRequired')];
      },
    },
    phoneNumber: {
      initialValue: '',
      validate: (v) => {
        if (!v || v === '') return [t('selectAddress.phoneNumberRequired')];
        if (!phoneNumberRegExp.test(v)) return [t('selectAddress.phoneError')];
      },
    },
    city: {
      initialValue: '',
      validate: (v) => {
        if (!v || v === '') return [t('selectAddress.cityRequired')];
      },
    },
    province: { initialValue: '' },
  });

  const submitAddress = async () => {
    if (!order) return;
    if (tab === 'select' && !selectedAddress) return;
    const isValid = checkIfAllFieldsAreValid();
    if (tab === 'create' && !isValid) return;

    if (mode === 'update' && selectedAddress && modifiedOrder) {
      const addressTypeKey = type === 'shipping' ? 'shippingAddress' : 'billingAddress';

      setModifiedOrder({
        ...modifiedOrder,
        [addressTypeKey]: {
          fullName: selectedAddress.fullName,
          company: selectedAddress.company,
          streetLine1: selectedAddress.streetLine1,
          streetLine2: selectedAddress.streetLine2,
          countryCode: selectedAddress.country?.code || '',
          city: selectedAddress.city,
          phoneNumber: selectedAddress.phoneNumber,
          postalCode: selectedAddress.postalCode,
          province: selectedAddress.province,
        },
      });

      setOpen(false);
      return;
    }

    setSubmitting(true);
    const newAddress: ResolverInputTypes['CreateAddressInput'] =
      tab === 'select' && selectedAddress
        ? {
            fullName: selectedAddress.fullName,
            company: selectedAddress.company,
            streetLine1: selectedAddress.streetLine1,
            streetLine2: selectedAddress.streetLine2,
            countryCode: selectedAddress.country?.code || '',
            city: selectedAddress.city,
            phoneNumber: selectedAddress.phoneNumber,
            postalCode: selectedAddress.postalCode,
            province: selectedAddress.province,
          }
        : {
            fullName: state.fullName?.validatedValue,
            company: state.company?.validatedValue,
            streetLine1: state.streetLine1?.validatedValue || '',
            streetLine2: state.streetLine2?.validatedValue,
            postalCode: state.postalCode?.validatedValue,
            countryCode: state.countryCode?.validatedValue || '',
            phoneNumber: state.phoneNumber?.validatedValue,
            city: state.city?.validatedValue,
            province: state.province?.validatedValue,
          };

    const { setDraftOrderShippingAddress, setDraftOrderBillingAddress } = await apiCall()('mutation')(
      type === 'shipping'
        ? { setDraftOrderShippingAddress: [{ orderId: order.id, input: newAddress }, draftOrderSelector] }
        : { setDraftOrderBillingAddress: [{ orderId: order.id, input: newAddress }, draftOrderSelector] },
    );
    if (setDraftOrderShippingAddress || setDraftOrderBillingAddress) {
      setModifiedOrder(type === 'shipping' ? setDraftOrderShippingAddress : setDraftOrderBillingAddress);
      toast(
        t(tab === 'create' ? 'selectAddress.addressSuccessCreateToast' : 'selectAddress.addressSuccessSelectToast'),
      );
      setSubmitting(false);
      setOpen(false);
    } else {
      toast.error(
        t(tab === 'create' ? 'selectAddress.addressFailedCreateToast' : 'selectAddress.addressFailedSelectToast'),
      );
    }
    if (tab === 'create' && createForCustomer && order.customer?.id) {
      const { createCustomerAddress } = await apiCall()('mutation')({
        createCustomerAddress: [
          {
            customerId: order.customer.id,
            input: newAddress,
          },
          addressBaseSelector,
        ],
      });
      // {
      //   ...newAddress,
      //   ...(createAsDefault && type === 'billing' && { defaultBillingAddress: true }),
      //   ...(createAsDefault && type === 'shipping' && { defaultShippingAddress: true }),
      // },
      if (createCustomerAddress.streetLine1) {
        toast.success(t('selectAddress.newAddress', { address: createCustomerAddress.streetLine1 }));
        setSelectedAddress(createCustomerAddress);
        setTab('select');
        setCreateForCustomer(false);
        // setCreateAsDefault(false);
      } else {
        toast.error(t('selectAddress.addressAddFailed'));
      }
    }
  };

  useEffect(() => {
    if (!currentAddress || Object.values(currentAddress).every((x) => x === null || x === '')) {
      const defaultAddress = order?.customer?.addresses?.find((i) =>
        type === 'billing' ? !!i.defaultBillingAddress : !!i.defaultShippingAddress,
      );
      if (defaultAddress) {
        setTab('select');
        setSelectedAddress(defaultAddress);
        return;
      }
    }
    const sameAddressInSaved =
      currentAddress &&
      order?.customer?.addresses?.find(
        (i) =>
          i.streetLine1 === currentAddress.streetLine1 &&
          i.city === currentAddress.city &&
          i.company === currentAddress.company &&
          i.fullName === currentAddress.fullName &&
          i.postalCode === currentAddress.postalCode &&
          i.province === currentAddress.province &&
          i.streetLine2 === currentAddress.streetLine2 &&
          i.phoneNumber === currentAddress.phoneNumber &&
          i.country.code === currentAddress.countryCode &&
          i.country.name === currentAddress.country,
      );

    if (sameAddressInSaved) {
      setTab('select');
      setSelectedAddress(sameAddressInSaved);
      setState({ countryCode: sameAddressInSaved.country?.code || '', ...sameAddressInSaved });
    } else {
      setTab('create');
      setSelectedAddress(undefined);
      currentAddress &&
        setState({
          countryCode: currentAddress.countryCode || '',
          streetLine1: currentAddress.streetLine1 || '',
          ...currentAddress,
        });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAddress, order, type]);

  return (
    <Card
      className={cn(
        mode !== 'create' ? 'border-primary' : currentAddress?.streetLine1 ? 'border-green-500' : 'border-orange-800',
      )}
    >
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">
          {t(isShipping ? 'selectAddress.shippingHeader' : 'selectAddress.billingHeader')}
        </CardTitle>
        {mode !== 'view' && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Edit size={20} className="cursor-pointer self-center" onClick={() => setOpen(true)} />
            </DialogTrigger>
            <DialogContent className="flex h-[80vh] max-h-[80vh] min-h-[80vh] flex-col">
              <DialogHeader>
                <DialogTitle>{t('selectAddress.selectAddress')}</DialogTitle>
                <DialogDescription>
                  {isShipping
                    ? order?.customer?.addresses?.length
                      ? t('selectAddress.selectShippingAddress')
                      : t('selectAddress.createShippingAddress')
                    : order?.customer?.addresses?.length
                      ? t('selectAddress.selectBillingAddress')
                      : t('selectAddress.createBillingAddress')}
                </DialogDescription>
              </DialogHeader>
              <Tabs
                value={tab}
                defaultValue={tab}
                onValueChange={(e) => setTab(e as 'select' | 'create')}
                className="flex flex-1 basis-1 flex-col overflow-hidden"
              >
                {order?.customer?.addresses?.length ? (
                  <TabsList className="my-4 w-full">
                    <TabsTrigger className="w-full" value="select">
                      {t('selectAddress.selectAddress')}
                    </TabsTrigger>
                    <TabsTrigger className="w-full" value="create" onClick={() => setSelectedAddress(undefined)}>
                      {t('selectAddress.editAddress')}
                    </TabsTrigger>
                  </TabsList>
                ) : null}
                <TabsContent
                  value="select"
                  className={cn(
                    'flex flex-1 flex-col overflow-hidden focus-visible:ring-transparent',
                    tab !== 'select' && 'hidden',
                  )}
                >
                  <ScrollArea>
                    <div className="flex flex-col gap-2 px-4">
                      {order?.customer?.addresses?.map((address, index) => (
                        <Card
                          key={`${address.id}-${index}`}
                          className={cn(
                            'flex cursor-pointer items-start justify-between gap-4 p-4',
                            selectedAddress?.id === address.id && 'border-primary',
                          )}
                          onClick={() => setSelectedAddress(address)}
                        >
                          <div>
                            <CardDescription>{`${address.fullName} ${address.streetLine1} ${address.streetLine2 ? ', ' + address.streetLine2 : ''}`}</CardDescription>
                            <CardDescription>{`${address.postalCode} ${address.city} ${address.country?.name || address.country?.code}`}</CardDescription>
                            <CardDescription>{`${t('selectAddress.phoneNumberShort', { value: address.phoneNumber })} ${address.company} `}</CardDescription>
                            {address.defaultBillingAddress && (
                              <CardDescription className="pt-2 text-primary">
                                {t('selectAddress.isDefaultBilling')}
                              </CardDescription>
                            )}
                            {address.defaultBillingAddress && (
                              <CardDescription className="pt-2 text-primary">
                                {t('selectAddress.isDefaultShipping')}
                              </CardDescription>
                            )}
                          </div>
                          <Edit
                            onClick={(e) => {
                              e.stopPropagation();
                              setState({ countryCode: address.country?.code || '', ...address });
                              setTab('create');
                            }}
                          />
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>
                <TabsContent
                  value="create"
                  className={cn(
                    'flex flex-1 flex-col overflow-hidden focus-visible:ring-transparent',
                    tab !== 'create' && 'hidden',
                  )}
                >
                  <ScrollArea>
                    <Input
                      label={t('selectAddress.inputNameLabel')}
                      placeholder={t('selectAddress.inputNamePlaceholder')}
                      value={state.fullName?.value}
                      defaultValue={state?.fullName?.value}
                      onChange={(e) => setField('fullName', e.target.value)}
                      required
                    />
                    <p className="mb-2 mt-1  min-h-5 border-orange-800 text-sm font-medium text-destructive">
                      {(state.fullName?.errors || []).toString()}
                    </p>
                    <Input
                      label={t('selectAddress.inputCompanyLabel')}
                      placeholder={t('selectAddress.inputCompanyPlaceholder')}
                      value={state.customFields?.value?.companyName}
                      defaultValue={state?.customFields?.value?.companyName}
                      onChange={(e) => setField('customFields', { companyName: e.target.value })}
                    />
                    <p className="mb-2 mt-1 min-h-5" />
                    <Input
                      label={t('selectAddress.inputTaxLabel')}
                      placeholder={t('selectAddress.inputTaxPlaceholder')}
                      value={state.customFields?.value?.companyTaxId}
                      defaultValue={state?.customFields?.value?.companyTaxId}
                      onChange={(e) => setField('customFields', { companyTaxId: e.target.value })}
                    />
                    <p className="mb-2 mt-1  min-h-5 border-orange-800 text-sm font-medium text-destructive">
                      {(state.customFields?.errors || []).toString()}
                    </p>
                    <Input
                      label={t('selectAddress.inputStreetLabel')}
                      placeholder={t('selectAddress.inputStreetPlaceholder')}
                      value={state.streetLine1?.value}
                      defaultValue={state?.streetLine1?.value}
                      onChange={(e) => setField('streetLine1', e.target.value)}
                      required
                    />
                    <p className="mb-2 mt-1  min-h-5 border-orange-800 text-sm font-medium text-destructive">
                      {(state.streetLine1?.errors || []).toString()}
                    </p>
                    <Input
                      label={t('selectAddress.inputStreet2Label')}
                      placeholder={t('selectAddress.inputStreet2Placeholder')}
                      value={state.streetLine2?.value}
                      defaultValue={state?.streetLine2?.value}
                      onChange={(e) => setField('streetLine2', e.target.value)}
                    />
                    <p className="mb-2 mt-1  min-h-5 border-orange-800 text-sm font-medium text-destructive">
                      {(state.streetLine2?.errors || []).toString()}
                    </p>
                    <Input
                      label={t('selectAddress.inputCityLabel')}
                      placeholder={t('selectAddress.inputCityPlaceholder')}
                      defaultValue={currentAddress?.city}
                      onChange={(e) => setField('city', e.target.value)}
                      required
                    />
                    <p className="mb-2 mt-1  min-h-5 border-orange-800 text-sm font-medium text-destructive">
                      {(state.city?.errors || []).toString()}
                    </p>
                    <Input
                      label={t('selectAddress.inputProvinceLabel')}
                      placeholder={t('selectAddress.inputProvincePlaceholder')}
                      defaultValue={currentAddress?.province}
                      onChange={(e) => setField('province', e.target.value)}
                    />
                    <p className="mb-2 mt-1  min-h-5 border-orange-800 text-sm font-medium text-destructive">
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
                    <p className="mb-2 mt-1  min-h-5 border-orange-800 text-sm font-medium text-destructive">
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
                    <p className="mb-2 mt-1  min-h-5 border-orange-800 text-sm font-medium text-destructive">
                      {(state.phoneNumber?.errors || []).toString()}
                    </p>
                    <div className="flex flex-row items-center gap-2">
                      <Label
                        htmlFor="createForCustomer"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {t('selectAddress.countrySelectLabel')}
                      </Label>
                      <Select
                        value={state.countryCode?.value}
                        onValueChange={(value) => setField('countryCode', value)}
                        required
                      >
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
                    <p className="mb-2 mt-1  min-h-5 border-orange-800 text-sm font-medium text-destructive">
                      {(state.countryCode?.errors || []).toString()}
                    </p>

                    <div className="my-2 flex items-center space-x-2 py-2">
                      <Checkbox
                        id="createForCustomer"
                        hidden
                        value={'false'}
                        // value={createForCustomer ? 'true' : 'false'}
                        // onCheckedChange={() => setCreateForCustomer((p) => !p)}
                      />
                      {/* <Label
                          htmlFor="createForCustomer"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('selectAddress.createForCustomer')}
                        </Label> */}
                    </div>
                    {/* DO ZROBIENIA W PRZYSZŁOŚCI */}
                    {/* {createForCustomer && (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="createAsDefault"
                            value={createAsDefault ? 'true' : 'false'}
                            onCheckedChange={() => setCreateAsDefault((p) => !p)}
                          />
                          <Label
                            htmlFor="createAsDefault"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {t(isShipping ? 'selectAddress.setAsDefaultShipping' : 'selectAddress.setAsDefaultBilling')}
                          </Label>
                        </div>
                      )} */}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
              <Button
                className="w-min place-self-end"
                disabled={submitting || (tab === 'select' && !selectedAddress)}
                onClick={submitAddress}
              >
                {t(tab === 'select' ? 'selectAddress.selectAddress' : 'selectAddress.editAddress')}
              </Button>
            </DialogContent>
          </Dialog>
        )}
        <CardDescription className="pt-2">
          {!currentAddress ? (
            t(isShipping ? 'selectAddress.shippingDescription' : 'selectAddress.billingDescription')
          ) : (
            <Label className="flex flex-col ">
              <span className="block text-sm">{currentAddress?.fullName}</span>
              <span className="block text-sm">
                {currentAddress.streetLine1} {currentAddress?.streetLine2}
              </span>
              <span className="block text-sm">
                {currentAddress.city} {currentAddress.postalCode} {currentAddress.province} {currentAddress.country}
              </span>
              <span className="block text-sm">
                {currentAddress.company}{' '}
                {currentAddress.phoneNumber &&
                  t('selectAddress.phoneNumberShort', { value: currentAddress.phoneNumber })}
              </span>
            </Label>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
