'use client';

import {
  Card,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  CardDescription,
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
  CustomCard,
  useDeenruvForm,
  z,
  useTranslation,
  useMutation,
} from '@deenruv/react-ui-devkit';
import { type AddressBaseType, addressBaseSelector } from '@/graphql/draft_order';
import { Edit, MapPin, Building, Check, Loader2, User, Phone, Globe } from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import type { ResolverInputTypes } from '@deenruv/admin-types';
import { AddressForm } from '@/pages/customers/_components/AddressForm.js';
import { CreateCustomerAddressMutation } from '@/pages/customers/_components/AddressDialog.js';

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
  const { mode, order, modifiedOrder, setModifiedOrder, setBillingAddress, setShippingAddress, setOrder } = useOrder();
  const currentOrder = useMemo(
    () => (mode === 'update' ? (modifiedOrder ? modifiedOrder : order) : order),
    [mode, order, modifiedOrder],
  );
  const { t } = useTranslation('orders');
  const [createForCustomer, setCreateForCustomer] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [createAddress] = useMutation(CreateCustomerAddressMutation);

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

  const addressSchema = z.object({
    city: z.string().min(1, t('selectAddress.cityRequired')),
    company: z.string().default(''),
    countryCode: z.string().min(1, t('selectAddress.countryRequired')),
    postalCode: z.string().min(1, t('selectAddress.postalCodeRequired')),
    fullName: z.string().min(1, t('selectAddress.nameRequired')),
    phoneNumber: z.string().min(1, t('selectAddress.phoneNumberRequired')),
    streetLine1: z.string().min(1, t('selectAddress.streetRequired')),
    streetLine2: z.string().default(''),
    province: z.string().default(''),
    customFields: z.record(z.string(), z.any()).default({}),
  });
  const form = useDeenruvForm({
    schema: addressSchema,
    defaultValues: {
      fullName: '',
      company: '',
      streetLine1: '',
      streetLine2: '',
      postalCode: '',
      countryCode: '',
      phoneNumber: '',
      city: '',
      province: '',
      customFields: {},
    },
  });

  useEffect(() => {
    if (selectedAddress) {
      form.reset({
        ...form.getValues(),
        fullName: selectedAddress.fullName ?? '',
        company: selectedAddress.company ?? '',
        streetLine1: selectedAddress.streetLine1 ?? '',
        streetLine2: selectedAddress.streetLine2 ?? '',
        city: selectedAddress.city ?? '',
        postalCode: selectedAddress.postalCode ?? '',
        province: selectedAddress.province ?? '',
        phoneNumber: selectedAddress.phoneNumber ?? '',
        countryCode: selectedAddress.country?.code || '',
      });
    }
  }, [selectedAddress]);

  const submitAddress = async () => {
    if (!order?.customer?.id) return;
    if (!!order?.customer?.addresses?.length && tab === 'select' && !selectedAddress) return;

    const values = form.getValues();
    const input = {
      fullName: values.fullName,
      company: values.company,
      streetLine1: values.streetLine1 || '',
      streetLine2: values.streetLine2,
      countryCode: values.countryCode || '',
      city: values.city,
      phoneNumber: values.phoneNumber,
      postalCode: values.postalCode,
      province: values.province,
      ...(values.customFields && Object.keys(values.customFields).length > 0
        ? { customFields: values.customFields }
        : {}),
    };

    if (!order?.customer?.addresses?.length) {
      await createAddress({ customerId: order.customer.id, input }).then((resp) => {
        const addressTypeKey = type === 'shipping' ? 'shippingAddress' : 'billingAddress';

        if (resp.createCustomerAddress.id) {
          setOpen(false);
          toast.success(t('selectAddress.newAddress', { address: resp.createCustomerAddress.streetLine1 }));
          setSelectedAddress(resp.createCustomerAddress);
          setTab('select');
          setCreateForCustomer(false);
          const { id, ...address } = resp.createCustomerAddress;
          if (currentOrder) {
            const setAddress = type === 'shipping' ? setShippingAddress : setBillingAddress;
            setAddress({
              ...address,
              countryCode: values.countryCode || 'PL',
            });

            setOrder({
              ...currentOrder,
              [addressTypeKey]: resp.createCustomerAddress,
            });
          }
        } else toast.error(t('selectAddress.addressFailedCreateToast'));
      });
      return;
    }

    if (mode === 'update' && modifiedOrder) {
      const addressTypeKey = type === 'shipping' ? 'shippingAddress' : 'billingAddress';

      setModifiedOrder({
        ...modifiedOrder,
        [addressTypeKey]: input,
      });

      toast.success(t('selectAddress.addressUpdated'));
      setOpen(false);
      return;
    }

    setSubmitting(true);
    try {
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
              ...('customFields' in selectedAddress ? { customFields: selectedAddress.customFields } : {}),
            }
          : input;

      const setAddress = type === 'shipping' ? setShippingAddress : setBillingAddress;
      setAddress(newAddress)
        .then(() => {
          toast.success(t('selectAddress.addressSuccessSelectToast'));
          setOpen(false);
        })
        .catch(() =>
          toast.error(
            t(tab === 'create' ? 'selectAddress.addressFailedCreateToast' : 'selectAddress.addressFailedSelectToast'),
          ),
        );

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
    } catch {
      toast.error(t('selectAddress.addressError'));
    } finally {
      setSubmitting(false);
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
      form.reset({
        countryCode: sameAddressInSaved.country?.code || '',
        fullName: sameAddressInSaved.fullName ?? '',
        company: sameAddressInSaved.company ?? '',
        streetLine1: sameAddressInSaved.streetLine1 ?? '',
        streetLine2: sameAddressInSaved.streetLine2 ?? '',
        city: sameAddressInSaved.city ?? '',
        postalCode: sameAddressInSaved.postalCode ?? '',
        province: sameAddressInSaved.province ?? '',
        phoneNumber: sameAddressInSaved.phoneNumber ?? '',
        customFields: {},
      });
    } else {
      setSelectedAddress(undefined);
      if (currentAddress) {
        form.reset({
          fullName: currentAddress.fullName ?? '',
          company: currentAddress.company ?? '',
          streetLine1: currentAddress.streetLine1 || '',
          streetLine2: currentAddress.streetLine2 ?? '',
          city: currentAddress.city ?? '',
          postalCode: currentAddress.postalCode ?? '',
          province: currentAddress.province ?? '',
          phoneNumber: currentAddress.phoneNumber ?? '',
          countryCode: currentAddress.countryCode || '',
          customFields: {},
        });
      }
    }
    return () => {
      setTab('select');
      setSelectedAddress(undefined);
    };
  }, [currentAddress, order, type]);

  const color = isShipping ? 'purple' : 'cyan';
  const iconColor = isShipping ? 'text-purple-500 dark:text-purple-400' : 'text-cyan-500 dark:text-cyan-400';

  return (
    <CustomCard
      notCollapsible
      title={t(isShipping ? 'selectAddress.shippingHeader' : 'selectAddress.billingHeader')}
      description={t(isShipping ? 'selectAddress.shippingDescription' : 'selectAddress.billingDescription')}
      icon={isShipping ? <MapPin /> : <Building />}
      color={currentAddress ? color : 'gray'}
      upperRight={
        mode !== 'view' && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Edit size={16} className={iconColor} />
              </Button>
            </DialogTrigger>
            <DialogContent className="flex h-[80vh] max-h-[80vh] min-h-[80vh] flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  {isShipping ? (
                    <MapPin className={`size-5 ${iconColor}`} />
                  ) : (
                    <Building className={`size-5 ${iconColor}`} />
                  )}
                  {t('selectAddress.selectAddress')}
                </DialogTitle>
                <DialogDescription className="mt-2 text-muted-foreground">
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
                defaultValue={'select'}
                onValueChange={(e) => setTab(e as 'select' | 'create')}
                className="flex flex-1 basis-1 flex-col overflow-hidden"
              >
                {order?.customer?.addresses?.length ? (
                  <TabsList className="my-4 grid w-full grid-cols-2">
                    <TabsTrigger className="w-full" value="select">
                      {t('selectAddress.selectAddress')}
                    </TabsTrigger>
                    <TabsTrigger className="w-full" value="create">
                      {t('selectAddress.editAddress')}
                    </TabsTrigger>
                  </TabsList>
                ) : null}
                {order?.customer?.addresses?.length ? (
                  <>
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
                                  <User className={`size-4 ${iconColor}`} />
                                  <p className="font-medium">{address.fullName}</p>
                                  {selectedAddress?.id === address.id && (
                                    <div className="ml-auto">
                                      <Check className="size-4 text-green-500" />
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
                                  {`${t('selectAddress.phoneNumberShort', { value: address.phoneNumber })} ${address.company ? '• ' + address.company : ''} `}
                                </CardDescription>
                                <div className="mt-2 flex gap-2">
                                  {address.defaultBillingAddress && (
                                    <span className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300">
                                      {t('selectAddress.isDefaultBilling')}
                                    </span>
                                  )}
                                  {address.defaultShippingAddress && (
                                    <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">
                                      {t('selectAddress.isDefaultShipping')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  form.reset({
                                    countryCode: address.country?.code || '',
                                    fullName: address.fullName ?? '',
                                    company: address.company ?? '',
                                    streetLine1: address.streetLine1 ?? '',
                                    streetLine2: address.streetLine2 ?? '',
                                    city: address.city ?? '',
                                    postalCode: address.postalCode ?? '',
                                    province: address.province ?? '',
                                    phoneNumber: address.phoneNumber ?? '',
                                    customFields: {},
                                  });
                                  setTab('create');
                                }}
                              >
                                <Edit size={16} className={iconColor} />
                              </Button>
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
                        <AddressForm
                          initialValues={{
                            country: { code: form.getValues('countryCode') },
                            streetLine1: form.getValues('streetLine1'),
                            streetLine2: form.getValues('streetLine2'),
                            city: form.getValues('city'),
                            company: form.getValues('company'),
                            fullName: form.getValues('fullName'),
                            phoneNumber: form.getValues('phoneNumber'),
                            postalCode: form.getValues('postalCode'),
                            province: form.getValues('province'),
                            ...(form.getValues('customFields') &&
                            Object.keys(form.getValues('customFields') ?? {}).length > 0
                              ? { customFields: form.getValues('customFields') }
                              : {}),
                          }}
                          onInputChange={(input) =>
                            form.reset({
                              ...form.getValues(),
                              fullName: input.fullName ?? '',
                              company: input.company ?? '',
                              streetLine1: input.streetLine1 ?? '',
                              streetLine2: input.streetLine2 ?? '',
                              city: input.city ?? '',
                              postalCode: input.postalCode ?? '',
                              province: input.province ?? '',
                              phoneNumber: input.phoneNumber ?? '',
                              countryCode: input.countryCode ?? '',
                              ...(input.customFields
                                ? { customFields: input.customFields as Record<string, unknown> }
                                : {}),
                            })
                          }
                        />
                      </ScrollArea>
                    </TabsContent>
                  </>
                ) : (
                  <AddressForm
                    onInputChange={(input) =>
                      form.reset({
                        ...form.getValues(),
                        fullName: input.fullName ?? '',
                        company: input.company ?? '',
                        streetLine1: input.streetLine1 ?? '',
                        streetLine2: input.streetLine2 ?? '',
                        city: input.city ?? '',
                        postalCode: input.postalCode ?? '',
                        province: input.province ?? '',
                        phoneNumber: input.phoneNumber ?? '',
                        countryCode: input.countryCode ?? '',
                        ...(input.customFields ? { customFields: input.customFields as Record<string, unknown> } : {}),
                      })
                    }
                  />
                )}
              </Tabs>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button
                  className="gap-2"
                  disabled={
                    submitting || (!!order?.customer?.addresses?.length && tab === 'select' && !selectedAddress)
                  }
                  onClick={submitAddress}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {t('common.submitting')}
                    </>
                  ) : (
                    <>
                      <Check className="size-4" />
                      {!order?.customer?.addresses?.length
                        ? 'Create'
                        : t(tab === 'select' ? 'selectAddress.selectAddress' : 'selectAddress.editAddress')}
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )
      }
    >
      <div className="rounded-lg border border-border bg-muted/50 p-3">
        <div className="flex items-start gap-3">
          {!currentAddress ? (
            <>
              <div
                className={`mt-0.5 flex size-8 items-center justify-center rounded-full ${isShipping ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-cyan-100 dark:bg-cyan-900/30'}`}
              >
                {isShipping ? (
                  <MapPin className={`size-4 ${iconColor}`} />
                ) : (
                  <Building className={`size-4 ${iconColor}`} />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground italic">
                  {t(isShipping ? 'selectAddress.noShippingAddress' : 'selectAddress.noBillingAddress')}
                </p>
                {mode !== 'view' && (
                  <Button variant="outline" size="sm" className="mt-2 gap-2" onClick={() => setOpen(true)}>
                    <Edit className="size-3.5" />
                    {t('selectAddress.addAddress', 'Add Address')}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className={`max-h-4 min-h-4 max-w-4 min-w-4 ${iconColor}`} />
                    <p className="text-sm font-medium">{currentAddress?.fullName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className={`max-h-4 min-h-4 max-w-4 min-w-4 ${iconColor}`} />
                    <p className="text-sm">
                      {currentAddress.streetLine1} {currentAddress?.streetLine2}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className={`max-h-4 min-h-4 max-w-4 min-w-4 ${iconColor}`} />
                    <p className="text-sm">
                      {currentAddress.city} {currentAddress.postalCode} {currentAddress.province}{' '}
                      {currentAddress.country}
                    </p>
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-border pt-1">
                    <div className="flex items-center gap-2">
                      {currentAddress.company && (
                        <div className="flex items-center gap-1">
                          <Building className="size-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{currentAddress.company}</span>
                        </div>
                      )}
                      {currentAddress.phoneNumber && (
                        <div className="flex items-center gap-1">
                          <Phone className="size-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {t('selectAddress.phoneNumberShort', { value: currentAddress.phoneNumber })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CustomCard>
  );
};
