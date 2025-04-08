import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  useOrder,
  ScrollArea,
  CustomCard,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { priceFormatter } from '@/utils';
import type React from 'react';
import { ReceiptText, Percent, Calculator, AlertCircle } from 'lucide-react';

export const TaxSummary: React.FC = () => {
  const { order } = useOrder();
  const { t } = useTranslation('orders');
  if (!order) return null;
  const totalTax = order.taxSummary.reduce((sum, { taxTotal }) => sum + taxTotal, 0);

  return (
    <CustomCard
      color="indigo"
      description={t('taxSummary.subTitle', 'Breakdown of taxes applied to this order')}
      title={t('taxSummary.title')}
      icon={<ReceiptText />}
      collapsed
    >
      <ScrollArea className="max-h-[350px] px-6 pb-6">
        <Table>
          <TableHeader>
            <TableRow noHover className="border-border border-b">
              <TableHead className="py-3">{t('taxSummary.description')}</TableHead>
              <TableHead className="py-3">{t('taxSummary.taxRate')}</TableHead>
              <TableHead className="py-3">{t('taxSummary.taxBase')}</TableHead>
              <TableHead className="py-3">{t('taxSummary.taxTotal')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {order.taxSummary.length ? (
              <>
                {order.taxSummary.map(({ description, taxRate, taxBase, taxTotal }) => (
                  <TableRow key={description} noHover className="group">
                    <TableCell className="py-3 font-medium">
                      <div className="flex items-center gap-2">
                        <Calculator className="size-4 text-indigo-500 dark:text-indigo-400" />
                        <span className="capitalize">{description}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-1">
                        <Percent className="text-muted-foreground size-3.5" />
                        <span className="font-medium">{taxRate}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3 font-mono text-sm">
                      {priceFormatter(taxBase, order.currencyCode)}
                    </TableCell>
                    <TableCell className="py-3 font-mono text-sm font-medium">
                      {priceFormatter(taxTotal, order.currencyCode)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow noHover className="border-border bg-muted/30 border-t">
                  <TableCell colSpan={3} className="py-3 text-right font-medium">
                    {t('taxSummary.taxTotal', 'Total Tax')}
                  </TableCell>
                  <TableCell className="py-3 font-mono text-sm font-bold">
                    {priceFormatter(totalTax, order.currencyCode)}
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow noHover>
                <TableCell colSpan={4} className="text-muted-foreground py-6 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/30">
                      <AlertCircle className="size-6 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <p>{t('taxSummary.noTaxSummary', 'No tax information available')}</p>
                    <p className="text-muted-foreground text-xs">
                      {t(
                        'taxSummary.noTaxSummaryHint',
                        'Tax information will appear here when taxes are applied to the order',
                      )}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </CustomCard>
  );
};
