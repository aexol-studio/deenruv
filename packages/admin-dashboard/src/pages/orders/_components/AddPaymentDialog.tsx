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
  Label,
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
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { CheckCircle, CreditCard, DollarSign, FileText } from 'lucide-react';
import { CurrencyCode, ResolverInputTypes } from '@deenruv/admin-types';

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
  const paymentAmount = useMemo(
    () => order.totalWithTax - paidAmount || 0,
    [order.totalWithTax, paidAmount, order?.currencyCode],
  );

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
          className="gap-2"
        >
          <DollarSign className="h-4 w-4" />
          {paymentAmount > 0
            ? t('create.buttonAddPayment', {
                value: priceFormatter(paymentAmount, order.currencyCode),
              })
            : t('create.notEnoughPayment')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-teal-500 dark:text-teal-400" />
            <DialogTitle>{t('create.addPaymentTitle')}</DialogTitle>
          </div>
          <DialogDescription>{t('create.addPaymentDescription')}</DialogDescription>
        </DialogHeader>

        <form
          className="mt-4 flex w-full flex-col gap-4"
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
          <div className="space-y-1">
            <Label htmlFor="payment-method">{t('Payment method')}</Label>
            <Select value={form.method} onValueChange={(v) => setForm({ ...form, method: v })}>
              <SelectTrigger id="payment-method" className="w-full">
                <SelectValue placeholder={t('Select payment method')} />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodsType.map((method) => (
                  <SelectItem key={method.id} value={method.code}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="transaction-id">{t('Transaction ID')}</Label>
            <Input
              id="transaction-id"
              value={form.transactionId || ''}
              onChange={(e) => setForm({ ...form, transactionId: e.currentTarget.value })}
              placeholder={t('Enter transaction ID')}
            />
          </div>

          <div className="bg-muted/50 mt-2 rounded-md p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-teal-500 dark:text-teal-400" />
              <span className="text-sm font-medium">{t('Payment summary')}</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('Order total')}:</span>
                <span className="font-medium">{priceFormatter(order.totalWithTax, order.currencyCode)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t('Already paid')}:</span>
                <span className="font-medium">{priceFormatter(paidAmount, order.currencyCode)}</span>
              </div>
              <div className="flex justify-between border-t pt-1 text-sm font-medium">
                <span>{t('Amount to pay')}:</span>
                <span className="text-teal-600 dark:text-teal-400">
                  {priceFormatter(paymentAmount, order.currencyCode)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2">
            <DialogClose asChild>
              <Button variant="outline">{t('Cancel')}</Button>
            </DialogClose>
            <Button type="submit" disabled={isFormValid.length > 0} className="gap-2">
              <CheckCircle className="h-4 w-4" />
              {t('Add payment')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
