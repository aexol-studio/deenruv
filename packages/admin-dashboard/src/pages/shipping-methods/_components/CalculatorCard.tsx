import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModelTypes } from '@deenruv/admin-types';
import {
  Button,
  Checkbox,
  Input,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Option,
} from '@deenruv/react-ui-devkit';
import { apiCall } from '@/graphql/client';
import { PaymentMethodHandlerSelector, PaymentMethodHandlerType } from '@/graphql/paymentMethods';
import { X } from 'lucide-react';
import { SimpleSelect, Stack } from '@/components';

interface CalculatorCardProps {
  currentCalculatorValue: ModelTypes['ConfigurableOperationInput'] | undefined;
  onCalculatorValueChange: (checker: ModelTypes['ConfigurableOperationInput'] | undefined) => void;
}

export const CalculatorCard: React.FC<CalculatorCardProps> = ({ currentCalculatorValue, onCalculatorValueChange }) => {
  const { t } = useTranslation('shippingMethods');
  const [calculators, setCalculators] = useState<PaymentMethodHandlerType[]>([]);
  const [allCalculatorsOptions, setAllCalculatorsOptions] = useState<Option[]>([]);

  const fetchOptions = useCallback(async () => {
    const response = await apiCall()('query')({
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
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.calculator.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4 xl:flex-nowrap">
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

              return argument?.type === 'int' ? (
                <Stack className="basis-full" key={i}>
                  <Input
                    type="number"
                    step={0.01}
                    label={argument?.label}
                    value={currentCalculatorValue?.arguments[i].value}
                    onChange={(e) => {
                      currentCalculatorValue.arguments[i] = { name: argument?.name || '', value: e.target.value };
                      handleCalculatorValueChange(currentCalculatorValue?.code, currentCalculatorValue.arguments);
                    }}
                    required
                  />
                </Stack>
              ) : argument?.type === 'string' ? (
                <SimpleSelect
                  key={i}
                  label={argument?.label}
                  value={currentCalculatorValue?.arguments[i].value}
                  onValueChange={(e) => {
                    currentCalculatorValue.arguments[i] = { name: argument?.name || '', value: e };
                    handleCalculatorValueChange(currentCalculatorValue?.code, currentCalculatorValue.arguments);
                  }}
                  options={
                    ((argument?.ui?.options as { value: string }[]).map((o) => ({
                      label: o.value,
                      value: o.value,
                    })) as Option[]) || []
                  }
                />
              ) : (
                <Stack className="mb-2 basis-full items-center gap-3" key={e.name}>
                  <Checkbox
                    checked={currentCalculatorValue?.arguments[i].value === 'true' ? true : false}
                    onCheckedChange={(e) => {
                      currentCalculatorValue.arguments[i] = { name: argument?.name || '', value: e ? 'true' : 'false' };
                      handleCalculatorValueChange(currentCalculatorValue?.code, currentCalculatorValue.arguments);
                    }}
                  />
                  <Label>{argument?.label}</Label>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};
