import { Label, Stack } from '@/components';
import MultipleSelector, { Option } from '@/components/ui/multiple-selector';
import { apiCall } from '@/graphql/client';
import React, { useCallback, useEffect, useState } from 'react';

interface VariantsSelectorProps {
  type: 'variant' | 'product' | undefined;
  label: string;
  value: string[];
  onChange: (e: string[]) => void;
}

export const VariantsSelector: React.FC<VariantsSelectorProps> = ({ type, label, value, onChange }) => {
  const [options, setOptions] = useState<Option[]>();

  const fetchVariants = useCallback(async () => {
    const response = await apiCall()('query')({
      productVariants: [
        {},
        {
          items: {
            name: true,
            id: true,
          },
        },
      ],
    });
    setOptions(response.productVariants.items.map((v) => ({ label: v.name, value: v.id })));
  }, []);

  const fetchProducts = useCallback(async () => {
    const response = await apiCall()('query')({
      products: [
        {},
        {
          items: {
            name: true,
            id: true,
          },
        },
      ],
    });
    setOptions(response.products.items.map((v) => ({ label: v.name, value: v.id })));
  }, []);

  useEffect(() => {
    type === 'product' ? fetchProducts() : fetchVariants();
  }, [type, fetchProducts, fetchVariants]);

  return (
    <Stack column className="basis-full gap-3">
      <Label>{label}</Label>
      <MultipleSelector
        options={options}
        value={
          !value
            ? []
            : value.map((id) => ({
                label: options?.find((o) => o.value === id)?.label || id,
                value: id,
              }))
        }
        placeholder={label}
        onChange={(e) => onChange(e.map((e) => e.value))}
        hideClearAllButton
      />
    </Stack>
  );
};
