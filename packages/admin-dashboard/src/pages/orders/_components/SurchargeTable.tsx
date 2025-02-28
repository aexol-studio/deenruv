import { BooleanCell } from '@/components/Columns/BooleanCell.js';
import {
  Separator,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  priceFormatter,
  useOrder,
} from '@deenruv/react-ui-devkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const SurchargeTable: React.FC = () => {
  const { t } = useTranslation('orders');
  const { modifyOrderInput, order } = useOrder();
  const surcharges = modifyOrderInput?.surcharges;

  return surcharges?.length ? (
    <>
      <Table>
        <TableHeader>
          <TableRow noHover>
            <TableHead>{t('surcharge.labels.description')}</TableHead>
            <TableHead>{t('surcharge.labels.sku')}</TableHead>
            <TableHead>{t('surcharge.labels.price')}</TableHead>
            <TableHead>{t('surcharge.labels.includesTax')}</TableHead>
            <TableHead>{t('surcharge.labels.taxRate')}</TableHead>
            <TableHead>{t('surcharge.labels.taxDescription')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {surcharges?.map(({ description, price, priceIncludesTax, sku, taxDescription, taxRate }, index) => (
            <TableRow key={index} noHover>
              <TableCell className="capitalize">{description}</TableCell>
              <TableCell>{sku}</TableCell>
              <TableCell>{priceFormatter(price as number, order?.currencyCode)}</TableCell>
              <TableCell>
                <BooleanCell value={priceIncludesTax} />
              </TableCell>
              <TableCell>{taxRate}</TableCell>
              <TableCell>{taxDescription}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Separator className="my-4" />
    </>
  ) : null;
};
