import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  apiClient,
  CustomCard,
  CardIcons,
} from '@deenruv/react-ui-devkit';
import { OptionGroupSelector, OptionGroupType } from '@/graphql/products';
import { toast } from 'sonner';
import { Stack } from '@/components';

interface OptionsCardProps {
  productId: string;
  optionGroups: { name: string; group: { name: string } }[] | undefined;
  optionIds: string[] | undefined;
  onChange: (optionIds: string[]) => void;
  createMode: boolean;
}

export const OptionsCard: React.FC<OptionsCardProps> = ({
  optionGroups: options,
  productId,
  onChange,
  optionIds,
  createMode,
}) => {
  const { t } = useTranslation('products');
  const [optionGroups, setOptionGroups] = useState<OptionGroupType[]>();

  const fetchOptionGroups = useCallback(async () => {
    if (productId) {
      const response = await apiClient('query')({
        product: [
          {
            id: productId,
          },
          {
            optionGroups: OptionGroupSelector,
          },
        ],
      });

      setOptionGroups(response.product?.optionGroups);

      if (!response.product) {
        toast.error(t('toasts.fetchProductErrorToast'));
      }
    }
  }, [productId]);

  useEffect(() => {
    fetchOptionGroups();
  }, [fetchOptionGroups]);

  const handleOptionChange = useCallback(
    (optionId: string, groupIdx: number) => {
      const newState = [...(optionIds || [])];
      newState[groupIdx] = optionId;

      onChange(newState);
    },
    [optionIds, onChange],
  );

  return (
    <CustomCard title={t('options')} icon={<CardIcons.options />} color="orange">
      {!createMode ? (
        <Table>
          <TableBody>
            {options?.map((o) => (
              <TableRow key={o.name}>
                <TableCell className="font-semibold capitalize">{o.group.name}:</TableCell>
                <TableCell className="capitalize">{o.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        optionGroups?.map((group, i) => (
          <Stack key={group.name} className="items-center gap-3">
            <div className="w-1/3 font-semibold">{group.name}:</div>
            <div className="w-2/3">
              <Select
                value={optionIds?.[i] || ''}
                onValueChange={(e) => {
                  handleOptionChange(e, i);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('addVariantDialog.selectOption')} />
                </SelectTrigger>
                <SelectContent>
                  {group.options.map((o) => (
                    <SelectItem key={o.id} value={o.id} className="capitalize">
                      {o.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Stack>
        ))
      )}
    </CustomCard>
  );
};
