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
  ORDER_STATE,
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
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface Props {
  order: DraftOrderType;
  onSubmit: (input: ResolverInputTypes['ManualPaymentInput']) => void;
}

type FormType = Pick<ResolverInputTypes['ManualPaymentInput'], 'method' | 'transactionId'>;

const validateForm = (input: FormType) => {
  const errors: Array<{ key: keyof FormType; message: string }> = [];
  if (!input.method) {
    errors.push({ key: 'method', message: 'Payment method is required' });
  }
  if (!input.transactionId) {
    errors.push({ key: 'transactionId', message: 'Transaction ID is required' });
  }
  return errors;
};

export const AddPaymentDialog: React.FC<Props> = ({ order, onSubmit }) => {
  const [form, setForm] = useState<Pick<ResolverInputTypes['ManualPaymentInput'], 'method' | 'transactionId'>>({
    method: '',
    transactionId: '',
  });
  const { t } = useTranslation('orders');
  const paymentMethodsType = useServer((p) => p.paymentMethodsType);
  const paidAmount = useMemo(
    () =>
      order.payments?.filter((el) => el.state === PAYMENT_STATE.SETTLED).reduce((acc, val) => (acc += val.amount), 0) ||
      0,
    [order.payments],
  );
  const needsPayment = useMemo(() => order.totalWithTax > paidAmount, [order.totalWithTax, paidAmount]);
  const isFormValid = useMemo(() => validateForm(form), [form]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="action"
          size="sm"
          disabled={
            ![
              ORDER_STATE.ARRANGING_PAYMENT,
              ORDER_STATE.ARRANGING_ADDITIONAL_PAYMENT,
              ORDER_STATE.DRAFT,
              ORDER_STATE.MODIFYING,
            ].includes(order.state as ORDER_STATE) || !needsPayment
          }
        >
          {t('create.buttonAddPayment', {
            value: priceFormatter(order.totalWithTax - paidAmount || 0, order?.currencyCode),
          })}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('create.addPaymentTitle')}</DialogTitle>
          <DialogDescription>{t('create.addPaymentDescription')}</DialogDescription>
        </DialogHeader>
        <form
          className="flex w-full flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (isFormValid.length > 0) {
              isFormValid.forEach((err) => toast.error(err.message));
              return;
            }
            onSubmit({ ...form, orderId: order.id, metadata: {} });
            setForm({ method: '', transactionId: '' });
          }}
        >
          <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
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
          <Input
            label={t('Numer transakcji')}
            value={form.transactionId || ''}
            onChange={(e) => setForm({ ...form, transactionId: e.currentTarget.value })}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" disabled={isFormValid.length > 0}>
                {t('Dodaj płatność')}
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
