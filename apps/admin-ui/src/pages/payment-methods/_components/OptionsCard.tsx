import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModelTypes } from '@/zeus';
import { Checkbox, Label, SimpleSelect, Stack } from '@/components';
import { Option } from '@/components/ui/multiple-selector';
import { apiCall } from '@/graphql/client';
import { PaymentMethodHandlerSelector, PaymentMethodHandlerType } from '@/graphql/paymentMethods';

interface OptionsCardProps {
  currentHandlerValue: ModelTypes['ConfigurableOperationInput'] | undefined;
  currentCheckerValue: ModelTypes['ConfigurableOperationInput'] | undefined;
  onHandlerValueChange: (handler: ModelTypes['ConfigurableOperationInput']) => void;
  onCheckerValueChange: (checker: ModelTypes['ConfigurableOperationInput']) => void;
}

export const OptionsCard: React.FC<OptionsCardProps> = ({
  currentHandlerValue,
  currentCheckerValue,
  onHandlerValueChange,
  onCheckerValueChange,
}) => {
  const { t } = useTranslation('paymentMethods');
  const [handlers, setHandlers] = useState<PaymentMethodHandlerType[]>([]);
  const [checkers, setCheckers] = useState<PaymentMethodHandlerType[]>([]);
  const [allHandlersOptions, setAllHandlersOptions] = useState<Option[]>([]);
  const [allCheckersOptions, setAllCheckersOptions] = useState<Option[]>([]);

  const fetchOptions = useCallback(async () => {
    const response = await apiCall()('query')({
      paymentMethodHandlers: PaymentMethodHandlerSelector,
      paymentMethodEligibilityCheckers: PaymentMethodHandlerSelector,
    });
    setHandlers(response.paymentMethodHandlers);
    setAllHandlersOptions(
      response.paymentMethodHandlers.map((h) => ({
        value: h.code,
        label: h.code,
      })),
    );
    setAllCheckersOptions(
      response.paymentMethodEligibilityCheckers.map((h) => ({
        value: h.code,
        label: h.code,
      })),
    );
    setCheckers(response.paymentMethodEligibilityCheckers);
  }, [setAllHandlersOptions, setAllCheckersOptions]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const handleHandlerValueChange = useCallback(
    (code: string, args?: { name: string; value: string }[]) => {
      const correspondingHandler = handlers.find((h) => h.code === code);

      if (correspondingHandler)
        onHandlerValueChange({
          code: correspondingHandler.code,
          arguments:
            args ||
            correspondingHandler.args.map((a) => ({
              name: a.name,
              value: 'false',
            })),
        });
    },
    [handlers, onHandlerValueChange],
  );

  const handleCheckerValueChange = useCallback(
    (code: string, args?: { name: string; value: string }[]) => {
      const correspondingChecker = checkers.find((h) => h.code === code);

      if (correspondingChecker)
        onCheckerValueChange({
          code: correspondingChecker.code,
          arguments:
            args ||
            correspondingChecker.args.map((a) => ({
              name: a.name,
              value: 'false',
            })),
        });
    },
    [checkers, onCheckerValueChange],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.options.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4 xl:flex-nowrap">
        <Stack column className="basis-full gap-3 md:basis-1/2">
          <SimpleSelect
            label={t('details.options.handler')}
            value={currentHandlerValue?.code}
            onValueChange={handleHandlerValueChange}
            options={allHandlersOptions}
          />
          <Stack>
            {currentHandlerValue?.arguments.map((e, i) => {
              const handler = handlers?.find((h) => h.code === currentHandlerValue.code);
              const argument = handler?.args.find((a) => a.name === a.name);

              return (
                <Stack className="mb-2 basis-full items-center gap-3" key={e.name}>
                  <Checkbox
                    checked={currentHandlerValue?.arguments[i].value === 'true' ? true : false}
                    onCheckedChange={(e) =>
                      handleHandlerValueChange(currentHandlerValue?.code, [
                        { name: argument?.name || '', value: e ? 'true' : 'false' },
                      ])
                    }
                  />
                  <Label>{argument?.label}</Label>
                </Stack>
              );
            })}
          </Stack>
        </Stack>
        <Stack className="basis-full md:basis-1/2">
          <SimpleSelect
            label={t('details.options.checker')}
            value={currentCheckerValue?.code}
            onValueChange={handleCheckerValueChange}
            options={allCheckersOptions}
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
