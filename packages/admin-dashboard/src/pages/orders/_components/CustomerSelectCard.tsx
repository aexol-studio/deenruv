'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Input,
  CardDescription,
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
} from '@deenruv/react-ui-devkit';
import { CustomerSearch } from '@/components/AutoComplete/CustomerSearch';
import type { SearchCustomerType } from '@/graphql/draft_order';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGFFLP } from '@/lists/useGflp';
import { toast } from 'sonner';
import { Edit, User, Check, Mail, Phone } from 'lucide-react';

export const CustomerSelectCard: React.FC = () => {
  const { t } = useTranslation('orders');
  const { order, setOrder, mode, modifiedOrder } = useOrder();
  const [tab, setTab] = useState<'select' | 'create'>('select');
  const [selected, setSelected] = useState<SearchCustomerType | undefined>(order?.customer);
  const [open, setOpen] = useState(false);
  const currentOrder = useMemo(
    () => (mode === 'update' ? (modifiedOrder ? modifiedOrder : order) : order),
    [mode, order, modifiedOrder],
  );
  const { state, checkIfAllFieldsAreValid, setField } = useGFFLP(
    'CreateCustomerInput',
    'firstName',
    'lastName',
    'title',
    'phoneNumber',
    'emailAddress',
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
  });

  useEffect(() => setSelected(order?.customer), [order]);

  const validateAndSubmitIfCorrect = async () => {
    if (order?.id) {
      if ((tab === 'create' && checkIfAllFieldsAreValid()) || (tab === 'select' && selected)) {
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
          setOrder(setCustomerForDraftOrder);
          setOpen(false);
          toast.success(t('create.selectCustomer.success'));
        } else {
          toast.error(t('create.selectCustomer.error'));
        }
      }
    }
  };

  // Determine card border color based on state
  const cardBorderColor = useMemo(() => {
    if (mode !== 'create') return 'border-primary';
    return order?.customer?.id ? 'border-green-500' : 'border-orange-500';
  }, [mode, order?.customer?.id]);

  // Determine status icon and color
  const StatusIcon = useMemo(() => {
    return order?.customer?.id ? Check : User;
  }, [order?.customer?.id]);

  const statusColor = useMemo(() => {
    return order?.customer?.id ? 'text-green-500' : 'text-orange-500';
  }, [order?.customer?.id]);

  if (!order) return null;

  return (
    <Card className={cn('shadow-sm transition-all duration-200 hover:shadow-md', cardBorderColor)}>
      <CardHeader className="pb-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="text-primary h-5 w-5" />
            <CardTitle className="text-base font-semibold">{t('create.selectCustomer.select')}</CardTitle>
          </div>
          {mode !== 'view' && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <div className="bg-primary/10 hover:bg-primary/20 cursor-pointer rounded-full p-1.5 transition-colors">
                  <Edit size={16} className="text-primary" />
                </div>
              </DialogTrigger>
              <DialogContent className="h-[80vh] min-w-max">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl">
                    <User className="text-primary h-5 w-5" />
                    {t('create.selectCustomer.label')}
                  </DialogTitle>
                  <DialogDescription className="text-muted-foreground mt-2">
                    {t('create.selectCustomer.description')}
                  </DialogDescription>
                </DialogHeader>
                <Tabs value={tab} onValueChange={(e) => setTab(e as 'create' | 'select')}>
                  <TabsList className="my-4 grid w-full grid-cols-2">
                    <TabsTrigger className="w-full" value="select">
                      {t('create.selectCustomer.selectTab')}
                    </TabsTrigger>
                    <TabsTrigger className="w-full" value="create">
                      {t('create.selectCustomer.createTab')}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent className="focus-visible:ring-transparent" value="select">
                    <CustomerSearch selectedCustomer={selected} onSelect={(selected) => setSelected(selected)} />
                  </TabsContent>
                  <TabsContent value="create" className="h-fit max-h-[calc(80vh-230px)] overflow-y-auto pt-2">
                    <div className="space-y-4 px-1">
                      <div className="space-y-1">
                        <Label htmlFor="title" className="text-sm font-medium">
                          {t('create.selectCustomer.titleLabel')}
                        </Label>
                        <Input
                          id="title"
                          name="title"
                          value={state.title?.value ?? undefined}
                          onChange={(e) => setField('title', e.target.value)}
                          errors={state.title?.errors}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label htmlFor="firstName" className="text-sm font-medium">
                            {t('create.selectCustomer.firstNameLabel')} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={state.firstName?.value}
                            onChange={(e) => setField('firstName', e.target.value)}
                            className={cn(state.firstName?.errors?.length && 'border-red-300')}
                            required
                            errors={state.firstName?.errors}
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="lastName" className="text-sm font-medium">
                            {t('create.selectCustomer.lastNameLabel')} <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="lastName"
                            name="lastName"
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
                          {t('create.selectCustomer.emailLabel')} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="email"
                          name="emailAddress"
                          value={state.emailAddress?.value}
                          onChange={(e) => setField('emailAddress', e.target.value)}
                          className={cn(state.emailAddress?.errors?.length && 'border-red-300')}
                          required
                          errors={state.emailAddress?.errors}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          {t('create.selectCustomer.phoneNumberLabel')} <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="phone"
                          name="phoneNumber"
                          value={state.phoneNumber?.value ?? undefined}
                          onChange={(e) => setField('phoneNumber', e.target.value)}
                          className={cn(state.phoneNumber?.errors?.length && 'border-red-300')}
                          required
                          errors={state.phoneNumber?.errors}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                <DialogFooter>
                  <Button
                    disabled={tab === 'select' && !selected}
                    className="px-6"
                    onClick={validateAndSubmitIfCorrect}
                  >
                    {t(tab === 'create' ? 'create.selectCustomer.create' : 'create.selectCustomer.selectButton')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <CardDescription className="text-muted-foreground mb-3 text-sm">
          {t('create.selectCustomer.description')}
        </CardDescription>

        <div className="bg-muted/50 border-border mt-2 rounded-lg border p-3">
          <div className="flex items-start gap-3">
            <StatusIcon className={cn('mt-0.5 h-5 w-5', statusColor)} />
            <div className="flex-1">
              {!currentOrder?.customer ? (
                <p className="text-muted-foreground text-sm italic">{t('create.selectCustomer.noCustomer')}</p>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {currentOrder.customer.firstName} {currentOrder.customer.lastName}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="text-muted-foreground h-3.5 w-3.5" />
                    <span>{currentOrder.customer.emailAddress}</span>
                  </div>
                  {currentOrder.customer.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="text-muted-foreground h-3.5 w-3.5" />
                      <span>{currentOrder.customer.phoneNumber}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
