'use client';

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  useServer,
  apiClient,
  useOrder,
  cn,
  OrderDetailSelector,
} from '@deenruv/react-ui-devkit';
import { type AddressBaseType, addressBaseSelector } from '@/graphql/draft_order';
import { useGFFLP } from '@/lists/useGflp';
import { Edit, MapPin, Home, Building, Check } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import type { ResolverInputTypes } from '@deenruv/admin-types';

type DefaultAddress = AddressBaseType & {
  id?: string | null;
  defaultBillingAddress?: boolean | null;
  defaultShippingAddress?: boolean | null;
  country?: { code?: string | null; name?: string | null } | null;
};

export const AddressCard: React.FC<{
  type: 'shipping' | 'billing';
}> = ({ type }) => {
  const [tab, setTab] = useState<'select' | 'create'>('select');
  const { mode, order, modifiedOrder, setModifiedOrder, setOrder } = useOrder();
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

  const currentAddress = useMemo(() => {
    return type === 'shipping' &&
      currentOrder?.shippingAddress &&
      currentOrder.shippingAddress.streetLine1 &&
      currentOrder.shippingAddress.countryCode
      ? currentOrder.shippingAddress
      : type === 'billing' &&
          currentOrder?.billingAddress &&
          currentOrder.billingAddress.countryCode &&
          currentOrder.billingAddress.streetLine1
        ? currentOrder.billingAddress
        : undefined;
  }, [currentOrder, type]);

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

    const { setDraftOrderShippingAddress, setDraftOrderBillingAddress } = await apiClient('mutation')(
      type === 'shipping'
        ? { setDraftOrderShippingAddress: [{ orderId: order.id, input: newAddress }, OrderDetailSelector] }
        : { setDraftOrderBillingAddress: [{ orderId: order.id, input: newAddress }, OrderDetailSelector] },
    );
    if (setDraftOrderShippingAddress || setDraftOrderBillingAddress) {
      setModifiedOrder(type === 'shipping' ? setDraftOrderShippingAddress : setDraftOrderBillingAddress);
      toast(
        t(tab === 'create' ? 'selectAddress.addressSuccessCreateToast' : 'selectAddress.addressSuccessSelectToast'),
      );
      setSubmitting(false);
      setOrder(setDraftOrderShippingAddress ? setDraftOrderShippingAddress : setDraftOrderBillingAddress);
      setOpen(false);
    } else {
      toast.error(
        t(tab === 'create' ? 'selectAddress.addressFailedCreateToast' : 'selectAddress.addressFailedSelectToast'),
      );
    }
    if (tab === 'create' && createForCustomer && order.customer?.id) {
      const { createCustomerAddress } = await apiClient('mutation')({
        createCustomerAddress: [{ customerId: order.customer.id, input: newAddress }, addressBaseSelector],
      });
      if (createCustomerAddress.streetLine1) {
        toast.success(t('selectAddress.newAddress', { address: createCustomerAddress.streetLine1 }));
        setSelectedAddress(createCustomerAddress);
        setTab('select');
        setCreateForCustomer(false);
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
          ...currentAddress,
          countryCode: currentAddress.countryCode || '',
          streetLine1: currentAddress.streetLine1 || '',
        });
    }
  }, [currentAddress, order, type]);

  const cardBorderColor = useMemo(() => {
    if (mode !== 'create') return 'border-primary';
    return currentAddress?.streetLine1 ? 'border-green-500' : 'border-orange-500';
  }, [mode, currentAddress?.streetLine1]);

  const StatusIcon = useMemo(() => {
    return currentAddress?.streetLine1 ? Check : isShipping ? MapPin : Building;
  }, [currentAddress?.streetLine1, isShipping]);

  const statusColor = useMemo(() => {
    return currentAddress?.streetLine1 ? 'text-green-500' : 'text-orange-500';
  }, [currentAddress?.streetLine1]);

  return (
    <Card className={cn('shadow-sm transition-all duration-200 hover:shadow-md', cardBorderColor)}>
      <CardHeader className="pb-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isShipping ? <MapPin className="text-primary h-5 w-5" /> : <Building className="text-primary h-5 w-5" />}
            <CardTitle className="text-base font-semibold">
              {t(isShipping ? 'selectAddress.shippingHeader' : 'selectAddress.billingHeader')}
            </CardTitle>
          </div>
          {mode !== 'view' && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <div className="bg-primary/10 hover:bg-primary/20 cursor-pointer rounded-full p-1.5 transition-colors">
                  <Edit size={16} className="text-primary" onClick={() => setOpen(true)} />
                </div>
              </DialogTrigger>
              <DialogContent className="flex h-[80vh] max-h-[80vh] min-h-[80vh] flex-col">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    {isShipping ? (
                      <MapPin className="text-primary h-5 w-5" />
                    ) : (
                      <Building className="text-primary h-5 w-5" />
                    )}
                    {t('selectAddress.selectAddress')}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-2">
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
                    <TabsList className="my-4 grid w-full grid-cols-2">
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
                    <ScrollArea className="pr-4">
                      <div className="flex flex-col gap-3 px-1">
                        {order?.customer?.addresses?.map((address, index) => (
                          <Card
                            key={`${address.id}-${index}`}
                            className={cn(
                              'flex cursor-pointer items-start justify-between gap-4 p-4 transition-all',
                              'hover:border-primary/70 hover:shadow-sm',
                              selectedAddress?.id === address.id
                                ? 'border-primary bg-primary/5 shadow-sm'
                                : 'border-border',
                            )}
                            onClick={() => setSelectedAddress(address)}
                          >
                            <div className="flex-1">
                              <div className="mb-1 flex items-center gap-2">
                                <Home className="text-primary h-4 w-4" />
                                <p className="font-medium">{address.fullName}</p>
                                {selectedAddress?.id === address.id && (
                                  <div className="ml-auto">
                                    <Check className="text-primary h-4 w-4" />
                                  </div>
                                )}
                              </div>
                              <CardDescription className="text-sm">
                                {`${address.streetLine1} ${address.streetLine2 ? ', ' + address.streetLine2 : ''}`}
                              </CardDescription>
                              <CardDescription className="text-sm">
                                {`${address.postalCode} ${address.city} ${address.country?.name || address.country?.code}`}
                              </CardDescription>
                              <CardDescription className="text-sm">
                                {`${t('selectAddress.phoneNumberShort', { value: address.phoneNumber })} ${address.company} `}
                              </CardDescription>
                              <div className="mt-2 flex gap-2">
                                {address.defaultBillingAddress && (
                                  <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                                    {t('selectAddress.isDefaultBilling')}
                                  </span>
                                )}
                                {address.defaultShippingAddress && (
                                  <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                                    {t('selectAddress.isDefaultShipping')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div
                              className="bg-primary/10 hover:bg-primary/20 rounded-full p-1.5 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setState({ countryCode: address.country?.code || '', ...address });
                                setTab('create');
                              }}
                            >
                              <Edit size={16} className="text-primary" />
                            </div>
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
                    <ScrollArea className="pr-4">
                      <div className="space-y-4 px-1">
                        <div className="space-y-1">
                          <Label htmlFor="fullName" className="text-sm font-medium">
                            {t('selectAddress.inputNameLabel')} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="fullName"
                            placeholder={t('selectAddress.inputNamePlaceholder')}
                            value={state.fullName?.value ?? undefined}
                            defaultValue={state?.fullName?.value ?? undefined}
                            onChange={(e) => setField('fullName', e.target.value)}
                            className={cn(state.fullName?.errors?.length && 'border-red-300')}
                            required
                            errors={state.fullName?.errors}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="streetLine1" className="text-sm font-medium">
                            {t('selectAddress.inputStreetLabel')} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="streetLine1"
                            placeholder={t('selectAddress.inputStreetPlaceholder')}
                            value={state.streetLine1?.value}
                            defaultValue={state?.streetLine1?.value}
                            onChange={(e) => setField('streetLine1', e.target.value)}
                            className={cn(state.streetLine1?.errors?.length && 'border-red-300')}
                            required
                            errors={state.streetLine1?.errors}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="streetLine2" className="text-sm font-medium">
                            {t('selectAddress.inputStreet2Label')}
                          </Label>
                          <Input
                            id="streetLine2"
                            placeholder={t('selectAddress.inputStreet2Placeholder')}
                            value={state.streetLine2?.value ?? undefined}
                            defaultValue={state?.streetLine2?.value ?? undefined}
                            onChange={(e) => setField('streetLine2', e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor="city" className="text-sm font-medium">
                              {t('selectAddress.inputCityLabel')} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="city"
                              placeholder={t('selectAddress.inputCityPlaceholder')}
                              defaultValue={currentAddress?.city ?? undefined}
                              onChange={(e) => setField('city', e.target.value)}
                              className={cn(state.city?.errors?.length && 'border-red-300')}
                              required
                              errors={state.city?.errors}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="province" className="text-sm font-medium">
                              {t('selectAddress.inputProvinceLabel')}
                            </Label>
                            <Input
                              id="province"
                              placeholder={t('selectAddress.inputProvincePlaceholder')}
                              defaultValue={currentAddress?.province ?? undefined}
                              onChange={(e) => setField('province', e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label htmlFor="postalCode" className="text-sm font-medium">
                              {t('selectAddress.inputPostalLabel')} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="postalCode"
                              placeholder={t('selectAddress.inputPostalPlaceholder')}
                              value={state.postalCode?.value ?? undefined}
                              defaultValue={state?.postalCode?.value ?? undefined}
                              onChange={(e) => setField('postalCode', e.target.value)}
                              className={cn(state.postalCode?.errors?.length && 'border-red-300')}
                              required
                              errors={state.postalCode?.errors}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="phoneNumber" className="text-sm font-medium">
                              {t('selectAddress.inputPhoneLabel')} <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="phoneNumber"
                              placeholder={t('selectAddress.inputPhonePlaceholder')}
                              value={state.phoneNumber?.value ?? undefined}
                              defaultValue={state?.phoneNumber?.value ?? undefined}
                              onChange={(e) => setField('phoneNumber', e.target.value)}
                              className={cn(state.phoneNumber?.errors?.length && 'border-red-300')}
                              required
                              errors={state.phoneNumber?.errors}
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor="country" className="text-sm font-medium">
                            {t('selectAddress.countrySelectLabel')} <span className="text-red-500">*</span>
                          </Label>
                          <Select
                            value={state.countryCode?.value}
                            onValueChange={(value) => setField('countryCode', value)}
                            required
                          >
                            <SelectTrigger id="country" className="w-full">
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
                          {(state.countryCode?.errors || [])?.length > 0 && (
                            <p className="text-destructive mt-1 text-xs">
                              {(state.countryCode?.errors || []).toString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 py-2">
                          <Checkbox
                            id="createForCustomer"
                            checked={createForCustomer}
                            onCheckedChange={() => setCreateForCustomer((p) => !p)}
                          />
                          <Label
                            htmlFor="createForCustomer"
                            className="cursor-pointer text-sm font-medium leading-none"
                          >
                            {t('selectAddress.createForCustomer')}
                          </Label>
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
                <div className="mt-4 flex justify-end">
                  <Button
                    className="px-6"
                    disabled={submitting || (tab === 'select' && !selectedAddress)}
                    onClick={submitAddress}
                  >
                    {submitting
                      ? t('common.submitting')
                      : t(tab === 'select' ? 'selectAddress.selectAddress' : 'selectAddress.editAddress')}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <CardDescription className="text-muted-foreground mb-3 text-sm">
          {t(isShipping ? 'selectAddress.shippingDescription' : 'selectAddress.billingDescription')}
        </CardDescription>
        <div className="bg-muted/50 border-border mt-2 rounded-lg border p-3">
          <div className="flex items-start gap-3">
            <StatusIcon className={cn('mt-0.5 h-5 w-5', statusColor)} />
            <div className="flex-1">
              {!currentAddress ? (
                <p className="text-muted-foreground text-sm italic">
                  {t(isShipping ? 'selectAddress.noShippingAddress' : 'selectAddress.noBillingAddress')}
                </p>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-medium">{currentAddress?.fullName}</p>
                  <p className="text-sm">
                    {currentAddress.streetLine1} {currentAddress?.streetLine2}
                  </p>
                  <p className="text-sm">
                    {currentAddress.city} {currentAddress.postalCode} {currentAddress.province} {currentAddress.country}
                  </p>
                  <div className="border-border mt-1 flex items-center justify-between border-t pt-1">
                    <span className="text-muted-foreground text-sm">
                      {currentAddress.company && `${currentAddress.company} • `}
                      {currentAddress.phoneNumber &&
                        t('selectAddress.phoneNumberShort', { value: currentAddress.phoneNumber })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
