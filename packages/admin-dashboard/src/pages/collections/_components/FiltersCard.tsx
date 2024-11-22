import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModelTypes } from '@deenruv/admin-types';
import {
  Button,
  Checkbox,
  Input,
  Label,
  Switch,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Separator,
  Option,
  apiClient,
} from '@deenruv/react-ui-devkit';
import { SimpleSelect, Stack } from '@/components';

import { PaymentMethodHandlerSelector, PaymentMethodHandlerType } from '@/graphql/paymentMethods';
import { X } from 'lucide-react';
import { FacetsSelector } from '@/pages/collections/_components/FacetsSelector';
import { CombinationMode } from '@/pages/collections/_components/CombinationMode';
import { VariantsSelector } from '@/pages/collections/_components/VariantsSelector';

interface FiltersCardProps {
  inheritValue: boolean | undefined;
  onInheritChange: (checked: boolean) => void;
  currentFiltersValue: ModelTypes['ConfigurableOperationInput'][] | undefined;
  onFiltersValueChange: (checker: ModelTypes['ConfigurableOperationInput'][] | undefined) => void;
}

export const FiltersCard: React.FC<FiltersCardProps> = ({
  currentFiltersValue,
  onFiltersValueChange,
  inheritValue,
  onInheritChange,
}) => {
  const { t } = useTranslation('collections');
  const [filters, setFilters] = useState<PaymentMethodHandlerType[]>([]);
  const [allFiltersOptions, setAllFiltersOptions] = useState<Option[]>([]);

  const fetchOptions = useCallback(async () => {
    const response = await apiClient('query')({
      collectionFilters: PaymentMethodHandlerSelector,
    });
    setAllFiltersOptions(
      response.collectionFilters.map((c) => ({
        value: c.code,
        label: c.description,
      })),
    );
    setFilters(response.collectionFilters);
  }, [setAllFiltersOptions]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const handleFiltersValueChange = useCallback(
    (index: number, code: string, args?: { name: string; value: string }[]) => {
      const correspondingFilter = filters.find((h) => h.code === code);

      if (correspondingFilter && currentFiltersValue) {
        const newFiltersValue = [...currentFiltersValue];
        newFiltersValue[index] = {
          code: correspondingFilter.code,
          arguments:
            args ||
            correspondingFilter.args.map((a) => ({
              name: a.name,
              value: 'false',
            })),
        };

        onFiltersValueChange(newFiltersValue);
      }
    },
    [filters, onFiltersValueChange, currentFiltersValue],
  );

  const clearInput = useCallback(() => {
    onFiltersValueChange(undefined);
  }, [onFiltersValueChange]);

  const handleAddFilter = useCallback(() => {
    const newFiltersValue = [...(currentFiltersValue || []), { code: '', arguments: [] }];
    onFiltersValueChange(newFiltersValue);
  }, [onFiltersValueChange, currentFiltersValue]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.filters.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex- flex flex-wrap gap-4 xl:flex-nowrap">
        <Stack column className="basis-full gap-4">
          <Stack className="mb-2 basis-full">
            <Stack className=" items-center gap-3">
              <Switch checked={inheritValue} onCheckedChange={onInheritChange} />
              <Label>{t('details.filters.inherit')}</Label>
            </Stack>
            <Button className="ml-auto" onClick={handleAddFilter}>
              {t('details.filters.addCondition')}
            </Button>
          </Stack>
          {currentFiltersValue?.map((filter, index) => {
            return (
              <Stack column className="gap-4" key={index}>
                <Separator />
                <Stack className="w-1/2 items-end gap-1">
                  <SimpleSelect
                    label={t('details.filters.condition')}
                    value={filter ? filter.code : ''}
                    onValueChange={(e) => handleFiltersValueChange(index, e)}
                    options={allFiltersOptions}
                  />
                  {filter?.code && (
                    <Button variant={'secondary'} className="p-2" onClick={clearInput}>
                      <X size={20} />
                    </Button>
                  )}
                </Stack>
                <Stack className="items-start justify-center gap-4">
                  {filter?.arguments.map((e, i) => {
                    const _filter = filters?.find((f) => f.code === filter.code);
                    const argument = _filter?.args.find((a) => a.name === e.name);

                    return argument?.ui?.component === 'facet-value-form-input' ? (
                      <FacetsSelector
                        value={JSON.parse(filter?.arguments[i].value)}
                        onChange={(e) => {
                          filter.arguments[i] = { name: argument?.name || '', value: JSON.stringify(e) };
                          handleFiltersValueChange(index, filter?.code, filter.arguments);
                        }}
                      />
                    ) : argument?.ui?.component === 'select-form-input' ? (
                      <SimpleSelect
                        key={i}
                        label={argument?.label || argument.name}
                        value={filter?.arguments[i].value}
                        onValueChange={(e) => {
                          filter.arguments[i] = { name: argument?.name || '', value: e };
                          handleFiltersValueChange(index, filter?.code, filter.arguments);
                        }}
                        options={
                          ((argument?.ui?.options as { value: string }[]).map((o) => ({
                            label: o.value,
                            value: o.value,
                          })) as Option[]) || []
                        }
                      />
                    ) : argument?.ui?.component === 'combination-mode-form-input' ? (
                      <CombinationMode
                        label={argument?.label || argument.name}
                        value={filter?.arguments[i].value}
                        onChange={(e) => {
                          filter.arguments[i] = { name: argument?.name || '', value: e };
                          handleFiltersValueChange(index, filter?.code, filter.arguments);
                        }}
                      />
                    ) : argument?.ui?.component === 'product-multi-form-input' ? (
                      <VariantsSelector
                        type={argument?.ui?.selectionMode as 'variant' | 'product'}
                        label={argument?.label || argument.name}
                        value={JSON.parse(filter?.arguments[i].value)}
                        onChange={(e) => {
                          filter.arguments[i] = { name: argument?.name || '', value: JSON.stringify(e) };
                          handleFiltersValueChange(index, filter?.code, filter.arguments);
                        }}
                      />
                    ) : argument?.type === 'int' ? (
                      <Stack className="basis-full" key={i}>
                        <Input
                          type="number"
                          step={0.01}
                          label={argument?.label || argument.name}
                          value={filter?.arguments[i].value}
                          onChange={(e) => {
                            filter.arguments[i] = { name: argument?.name || '', value: e.target.value };
                            handleFiltersValueChange(index, filter?.code, filter.arguments);
                          }}
                          required
                        />
                      </Stack>
                    ) : argument?.type === 'string' ? (
                      <Stack className="basis-full" key={i}>
                        <Input
                          label={argument?.label || argument.name}
                          value={filter?.arguments[i].value}
                          onChange={(e) => {
                            filter.arguments[i] = { name: argument?.name || '', value: e.target.value };
                            handleFiltersValueChange(index, filter?.code, filter.arguments);
                          }}
                          required
                        />
                      </Stack>
                    ) : argument?.type === 'boolean' ? (
                      <Stack column className="basis-full gap-3" key={e.name}>
                        <Label>{argument?.label}</Label>
                        <Checkbox
                          checked={filter?.arguments[i].value === 'true' ? true : false}
                          onCheckedChange={(e) => {
                            filter.arguments[i] = { name: argument?.name || '', value: e ? 'true' : 'false' };
                            handleFiltersValueChange(index, filter?.code, filter.arguments);
                          }}
                        />
                      </Stack>
                    ) : (
                      <Stack className="basis-full" key={i}>
                        <Input
                          type="number"
                          step={0.01}
                          label={argument?.label}
                          value={filter?.arguments[i].value}
                          onChange={(e) => {
                            filter.arguments[i] = { name: argument?.name || '', value: e.target.value };
                            handleFiltersValueChange(index, filter?.code, filter.arguments);
                          }}
                          required
                        />
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};
