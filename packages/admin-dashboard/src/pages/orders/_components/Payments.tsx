'use client';

import React from 'react';

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
  useTranslation,
  apiClient,
  DialogTrigger,
  Input,
  priceFormatter,
} from '@deenruv/react-ui-devkit';
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
  ArrowDownCircle,
  ArrowUpCircle,
  RefreshCcw,
} from 'lucide-react';
import type { FC } from 'react';
import { useState } from 'react';
import { AddPaymentDialog } from './index.js';
import { PAYMENT_STATE } from '@/graphql/base';
import { MetadataDisplay } from './PaymentMetadata.js';

export const Payments: FC = () => {
  const { order, addPaymentToOrder, settlePayment, cancelPayment } = useOrder();
  const { t } = useTranslation('orders');
  const [paymentToBeSettled, setPaymentToBeSettled] = useState('');
  const [expandedRefunds, setExpandedRefunds] = useState<string[]>([]);

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

  // Helper function to get refund status badge styling
  const getRefundStatusBadge = (state: string) => {
    switch (state.toLowerCase()) {
      case 'settled':
        return {
          variant: 'success' as const,
          icon: <CheckCircle className="mr-1 size-3.5" />,
          label: t('refunds.status.settled', 'Settled'),
        };
      case 'pending':
        return {
          variant: 'outline' as const,
          icon: <Clock className="mr-1 size-3.5" />,
          label: t('refunds.status.pending', 'Pending'),
        };
      case 'failed':
        return {
          variant: 'destructive' as const,
          icon: <XCircle className="mr-1 size-3.5" />,
          label: t('refunds.status.failed', 'Failed'),
        };
      default:
        return {
          variant: 'secondary' as const,
          icon: <AlertCircle className="mr-1 size-3.5" />,
          label: state,
        };
    }
  };

  const toggleRefundExpand = (id: string) => {
    setExpandedRefunds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const [settleRefundTransactionId, setSettleRefundTransactionId] = useState<string | null>(null);
  const settleRefund = async (id: string) => {
    if (!settleRefundTransactionId) {
      return;
    }
    const { settleRefund } = await apiClient('mutation')({
      settleRefund: [
        { input: { id, transactionId: settleRefundTransactionId } },
        {
          __typename: true,
          '...on Refund': { id: true },
          '...on RefundStateTransitionError': { errorCode: true, fromState: true, message: true },
        },
      ],
    });
    if (settleRefund.__typename === 'Refund') {
      setSettleRefundTransactionId(null);
    } else {
      console.error(settleRefund);
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
            <TableRow noHover className="border-b border-border">
              <TableHead className="w-[80px] py-3">{t('payments.id')}</TableHead>
              <TableHead className="py-3">{t('payments.created')}</TableHead>
              <TableHead className="py-3">{t('payments.method')}</TableHead>
              <TableHead className="py-3">{t('payments.status')}</TableHead>
              <TableHead className="py-3">{t('payments.amount')}</TableHead>
              <TableHead className="py-3">{t('payments.refunds', 'Refunds')}</TableHead>
              <TableHead className="py-3 text-center">{t('payments.extra')}</TableHead>
              <TableHead className="ml-auto py-3"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.length ? (
              payments.map(({ amount, id, method, state, createdAt, metadata, refunds, transactionId }) => {
                const statusBadge = getStatusBadge(state);
                const hasRefunds = refunds && refunds.length > 0;
                const isRefundExpanded = expandedRefunds.includes(id);
                const totalRefunded = hasRefunds ? refunds.reduce((sum, refund) => sum + refund.total, 0) : 0;

                return (
                  <React.Fragment key={id}>
                    <TableRow noHover className="group">
                      <TableCell className="py-3 font-mono text-xs text-muted-foreground">{id}</TableCell>
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
                      <TableCell className="py-3">
                        {hasRefunds ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <RefreshCcw className="size-4 text-orange-500 dark:text-orange-400" />
                              <span className="font-mono text-sm font-medium text-orange-600 dark:text-orange-400">
                                {priceFormatter(totalRefunded, order.currencyCode)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 p-0"
                                onClick={() => toggleRefundExpand(id)}
                              >
                                {isRefundExpanded ? (
                                  <ArrowUpCircle className="size-4 text-muted-foreground" />
                                ) : (
                                  <ArrowDownCircle className="size-4 text-muted-foreground" />
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
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
                          {!hasRefunds && state !== PAYMENT_STATE.CANCELLED && (
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
                    {hasRefunds && isRefundExpanded && (
                      <TableRow noHover className="bg-muted/30">
                        <TableCell colSpan={8} className="p-0">
                          <div className="px-8 py-3">
                            <div className="mb-2 text-sm font-medium">{t('refunds.details', 'Refund Details')}</div>
                            <Table>
                              <TableHeader>
                                <TableRow noHover className="border-b border-border">
                                  <TableHead className="py-2 text-xs">{t('refunds.state', 'Status')}</TableHead>
                                  <TableHead className="py-2 text-xs">{t('refunds.amount', 'Amount')}</TableHead>
                                  <TableHead className="py-2 text-xs">{t('refunds.items', 'Items')}</TableHead>
                                  {refunds.some((refund) => refund.state.toLowerCase() === 'pending') && (
                                    <TableHead className="py-2 text-xs">{t('refunds.actions', 'Actions')}</TableHead>
                                  )}
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {refunds.map((refund, index) => {
                                  const refundStatusBadge = getRefundStatusBadge(refund.state);
                                  const state = refund.state.toLowerCase();
                                  return (
                                    <TableRow
                                      key={`${id}-refund-${index}`}
                                      noHover
                                      className="border-b border-border/50"
                                    >
                                      <TableCell className="py-2">
                                        <Badge
                                          variant={refundStatusBadge.variant}
                                          className="flex w-fit items-center gap-1"
                                        >
                                          {refundStatusBadge.icon}
                                          {refundStatusBadge.label}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="py-2 font-mono text-sm">
                                        {priceFormatter(refund.total, order.currencyCode)}
                                      </TableCell>
                                      <TableCell className="py-2">
                                        <div className="text-sm">
                                          {refund.lines.map((line, lineIndex) => (
                                            <div
                                              key={`${id}-refund-${index}-line-${lineIndex}`}
                                              className="flex items-center gap-2"
                                            >
                                              <span className="font-mono text-xs text-muted-foreground">
                                                {line.orderLineId} |
                                              </span>
                                              <span className="text-xs">×{line.quantity}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </TableCell>
                                      {state === 'pending' && (
                                        <TableCell className="py-2">
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button>Settle refund</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                              <DialogHeader>
                                                <DialogTitle>Settle refund</DialogTitle>
                                                <DialogDescription>
                                                  After manually refunding via your payment provider (standard-payment),
                                                  enter the transaction ID here.
                                                </DialogDescription>
                                              </DialogHeader>
                                              <div>
                                                <Input
                                                  placeholder="Transaction ID"
                                                  value={settleRefundTransactionId || ''}
                                                  onChange={(e) => setSettleRefundTransactionId(e.target.value)}
                                                />
                                              </div>
                                              <DialogFooter>
                                                <DialogClose asChild>
                                                  <Button variant="outline">
                                                    {t('payments.settle.cancel', 'Cancel')}
                                                  </Button>
                                                </DialogClose>
                                                <Button
                                                  variant="default"
                                                  onClick={() => settleRefund(refund.id)}
                                                  className="gap-2"
                                                >
                                                  <CheckCircle2 className="size-4" />
                                                  {t('payments.settle.confirm', 'Confirm Settlement')}
                                                </Button>
                                              </DialogFooter>
                                            </DialogContent>
                                          </Dialog>
                                        </TableCell>
                                      )}
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <EmptyState
                columnsLength={8}
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
