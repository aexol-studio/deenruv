import React, { useCallback, useEffect, useState } from 'react';
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
  CustomCard,
  CardIcons,
  SimpleSelect,
  useTranslation,
  PaymentMethodHandlerType,
  PaymentMethodHandlerSelector,
} from '@deenruv/react-ui-devkit';

import { X } from 'lucide-react';

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
    <CustomCard
      title={t('details.options.title')}
      icon={<CardIcons.check />}
      color="teal"
      upperRight={<ErrorMessage errors={errors} />}
    >
      <div className="flex basis-full flex-col gap-3 md:basis-1/2">
        <div className="flex items-end gap-1">
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
        </div>
        <div className="flex">
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
        </div>
      </div>
    </CustomCard>
  );
};
