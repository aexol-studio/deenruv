import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  apiClient,
  CustomCard,
  CardIcons,
} from '@deenruv/react-ui-devkit';

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
    const response = await apiClient('query')({
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
    <CustomCard title={t('details.price')} color="rose" icon={<CardIcons.calc />}>
      <Stack column className="gap-y-4">
        <Stack className="items-center gap-x-2">
          <Input
            type="currency"
            placeholder={t('price')}
            value={priceValue}
            onChange={onPriceChange}
            step={0.01}
            endAdornment={currencyCode}
          />
          <Select value={taxRateValue} onValueChange={(id) => onTaxRateChange(id)}>
            <SelectTrigger>
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

        {currentTaxCategory?.value !== undefined && `${t('details.taxRateDescription')} ${currentTaxCategory?.value}%`}
      </Stack>
    </CustomCard>
  );
};
