import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components';
import { useOrder } from '@/state/order';
import { priceFormatter } from '@/utils';
import { format } from 'date-fns';
import { InfoIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddPaymentDialog } from '.';
import { PAYMENT_STATE } from '@/graphql/base';

export const Payments: React.FC = () => {
  const { order, addPaymentToOrder, settlePayment } = useOrder();
  const { t } = useTranslation('orders');
  const [paymentToBeSettled, setPaymentToBeSettled] = useState('');
  if (!order) return null;

  const { payments } = order;

  return (
    <Card>
      <Dialog open={!!paymentToBeSettled} onOpenChange={() => setPaymentToBeSettled('')}>
        <DialogContent>
          <DialogTitle>{t('payments.settle.title')}</DialogTitle>
          <div className="flex max-h-[50vh] flex-col gap-2">
            <DialogDescription className="text-lg text-primary">{t('payments.settle.description')}</DialogDescription>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">{t('payments.settle.cancel')}</Button>
            </DialogClose>
            <Button variant="action" onClick={() => settlePayment({ id: paymentToBeSettled })}>
              {t('payments.settle.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>{t('payments.title')}</CardTitle>
            <CardDescription>{t('payments.subTitle')}</CardDescription>
          </div>
          <AddPaymentDialog order={order} onSubmit={(v) => addPaymentToOrder(v)} />
        </div>
        <Table>
          <TableHeader>
            <TableRow noHover>
              <TableHead>{t('payments.id')}</TableHead>
              <TableHead>{t('payments.created')}</TableHead>
              <TableHead>{t('payments.method')}</TableHead>
              <TableHead>{t('payments.status')}</TableHead>
              <TableHead>{t('payments.amount')}</TableHead>
              <TableHead className="text-center">{t('payments.extra')}</TableHead>
              <TableHead>{t('payments.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.length ? (
              payments.map(({ amount, id, method, state, createdAt, metadata }) => (
                <TableRow key={id} noHover>
                  <TableCell>{id}</TableCell>
                  <TableCell>{format(createdAt, 'dd/LL/Y, kk:mm')}</TableCell>
                  <TableCell>{method}</TableCell>
                  <TableCell>
                    <b>{state}</b>
                  </TableCell>
                  <TableCell>{priceFormatter(amount, order.currencyCode)}</TableCell>
                  <TableCell align="center">
                    <Tooltip>
                      <TooltipTrigger>
                        <InfoIcon />
                      </TooltipTrigger>
                      <TooltipContent className="whitespace-break-spaces">
                        {JSON.stringify(metadata, null, 2).replace(/[{}]/g, '') || 'no data'}
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {state !== PAYMENT_STATE.SETTLED && (
                      <Button variant="action" onClick={() => setPaymentToBeSettled(id)}>
                        {t('payments.settle.settle')}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow noHover>
                <TableCell colSpan={5}>{t('payments.notFound')}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardHeader>
    </Card>
  );
};
