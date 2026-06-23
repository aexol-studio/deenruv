import React, { useCallback, useEffect, useState } from 'react';
import { ModelTypes } from '@deenruv/admin-types';
import {
  Button,
  Option,
  apiClient,
  ErrorMessage,
  generateInputComponents,
  usePluginStore,
  InputFieldComponent,
  CardIcons,
  CustomCard,
  SimpleSelect,
  useTranslation,
  PaymentMethodHandlerType,
  PaymentMethodHandlerSelector,
} from '@deenruv/react-ui-devkit';

import { X } from 'lucide-react';

interface CalculatorCardProps {
  currentCalculatorValue: ModelTypes['ConfigurableOperationInput'] | undefined;
  onCalculatorValueChange: (checker: ModelTypes['ConfigurableOperationInput'] | undefined) => void;
  errors?: string[];
}

const decodeConfigArgValue = (value: string): unknown => {
  try {
    const result = JSON.parse(value);
    if (result && typeof result === 'object' && !Array.isArray(result)) {
      return JSON.stringify(result);
    }
    return result;
  } catch {
    return value;
  }
};

const encodeConfigArgValue = (value: unknown): string => {
  return Array.isArray(value) ? JSON.stringify(value) : (value ?? '').toString();
};

const createInitialArguments = (args: PaymentMethodHandlerType['args']): ModelTypes['ConfigArgInput'][] => {
  return args.map((arg) => ({
    name: arg.name,
    value: encodeConfigArgValue(arg.defaultValue),
  }));
};

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

      if (correspondingCalculator)
        onCalculatorValueChange({
          code: correspondingCalculator.code,
          arguments: args ?? createInitialArguments(correspondingCalculator.args),
        });
    },
    [calculators, onCalculatorValueChange],
  );

  const clearInput = useCallback(() => {
    onCalculatorValueChange(undefined);
  }, [onCalculatorValueChange]);

  return (
    <CustomCard title={t('details.calculator.title')} icon={<CardIcons.calc />} color="indigo">
      <div className="flex basis-full flex-col gap-3 md:basis-1/2">
        <div className="flex items-end gap-1">
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
        </div>
        <div className="flex gap-3">
          {currentCalculatorValue?.arguments.map((e) => {
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
              const value = decodeConfigArgValue(e.value);
              const setValue = (data: unknown) => {
                try {
                  onCalculatorValueChange({
                    code: currentCalculatorValue.code,
                    arguments: currentCalculatorValue.arguments.map((a) => {
                      try {
                        if (a.name === field.name) {
                          return {
                            name: a.name,
                            value: encodeConfigArgValue(data),
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
                <InputFieldComponent
                  key={field.name}
                  field={field}
                  value={value}
                  setValue={setValue}
                  additionalData={{}}
                />
              );
            });
          })}
        </div>
        <ErrorMessage errors={errors} />
      </div>
    </CustomCard>
  );
};
