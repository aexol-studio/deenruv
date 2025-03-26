import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModelTypes } from '@deenruv/admin-types';
import {
  Button,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Option,
  apiClient,
  ErrorMessage,
  generateInputComponents,
  usePluginStore,
  CustomFieldsProvider,
} from '@deenruv/react-ui-devkit';

import { PaymentMethodHandlerSelector, PaymentMethodHandlerType } from '@/graphql/paymentMethods';
import { X } from 'lucide-react';
import { SimpleSelect, Stack } from '@/components';

interface CheckerCardProps {
  currentCheckerValue: ModelTypes['ConfigurableOperationInput'] | undefined;
  onCheckerValueChange: (checker: ModelTypes['ConfigurableOperationInput'] | undefined) => void;
  errors?: string[];
}

export const CheckerCard: React.FC<CheckerCardProps> = ({ currentCheckerValue, onCheckerValueChange, errors }) => {
  const { t } = useTranslation('shippingMethods');
  const [checkers, setCheckers] = useState<PaymentMethodHandlerType[]>([]);
  const [allCheckersOptions, setAllCheckersOptions] = useState<Option[]>([]);
  const { getInputComponent } = usePluginStore();

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
    console.log('CLICK');
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
                    onCheckerValueChange({
                      code: currentCheckerValue.code,
                      arguments: currentCheckerValue.arguments.map((a) => {
                        try {
                          if (a.name === field.name) {
                            return { name: field.name, value: JSON.stringify(data) };
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
      </CardContent>
    </Card>
  );
};
