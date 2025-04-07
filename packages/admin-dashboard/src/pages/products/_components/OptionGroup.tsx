import { OptionGroupType } from '@/graphql/products';
import { DeletionResult, LanguageCode } from '@deenruv/admin-types';
import { Button, MultipleSelector, Option, TableCell, TableRow, apiClient } from '@deenruv/react-ui-devkit';
import { Trash } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface OptionGroupProps {
  group: OptionGroupType;
  productId: string;
  contentLanguage: LanguageCode;
  optionsUsedByVariants: string[];
  onActionCompleted: () => void;
}

export const OptionGroup: React.FC<OptionGroupProps> = ({
  group,
  productId,
  contentLanguage,
  optionsUsedByVariants,
  onActionCompleted,
}) => {
  const { t } = useTranslation('products');
  const [state, setState] = useState<Option[]>(
    group.options
      ?.sort((a, b) => a.id.localeCompare(b.id))
      .map((o) => ({ label: o.name, value: o.id, ...(optionsUsedByVariants.includes(o.id) && { fixed: true }) })),
  );

  const removeGroup = useCallback(
    (optionGroupId: string) => {
      if (!productId) return;
      apiClient('mutation')({
        removeOptionGroupFromProduct: [
          { optionGroupId, productId: productId },
          { '...on Product': { id: true }, '...on ProductOptionInUseError': { message: true } },
        ],
      })
        .then(() => {
          toast(t('toasts.deletionOptionSuccessToast'));
          onActionCompleted();
        })
        .catch(() => {
          toast.error(t('toasts.deletionOptionErrorToast'));
        });
    },
    [productId, onActionCompleted, t],
  );

  const addOption = useCallback(
    (option: Option, optionGroupId: string) => {
      if (!productId) return;
      apiClient('mutation')({
        createProductOption: [
          {
            input: {
              code: option.label.replace(/\s/g, ''),
              productOptionGroupId: optionGroupId,
              translations: [{ languageCode: contentLanguage, name: option.label }],
            },
          },
          { id: true },
        ],
      })
        .then(() => {
          toast(t('toasts.createOptionSuccessToast'));
          onActionCompleted();
        })
        .catch(() => {
          toast(t('toasts.createOptionErrorToast'));
        });
    },
    [productId, contentLanguage, t],
  );

  const deleteOption = useCallback(
    (optionId: string) => {
      if (!productId) return;
      apiClient('mutation')({
        deleteProductOption: [
          {
            id: optionId,
          },
          {
            result: true,
          },
        ],
      })
        .then((resp) => {
          if (resp.deleteProductOption.result === DeletionResult.DELETED) {
            toast(t('toasts.createOptionSuccessToast'));
            onActionCompleted();
          } else {
            toast.error(t('toasts.createOptionInUseToast'));
          }
        })
        .catch(() => {
          toast.error(t('toasts.createOptionErrorToast'));
        });
    },
    [productId, contentLanguage, t],
  );

  const handleChange = useCallback(
    (currentOptions: Option[], optionGroupId: string) => {
      const added = group?.options.length < currentOptions.length;

      if (added) {
        setState(currentOptions);
        const newOption = currentOptions[currentOptions.length - 1];
        addOption(newOption, optionGroupId);
      } else {
        const unpickedOption = state.find((o) => !currentOptions.includes(o));
        if (unpickedOption) {
          deleteOption(unpickedOption.value);
        }
      }
    },
    [group, addOption],
  );

  return (
    <TableRow key={group.id}>
      <TableCell className="font-medium">{group.name}</TableCell>
      <TableCell>
        <MultipleSelector
          className="h-20"
          value={state}
          placeholder={t('optionsTab.placeholder')}
          onChange={(e) => handleChange(e, group.id)}
          options={[]}
          hideClearAllButton
          creatable
        />
      </TableCell>
      <TableCell className="w-12">
        <Button size={'icon'} variant={'outline'} className="size-8" onClick={() => removeGroup(group.id)}>
          <Trash size={20} className="text-red-600" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
