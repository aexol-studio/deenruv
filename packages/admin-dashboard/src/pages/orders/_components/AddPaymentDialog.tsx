import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useServer,
} from '@deenruv/react-ui-devkit';
import { PAYMENT_STATE } from '@/graphql/base';
import { DraftOrderType } from '@/graphql/draft_order';
import { priceFormatter } from '@/utils';
import { ResolverInputTypes } from '@deenruv/admin-types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  order: DraftOrderType;
  onSubmit: (input: ResolverInputTypes['ManualPaymentInput']) => void;
}

export const AddPaymentDialog: React.FC<Props> = ({ order, onSubmit }) => {
  const { t } = useTranslation('orders');

  const paymentMethodsType = useServer((p) => p.paymentMethodsType);

  const paidAmount = useMemo(
    () =>
      order.payments?.filter((el) => el.state === PAYMENT_STATE.SETTLED).reduce((acc, val) => (acc += val.amount), 0) ||
      0,
    [order.payments],
  );

  const needsPayment = useMemo(() => order.totalWithTax > paidAmount, [order.totalWithTax, paidAmount]);

  return (
    <Dialog>
      {needsPayment && (
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">
            {t('create.buttonAddPayment', { value: priceFormatter(order.totalWithTax - paidAmount || 0) })}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('create.addPaymentTitle')}</DialogTitle>
          <DialogDescription>{t('create.addPaymentDescription')}</DialogDescription>
        </DialogHeader>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            const paymentMethod = formData.get('paymentMethod') as string;
            const transaction = formData.get('transaction') as string;
            onSubmit({
              orderId: order.id,
              method: paymentMethod,
              transactionId: transaction,
              metadata: {},
            });
          }}
        >
          <Select name="paymentMethod">
            <SelectTrigger>
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethodsType.map((method) => (
                <SelectItem key={method.id} value={method.code}>
                  {method.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input name="transaction" type="number" label="Transaction ID" />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Add payment</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
