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
  apiClient,
} from '@deenruv/react-ui-devkit';

import { PaymentMethodHandlerSelector, PaymentMethodHandlerType } from '@/graphql/paymentMethods';
import { X } from 'lucide-react';
import { SimpleSelect, Stack } from '@/components';

interface CheckerCardProps {
  currentCheckerValue: ModelTypes['ConfigurableOperationInput'] | undefined;
  onCheckerValueChange: (checker: ModelTypes['ConfigurableOperationInput'] | undefined) => void;
}

export const CheckerCard: React.FC<CheckerCardProps> = ({ currentCheckerValue, onCheckerValueChange }) => {
  const { t } = useTranslation('shippingMethods');
  const [checkers, setCheckers] = useState<PaymentMethodHandlerType[]>([]);
  const [allCheckersOptions, setAllCheckersOptions] = useState<Option[]>([]);

  const fetchOptions = useCallback(async () => {
    const response = await apiClient('query')({
      shippingEligibilityCheckers: PaymentMethodHandlerSelector,
    });
    setAllCheckersOptions(
      response.shippingEligibilityCheckers.map((h) => ({
        value: h.code,
        label: h.code,
      })),
    );
    setCheckers(response.shippingEligibilityCheckers);
  }, [setAllCheckersOptions]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

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

  const clearInput = useCallback(() => {
    onCheckerValueChange(undefined);
  }, [onCheckerValueChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('details.options.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4 xl:flex-nowrap">
        <Stack column className="basis-full gap-3 md:basis-1/2">
          <Stack className="items-end gap-1">
            <SimpleSelect
              label={t('details.options.checker')}
              value={currentCheckerValue ? currentCheckerValue.code : ''}
              onValueChange={handleCheckerValueChange}
              options={allCheckersOptions}
            />
            {currentCheckerValue?.code && (
              <Button variant={'secondary'} className="p-2" onClick={clearInput}>
                <X size={20} />
              </Button>
            )}
          </Stack>
          <Stack>
            {currentCheckerValue?.arguments.map((e, i) => {
              const checker = checkers?.find((ch) => ch.code === currentCheckerValue.code);
              const argument = checker?.args.find((a) => a.name === a.name);

              return argument?.type === 'int' ? (
                <Stack className="basis-full">
                  <Input
                    type="number"
                    step={0.01}
                    label={argument?.label}
                    value={currentCheckerValue?.arguments[i].value}
                    onChange={(e) =>
                      handleCheckerValueChange(currentCheckerValue?.code, [
                        { name: argument?.name || '', value: e.target.value },
                      ])
                    }
                    required
                  />
                </Stack>
              ) : (
                <Stack className="mb-2 basis-full items-center gap-3" key={e.name}>
                  <Checkbox
                    checked={currentCheckerValue?.arguments[i].value === 'true' ? true : false}
                    onCheckedChange={(e) =>
                      handleCheckerValueChange(currentCheckerValue?.code, [
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
      </CardContent>
    </Card>
  );
};
