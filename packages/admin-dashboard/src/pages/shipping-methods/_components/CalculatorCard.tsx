import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModelTypes } from '@deenruv/admin-types';
import {
  Button,
  Label,
  Option,
  apiClient,
  ErrorMessage,
  generateInputComponents,
  usePluginStore,
  CustomFieldsProvider,
  CardIcons,
  CustomCard,
} from '@deenruv/react-ui-devkit';

import { PaymentMethodHandlerSelector, PaymentMethodHandlerType } from '@/graphql/paymentMethods';
import { X } from 'lucide-react';
import { SimpleSelect, Stack } from '@/components';

interface CalculatorCardProps {
  currentCalculatorValue: ModelTypes['ConfigurableOperationInput'] | undefined;
  onCalculatorValueChange: (checker: ModelTypes['ConfigurableOperationInput'] | undefined) => void;
  errors?: string[];
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({
  currentCalculatorValue,
  onCalculatorValueChange,
  errors,
}) => {
  const { t } = useTranslation('shippingMethods');
  const [calculators, setCalculators] = useState<PaymentMethodHandlerType[]>([]);
  const [allCalculatorsOptions, setAllCalculatorsOptions] = useState<Option[]>([]);
  const { getInputComponent } = usePluginStore();

  const fetchOptions = useCallback(async () => {
    const response = await apiClient('query')({
      shippingCalculators: PaymentMethodHandlerSelector,
    });
    setAllCalculatorsOptions(
      response.shippingCalculators.map((c) => ({
        value: c.code,
        label: c.code,
      })),
    );
    setCalculators(response.shippingCalculators);
  }, [setAllCalculatorsOptions]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const handleCalculatorValueChange = useCallback(
    (code: string, args?: { name: string; value: string }[]) => {
      const correspondingCalculator = calculators.find((h) => h.code === code);
      console.log('args', args);

      if (correspondingCalculator)
        onCalculatorValueChange({
          code: correspondingCalculator.code,
          arguments:
            args ||
            correspondingCalculator.args.map((a) => ({
              name: a.name,
              value: 'false',
            })),
        });
    },
    [calculators, onCalculatorValueChange],
  );

  const clearInput = useCallback(() => {
    onCalculatorValueChange(undefined);
  }, [onCalculatorValueChange]);

  return (
    <CustomCard title={t('details.calculator.title')} icon={<CardIcons.calc />} color="indigo">
      <Stack column className="basis-full gap-3 md:basis-1/2">
        <Stack className="items-end gap-1">
          <SimpleSelect
            label={t('details.calculator.type')}
            value={currentCalculatorValue ? currentCalculatorValue.code : ''}
            onValueChange={handleCalculatorValueChange}
            options={allCalculatorsOptions}
          />
          {currentCalculatorValue?.code && (
            <Button variant={'secondary'} className="p-2" onClick={clearInput}>
              <X size={20} />
            </Button>
          )}
        </Stack>
        <Stack className="gap-3">
          {currentCalculatorValue?.arguments.map((e, i) => {
            const calculator = calculators?.find((ch) => ch.code === currentCalculatorValue.code);
            const argument = calculator?.args.find((a) => a.name === e.name);
            if (!argument) return null;
            return generateInputComponents(
              [
                {
                  ...argument,
                  label: [{ languageCode: 'en', value: argument.label || argument.name }],
                  description: [{ languageCode: 'en', value: argument.description || '' }],
                },
              ],
              getInputComponent,
            ).map((field) => {
              const value = e.value;
              const setValue = (data: unknown) => {
                try {
                  onCalculatorValueChange({
                    code: currentCalculatorValue.code,
                    arguments: currentCalculatorValue.arguments.map((a) => {
                      try {
                        if (a.name === field.name) {
                          return {
                            name: a.name,
                            value: JSON.stringify(data),
                          };
                        }
                      } catch {
                        return a;
                      }
                      return a;
                    }),
                  });
                } catch {
                  console.error('Error setting value');
                }
              };

              return (
                <CustomFieldsProvider
                  key={field.name}
                  field={field}
                  value={value}
                  setValue={setValue}
                  additionalData={{}}
                  // disabled={disabled}
                >
                  <div key={field.name}>
                    <div>
                      <Label>{field.name}</Label>
                    </div>
                    {field.component}
                  </div>
                </CustomFieldsProvider>
              );
            });
          })}
        </Stack>
        <ErrorMessage errors={errors} />
      </Stack>
    </CustomCard>
  );
};
