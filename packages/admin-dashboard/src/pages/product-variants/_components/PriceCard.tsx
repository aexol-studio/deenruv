import {
  Badge,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@deenruv/react-ui-devkit';
import { apiCall } from '@/graphql/client';
import { CurrencyCode } from '@deenruv/admin-types';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@/components';

interface PriceCardProps {
  priceValue: number | undefined;
  onPriceChange: (e: ChangeEvent<HTMLInputElement>) => void;
  taxRateValue: string | undefined;
  onTaxRateChange: (e: string) => void;
  currencyCode: CurrencyCode;
}

export const PriceCard: React.FC<PriceCardProps> = ({
  priceValue,
  onPriceChange,
  currencyCode,
  taxRateValue,
  onTaxRateChange,
}) => {
  const { t } = useTranslation('products');
  const [taxCategories, setTaxCategories] = useState<{ name: string; id: string; value: number | undefined }[]>([]);
  const [currentTaxCategory, setCurrentTaxCategory] = useState<{
    name: string;
    id: string;
    value: number | undefined;
  }>();

  const fetchTaxRates = useCallback(async () => {
    const response = await apiCall()('query')({
      taxCategories: [
        {},
        {
          items: {
            id: true,
            name: true,
          },
        },
      ],
      taxRates: [
        {},
        {
          items: {
            value: true,
            category: {
              id: true,
            },
          },
        },
      ],
    });

    const categoriesWithRates = response.taxCategories.items.map((c) => {
      const rate = response.taxRates.items.find((r) => r.category.id === c.id);

      return {
        ...c,
        value: rate?.value,
      };
    });

    setTaxCategories(categoriesWithRates);
  }, []);

  useEffect(() => {
    if (taxCategories.length) {
      const _currentTaxRate = taxCategories.find((tR) => tR.id === taxRateValue);
      _currentTaxRate && setCurrentTaxCategory(_currentTaxRate);
    }
  }, [taxRateValue, taxCategories]);

  useEffect(() => {
    fetchTaxRates();
  }, [fetchTaxRates]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.price')}</CardTitle>
      </CardHeader>
      <CardContent>
        <Stack column className="gap-y-4">
          <Stack className="items-center gap-x-4">
            <Input type="number" placeholder={t('price')} value={priceValue} onChange={onPriceChange} step={0.01} />
            <Badge>{currencyCode}</Badge>
            <Select value={taxRateValue} onValueChange={(id) => onTaxRateChange(id)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Tax rate" />
              </SelectTrigger>
              <SelectContent>
                {taxCategories.map((tR) => (
                  <SelectItem key={tR.id} value={tR.id.toString()}>
                    {tR.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Stack>

          {currentTaxCategory?.value !== undefined &&
            `${t('details.taxRateDescription')}: ${currentTaxCategory?.value}%`}
        </Stack>
      </CardContent>
    </Card>
  );
};
