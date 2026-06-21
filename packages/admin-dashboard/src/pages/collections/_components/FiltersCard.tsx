import React, { useCallback, useEffect, useState } from 'react';
import { ModelTypes } from '@deenruv/admin-types';
import {
  Button,
  Checkbox,
  Input,
  Label,
  Switch,
  Separator,
  Option,
  apiClient,
  ErrorMessage,
  CustomCard,
  CardIcons,
  SimpleSelect,
  useTranslation,
  PaymentMethodHandlerType,
  PaymentMethodHandlerSelector,
} from '@deenruv/react-ui-devkit';

import { X } from 'lucide-react';
import { FacetsSelector } from '@/pages/collections/_components/FacetsSelector';
import { CombinationMode } from '@/pages/collections/_components/CombinationMode';
import { VariantsSelector } from '@/pages/collections/_components/VariantsSelector';

type CollectionFilterDefinition = PaymentMethodHandlerType;
type CollectionFilterArgDefinition = CollectionFilterDefinition['args'][number];

const getArgumentComponent = (argument: CollectionFilterArgDefinition | undefined) =>
  (argument?.ui as { component?: string } | undefined)?.component;

const getArgumentOptions = (argument: CollectionFilterArgDefinition | undefined) =>
  (argument?.ui as { options?: { value: string }[] } | undefined)?.options ?? [];

const stringifyDefaultValue = (value: unknown): string => {
  if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
    return JSON.stringify(value);
  }
  if (typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
    return String(value);
  }
  return '';
};

const getDefaultArgumentValue = (argument: CollectionFilterArgDefinition): string => {
  if (argument.defaultValue !== undefined && argument.defaultValue !== null) {
    return stringifyDefaultValue(argument.defaultValue);
  }

  const component = getArgumentComponent(argument);
  if (argument.list || component === 'facet-value-form-input' || component === 'product-multi-form-input') {
    return '[]';
  }
  if (component === 'select-form-input') {
    return getArgumentOptions(argument)[0]?.value ?? '';
  }
  if (argument.type === 'boolean') {
    return 'false';
  }
  return '';
};

const parseStringArrayValue = (value: string | undefined): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

interface FiltersCardProps {
  inheritValue: boolean | undefined;
  onInheritChange: (checked: boolean) => void;
  currentFiltersValue: ModelTypes['ConfigurableOperationInput'][] | undefined;
  onFiltersValueChange: (checker: ModelTypes['ConfigurableOperationInput'][] | undefined) => void;
  errors?: string[];
}

export const FiltersCard: React.FC<FiltersCardProps> = ({
  currentFiltersValue,
  onFiltersValueChange,
  inheritValue,
  onInheritChange,
  errors,
}) => {
  const { t } = useTranslation('collections');
  const codesTranslations = t('details.filters.labels.codes', { returnObjects: true });
  const [filters, setFilters] = useState<PaymentMethodHandlerType[]>([]);
  const [allFiltersOptions, setAllFiltersOptions] = useState<Option[]>([]);

  const fetchOptions = useCallback(async () => {
    const response = await apiClient('query')({
      collectionFilters: PaymentMethodHandlerSelector,
    });
    setAllFiltersOptions(
      response.collectionFilters.map((c) => ({
        value: c.code,
        label: codesTranslations[c.code as keyof typeof codesTranslations]
          ? t('details.filters.labels.codes.' + c.code)
          : c.description,
      })),
    );
    setFilters(response.collectionFilters);
  }, [setAllFiltersOptions]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const handleFiltersValueChange = useCallback(
    (index: number, code: string, args?: { name: string; value: string }[]) => {
      const correspondingFilter = filters.find((h) => h?.code === code);

      if (correspondingFilter) {
        const newFiltersValue = [...(currentFiltersValue || [])];
        newFiltersValue[index] = {
          code: correspondingFilter.code,
          arguments:
            args ||
            correspondingFilter.args.map((a) => ({
              name: a.name,
              value: getDefaultArgumentValue(a),
            })),
        };

        onFiltersValueChange(newFiltersValue);
      }
    },
    [filters, onFiltersValueChange, currentFiltersValue],
  );

  const handleRemoveFilter = useCallback(
    (code: string) => {
      if (currentFiltersValue) {
        let newValue = [...currentFiltersValue];
        newValue = newValue.filter((v) => v.code !== code);
        onFiltersValueChange(newValue);
      }
    },
    [onFiltersValueChange, currentFiltersValue],
  );

  const handleAddFilter = useCallback(() => {
    const defaultFilter = filters[0];
    if (!defaultFilter) return;

    const newFiltersValue = [
      ...(currentFiltersValue || []),
      {
        code: defaultFilter.code,
        arguments: defaultFilter.args.map((a) => ({
          name: a.name,
          value: getDefaultArgumentValue(a),
        })),
      },
    ];
    onFiltersValueChange(newFiltersValue);
  }, [filters, onFiltersValueChange, currentFiltersValue]);

  return (
    <CustomCard
      title={t('details.filters.title')}
      upperRight={<ErrorMessage errors={errors} />}
      color="orange"
      icon={<CardIcons.filter />}
    >
      <div className="flex- flex flex-wrap gap-4 xl:flex-nowrap">
        <div className="flex basis-full flex-col gap-4">
          <div className="mb-2 flex basis-full">
            <div className="flex items-center gap-3">
              <Switch checked={inheritValue} onCheckedChange={onInheritChange} />
              <Label>{t('details.filters.inherit')}</Label>
            </div>
            <Button
              className="ml-auto"
              onClick={handleAddFilter}
              disabled={filters.length === 0}
              title={filters.length === 0 ? t('details.filters.noAvailableConditions') : undefined}
            >
              {t('details.filters.addCondition')}
            </Button>
          </div>
          {currentFiltersValue?.map((filter, index) => {
            return (
              <div className="flex flex-col gap-4" key={index}>
                <Separator />
                <div className="flex w-1/2 items-end gap-1">
                  <SimpleSelect
                    label={t('details.filters.condition')}
                    value={filter ? filter.code : ''}
                    onValueChange={(e) => handleFiltersValueChange(index, e)}
                    options={allFiltersOptions}
                  />
                  {filter?.code && (
                    <Button
                      variant={'secondary'}
                      className="p-2"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFilter(filter.code);
                      }}
                    >
                      <X size={20} />
                    </Button>
                  )}
                </div>
                <div className="flex items-start justify-center gap-4">
                  {filter?.arguments.map((e, i) => {
                    const _filter = filters?.find((f) => f.code === filter.code);
                    const argument = _filter?.args.find((a) => a.name === e.name);

                    return getArgumentComponent(argument) === 'facet-value-form-input' ? (
                      <FacetsSelector
                        value={parseStringArrayValue(filter?.arguments[i].value)}
                        onChange={(e) => {
                          filter.arguments[i] = { name: argument?.name || '', value: JSON.stringify(e) };
                          handleFiltersValueChange(index, filter?.code, filter.arguments);
                        }}
                      />
                    ) : getArgumentComponent(argument) === 'select-form-input' ? (
                      <SimpleSelect
                        key={i}
                        label={argument?.label || argument?.name || ''}
                        value={filter?.arguments[i].value}
                        onValueChange={(e) => {
                          filter.arguments[i] = { name: argument?.name || '', value: e };
                          handleFiltersValueChange(index, filter?.code, filter.arguments);
                        }}
                        options={
                          (getArgumentOptions(argument).map((o) => ({
                            label: o.value,
                            value: o.value,
                          })) as Option[]) || []
                        }
                      />
                    ) : getArgumentComponent(argument) === 'combination-mode-form-input' ? (
                      <CombinationMode
                        label={t('details.filters.labels.arguments.combination-mode')}
                        value={filter?.arguments[i].value}
                        onChange={(e) => {
                          filter.arguments[i] = { name: argument?.name || '', value: e };
                          handleFiltersValueChange(index, filter?.code, filter.arguments);
                        }}
                      />
                    ) : getArgumentComponent(argument) === 'product-multi-form-input' ? (
                      <VariantsSelector
                        type={argument?.ui?.selectionMode as 'variant' | 'product'}
                        label={argument?.label || argument?.name || ''}
                        value={parseStringArrayValue(filter?.arguments[i].value)}
                        onChange={(e) => {
                          filter.arguments[i] = { name: argument?.name || '', value: JSON.stringify(e) };
                          handleFiltersValueChange(index, filter?.code, filter.arguments);
                        }}
                      />
                    ) : argument?.type === 'int' ? (
                      <div className="flex basis-full" key={i}>
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
                      </div>
                    ) : argument?.type === 'string' ? (
                      <div className="flex basis-full" key={i}>
                        <Input
                          label={argument?.label || argument.name}
                          value={filter?.arguments[i].value}
                          onChange={(e) => {
                            filter.arguments[i] = { name: argument?.name || '', value: e.target.value };
                            handleFiltersValueChange(index, filter?.code, filter.arguments);
                          }}
                          required
                        />
                      </div>
                    ) : argument?.type === 'boolean' ? (
                      <div className="flex basis-full flex-col gap-3" key={e.name}>
                        <Label>{argument?.label}</Label>
                        <Checkbox
                          checked={filter?.arguments[i].value === 'true' ? true : false}
                          onCheckedChange={(e) => {
                            filter.arguments[i] = { name: argument?.name || '', value: e ? 'true' : 'false' };
                            handleFiltersValueChange(index, filter?.code, filter.arguments);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex basis-full" key={i}>
                        <Input
                          type="number"
                          step={0.01}
                          label={argument?.label ?? undefined}
                          value={filter?.arguments[i].value}
                          onChange={(e) => {
                            filter.arguments[i] = { name: argument?.name || '', value: e.target.value };
                            handleFiltersValueChange(index, filter?.code, filter.arguments);
                          }}
                          required
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </CustomCard>
  );
};
