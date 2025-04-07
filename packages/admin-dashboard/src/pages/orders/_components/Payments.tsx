'use client';

import {
  useOrder,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  ScrollArea,
  Badge,
  DropdownMenuItem,
  ContextMenu,
  ConfirmationDialog,
  CustomCard,
  EmptyState,
} from '@deenruv/react-ui-devkit';
import { priceFormatter } from '@/utils';
import { format } from 'date-fns';
import {
  CreditCard,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Wallet,
  Receipt,
  CheckCircle,
  Ban,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddPaymentDialog } from './index.js';
import { PAYMENT_STATE } from '@/graphql/base';
import { MetadataDisplay } from './PaymentMetadata.js';

export const Payments: React.FC = () => {
  const { order, addPaymentToOrder, settlePayment, cancelPayment } = useOrder();
  const { t } = useTranslation('orders');
  const [paymentToBeSettled, setPaymentToBeSettled] = useState('');

  if (!order) return null;

  const { payments } = order;

  // Helper function to get status badge styling
  const getStatusBadge = (state: string) => {
    switch (state) {
      case PAYMENT_STATE.SETTLED:
        return {
          variant: 'success' as const,
          icon: <CheckCircle className="mr-1 size-3.5" />,
          label: t('payments.status.settled', 'Settled'),
        };
      case PAYMENT_STATE.CANCELLED:
        return {
          variant: 'destructive' as const,
          icon: <Ban className="mr-1 size-3.5" />,
          label: t('payments.status.cancelled', 'Cancelled'),
        };
      case PAYMENT_STATE.AUTHORIZED:
        return {
          variant: 'outline' as const,
          icon: <Clock className="mr-1 size-3.5" />,
          label: t('payments.status.authorized', 'Authorized'),
        };
      default:
        return {
          variant: 'secondary' as const,
          icon: <AlertCircle className="mr-1 size-3.5" />,
          label: state,
        };
    }
  };

  return (
    <CustomCard
      color="teal"
      description={t('payments.subTitle')}
      title={t('payments.title')}
      icon={<Wallet className="size-5 text-teal-500 dark:text-teal-400" />}
      upperRight={<AddPaymentDialog order={order} onSubmit={(v) => addPaymentToOrder(v)} />}
    >
      <Dialog open={!!paymentToBeSettled} onOpenChange={() => setPaymentToBeSettled('')}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="size-5 text-teal-500" />
              <DialogTitle>{t('payments.settle.title', 'Settle Payment')}</DialogTitle>
            </div>
            <DialogDescription>
              {t(
                'payments.settle.description',
                'Are you sure you want to settle this payment? This action cannot be undone.',
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 gap-2">
            <DialogClose asChild>
              <Button variant="outline">{t('payments.settle.cancel', 'Cancel')}</Button>
            </DialogClose>
            <Button variant="default" onClick={() => settlePayment({ id: paymentToBeSettled })} className="gap-2">
              <CheckCircle2 className="size-4" />
              {t('payments.settle.confirm', 'Confirm Settlement')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ScrollArea className="max-h-[400px] px-6">
        <Table>
          <TableHeader>
            <TableRow noHover className="border-border border-b">
              <TableHead className="w-[80px] py-3">{t('payments.id')}</TableHead>
              <TableHead className="py-3">{t('payments.created')}</TableHead>
              <TableHead className="py-3">{t('payments.method')}</TableHead>
              <TableHead className="py-3">{t('payments.status')}</TableHead>
              <TableHead className="py-3">{t('payments.amount')}</TableHead>
              <TableHead className="py-3 text-center">{t('payments.extra')}</TableHead>
              <TableHead className="ml-auto py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.length ? (
              payments.map(({ amount, id, method, state, createdAt, metadata }) => {
                const statusBadge = getStatusBadge(state);

                return (
                  <TableRow key={id} noHover className="group">
                    <TableCell className="text-muted-foreground py-3 font-mono text-xs">{id}</TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4 text-teal-500 dark:text-teal-400" />
                        <span>{format(new Date(createdAt), 'dd/LL/Y, kk:mm')}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="size-4 text-teal-500 dark:text-teal-400" />
                        <span className="font-medium">{method}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <Badge variant={statusBadge.variant} className="flex w-fit items-center gap-1">
                        {statusBadge.icon}
                        {statusBadge.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 font-mono text-sm font-medium">
                      {priceFormatter(amount, order.currencyCode)}
                    </TableCell>
                    <TableCell className="flex items-center justify-center">
                      <MetadataDisplay metadata={metadata} />
                    </TableCell>
                    <TableCell className="py-3 text-end">
                      <ContextMenu>
                        {state !== PAYMENT_STATE.SETTLED && state !== PAYMENT_STATE.CANCELLED && (
                          <DropdownMenuItem
                            key={'set'}
                            onClick={() => setPaymentToBeSettled(id)}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <CheckCircle2 size={16} />
                            {t('payments.settle.settle', 'Settle')}
                          </DropdownMenuItem>
                        )}
                        {state !== PAYMENT_STATE.CANCELLED && (
                          <ConfirmationDialog onConfirm={() => cancelPayment(id)}>
                            <DropdownMenuItem
                              key={'cancel'}
                              className="flex cursor-pointer items-center gap-2 text-red-500"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <XCircle size={16} />
                              {t('payments.cancel', 'Cancel')}
                            </DropdownMenuItem>
                          </ConfirmationDialog>
                        )}
                      </ContextMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <EmptyState
                columnsLength={7}
                title={t('payments.notFound', 'No payments found')}
                color="teal"
                description={t('payments.addPaymentHint')}
                small
                icon={<Receipt />}
              />
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </CustomCard>
  );
};
