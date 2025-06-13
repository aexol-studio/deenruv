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
  EntityCustomFields,
  useTranslation,
} from '@deenruv/react-ui-devkit';

import { CurrencyCode, ModelTypes } from '@deenruv/admin-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

type ProductVariantPrice = {
  currencyCode: ModelTypes['CurrencyCode'];
  price: ModelTypes['Money'];
  delete?: boolean | null;
  customFields?: any;
};

interface PriceCardProps {
  priceValue: ProductVariantPrice[] | null | undefined;
  onPriceChange: (e: ProductVariantPrice[]) => void;
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

  useEffect(() => {
    fetchTaxRates();
  }, []);

  const fetchTaxRates = useCallback(async () => {
    const response = await apiClient('query')({
      taxCategories: [{}, { items: { id: true, name: true } }],
      taxRates: [{}, { items: { value: true, category: { id: true } } }],
    });

    const categoriesWithRates = response.taxCategories.items.map((c) => ({
      ...c,
      value: response.taxRates.items.find((r) => r.category.id === c.id)?.value,
    }));

    setTaxCategories(categoriesWithRates);
  }, []);

  const handlePriceChange = useCallback(
    (currencyCode: CurrencyCode, value: number) => {
      const newPrices = priceValue?.map((p) => (p.currencyCode === currencyCode ? { ...p, price: value } : p));
      onPriceChange(newPrices || []);
    },
    [priceValue, onPriceChange],
  );

  return (
    <CustomCard title={t('details.price')} color="rose" icon={<CardIcons.calc />}>
      <div className="flex flex-col gap-y-4">
        {priceValue?.map((price) => (
          <div key={price.currencyCode} className="flex items-center gap-x-2">
            <Input
              type="currency"
              placeholder={t('price')}
              value={price.price}
              onChange={(e) => handlePriceChange(price.currencyCode, +e.target.value)}
              step={0.01}
              startAdornment={price.currencyCode}
            />
          </div>
        ))}

        <Select value={taxRateValue} onValueChange={onTaxRateChange}>
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

        {currentTaxCategory?.value !== undefined && `${t('details.taxRateDescription')} ${currentTaxCategory?.value}%`}
      </div>
    </CustomCard>
  );
};
