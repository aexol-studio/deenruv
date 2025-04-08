'use client';

import {
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  apiClient,
  useOrder,
  cn,
  OrderDetailSelector,
  Label,
  useGFFLP,
  CustomCard,
  EntityCustomFields,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { CustomerSearch } from '@/components/AutoComplete/CustomerSearch';
import type { SearchCustomerType } from '@/graphql/draft_order';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Edit, User, Check, Mail, Phone, Loader2, UserPlus, Search, AlertCircle } from 'lucide-react';

export const CustomerSelectCard: React.FC = () => {
  const { t } = useTranslation('orders');
  const { order, setOrder, mode, modifiedOrder, setCustomerAndAddressesForDraftOrder } = useOrder();
  const [tab, setTab] = useState<'select' | 'create'>('select');
  const [selected, setSelected] = useState<SearchCustomerType | undefined>(order?.customer);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentOrder = useMemo(
    () => (mode === 'update' ? (modifiedOrder ? modifiedOrder : order) : order),
    [mode, order, modifiedOrder],
  );
  const { state, checkIfAllFieldsAreValid, setField, clearAllForm } = useGFFLP(
    'CreateCustomerInput',
    'firstName',
    'lastName',
    'title',
    'phoneNumber',
    'emailAddress',
    'customFields',
  )({
    firstName: {
      initialValue: '',
      validate: (v) => {
        if (!v || v === '') return [t('form.requiredError')];
      },
    },
    lastName: {
      initialValue: '',
      validate: (v) => {
        if (!v || v === '') return [t('form.requiredError')];
      },
    },
    phoneNumber: {
      initialValue: '',
      validate: (v) => {
        if (!v || v === '') return [t('form.requiredError')];
        // if (!phoneNumberRegExp.test(v)) return [t('form.phoneError')];
      },
    },
    emailAddress: {
      initialValue: '',
      validate: (v) => {
        if (!v || v === '') return [t('form.requiredError')];
      },
    },
    customFields: {
      initialValue: {},
    },
  });

  useEffect(() => setSelected(order?.customer), [order]);

  useEffect(() => {
    if (tab === 'create') clearAllForm();
  }, [tab]);

  const validateAndSubmitIfCorrect = async () => {
    if (!order?.id) return;

    if (tab === 'create' && !checkIfAllFieldsAreValid()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (tab === 'select' && selected) {
        setCustomerAndAddressesForDraftOrder(selected.id).then(() => {
          setOpen(false);
          toast.success(t('create.selectCustomer.success', 'Customer successfully assigned to order'));
          setIsSubmitting(false);
        });
      } else {
        const { setCustomerForDraftOrder } = await apiClient('mutation')({
          setCustomerForDraftOrder: [
            {
              orderId: order.id,
              ...(tab === 'select'
                ? { customerId: selected?.id }
                : {
                    input: {
                      title: state.title?.validatedValue,
                      firstName: state.firstName?.validatedValue || '',
                      lastName: state.lastName?.validatedValue || '',
                      emailAddress: state.emailAddress?.validatedValue || '',
                      phoneNumber: state.phoneNumber?.validatedValue,
                    },
                  }),
            },
            {
              __typename: true,
              '...on Order': OrderDetailSelector,
              '...on EmailAddressConflictError': { errorCode: true, message: true },
            },
          ],
        });

        if (setCustomerForDraftOrder.__typename === 'Order') {
          setOpen(false);
          toast.success(t('create.selectCustomer.success', 'Customer successfully assigned to order'));
        } else {
          toast.error(t('create.selectCustomer.error', 'Failed to assign customer to order'));
        }
      }
    } catch (error) {
      toast.error(t('create.selectCustomer.error', 'Failed to assign customer to order'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!order) return null;

  return (
    <CustomCard
      notCollapsible
      color={currentOrder?.customer ? 'indigo' : 'gray'}
      description={t(
        'create.selectCustomer.description',
        'Choose an existing customer or create a new one for this order',
      )}
      title={t('create.selectCustomer.select', 'Customer Information')}
      icon={<User />}
      upperRight={
        mode !== 'view' &&
        mode !== 'update' && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Edit size={16} className="text-indigo-500 dark:text-indigo-400" />
              </Button>
            </DialogTrigger>
            <DialogContent className="min-w-max">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <User className="size-5 text-indigo-500 dark:text-indigo-400" />
                  {t('create.selectCustomer.label', 'Select Customer')}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground mt-2">
                  {t(
                    'create.selectCustomer.description',
                    'Choose an existing customer or create a new one for this order',
                  )}
                </DialogDescription>
              </DialogHeader>
              <Tabs value={tab} onValueChange={(e) => setTab(e as 'create' | 'select')}>
                <TabsList className="my-4 grid w-full grid-cols-2">
                  <TabsTrigger className="w-full" value="select">
                    <div className="flex items-center gap-2">
                      <Search className="size-4" />
                      {t('create.selectCustomer.selectTab', 'Find Customer')}
                    </div>
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="create">
                    <div className="flex items-center gap-2">
                      <UserPlus className="size-4" />
                      {t('create.selectCustomer.createTab', 'Create New')}
                    </div>
                  </TabsTrigger>
                </TabsList>
                <TabsContent className="focus-visible:ring-transparent" value="select">
                  <CustomerSearch selectedCustomer={selected} onSelect={(selected) => setSelected(selected)} />
                </TabsContent>
                <TabsContent value="create" className="h-fit max-h-[calc(80vh-230px)] overflow-y-auto pt-2">
                  <div className="space-y-4 px-1">
                    <div className="space-y-1">
                      <Label htmlFor="title" className="text-sm font-medium">
                        {t('create.selectCustomer.titleLabel', 'Title')}
                      </Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder={t('create.selectCustomer.titlePlaceholder', 'Mr., Mrs., Dr., etc.')}
                        value={state.title?.value ?? undefined}
                        onChange={(e) => setField('title', e.target.value)}
                        errors={state.title?.errors}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                          {t('create.selectCustomer.firstNameLabel', 'First Name')}{' '}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder={t('create.selectCustomer.firstNamePlaceholder', 'Enter first name')}
                          value={state.firstName?.value}
                          onChange={(e) => setField('firstName', e.target.value)}
                          className={cn(state.firstName?.errors?.length && 'border-red-300')}
                          required
                          errors={state.firstName?.errors}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                          {t('create.selectCustomer.lastNameLabel', 'Last Name')}{' '}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder={t('create.selectCustomer.lastNamePlaceholder', 'Enter last name')}
                          value={state.lastName?.value}
                          onChange={(e) => setField('lastName', e.target.value)}
                          className={cn(state.lastName?.errors?.length && 'border-red-300')}
                          required
                          errors={state.lastName?.errors}
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-sm font-medium">
                        {t('create.selectCustomer.emailLabel', 'Email Address')} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="emailAddress"
                        type="email"
                        placeholder={t('create.selectCustomer.emailPlaceholder', 'Enter email address')}
                        value={state.emailAddress?.value}
                        onChange={(e) => setField('emailAddress', e.target.value)}
                        className={cn(state.emailAddress?.errors?.length && 'border-red-300')}
                        required
                        errors={state.emailAddress?.errors}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        {t('create.selectCustomer.phoneNumberLabel', 'Phone Number')}{' '}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phoneNumber"
                        placeholder={t('create.selectCustomer.phonePlaceholder', 'Enter phone number')}
                        value={state.phoneNumber?.value ?? undefined}
                        onChange={(e) => setField('phoneNumber', e.target.value)}
                        className={cn(state.phoneNumber?.errors?.length && 'border-red-300')}
                        required
                        errors={state.phoneNumber?.errors}
                      />
                    </div>
                    <EntityCustomFields
                      id={selected?.id}
                      entityName="customer"
                      hideButton
                      initialValues={
                        selected && 'customFields' in selected
                          ? { customFields: selected.customFields as any }
                          : { customFields: {} }
                      }
                      onChange={(customFields, translations) => {
                        setField('customFields', customFields);
                      }}
                      additionalData={{}}
                    />
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setOpen(false)} disabled={isSubmitting}>
                  {t('common.cancel', 'Cancel')}
                </Button>
                <Button
                  disabled={(tab === 'select' && !selected) || isSubmitting}
                  className="gap-2"
                  onClick={validateAndSubmitIfCorrect}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {t('common.processing', 'Processing...')}
                    </>
                  ) : (
                    <>
                      <Check className="size-4" />
                      {t(
                        tab === 'create' ? 'create.selectCustomer.create' : 'create.selectCustomer.selectButton',
                        tab === 'create' ? 'Create Customer' : 'Select Customer',
                      )}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )
      }
    >
      <div className="border-border bg-muted/50 rounded-lg border p-3">
        <div className="flex items-start gap-3">
          {!currentOrder?.customer ? (
            <>
              <div className="bg-secondary mt-0.5 flex size-8 items-center justify-center rounded-full">
                <AlertCircle className="size-4 text-green-500 dark:text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-muted-foreground text-sm italic">
                  {t('create.selectCustomer.noCustomer', 'No customer assigned to this order')}
                </p>
                {mode !== 'view' && (
                  <Button variant="outline" size="sm" className="mt-2 gap-2" onClick={() => setOpen(true)}>
                    <UserPlus className="size-3.5" />
                    {t('create.selectCustomer.addCustomer', 'Add Customer')}
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex-1">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">
                      {currentOrder.customer.title && `${currentOrder.customer.title} `}
                      {currentOrder.customer.firstName} {currentOrder.customer.lastName}
                    </p>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                      {t('create.selectCustomer.customer', 'Customer')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-3.5 text-indigo-500 dark:text-indigo-400" />
                    <span>{currentOrder.customer.emailAddress}</span>
                  </div>
                  {currentOrder.customer.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="size-3.5 text-indigo-500 dark:text-indigo-400" />
                      <span>{currentOrder.customer.phoneNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </CustomCard>
  );
};
