import { Button, Input, Separator, useServer, apiClient, CustomCard, CardIcons } from '@deenruv/react-ui-devkit';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGFFLP } from '@/lists/useGflp';
import { ModelTypes } from '@deenruv/admin-types';
import { Lines } from '@/pages/shipping-methods/_components/Lines';
import { CircleCheck, CircleX } from 'lucide-react';
import { priceFormatter } from '@/utils';
import { SimpleSelect, Stack } from '@/components';

interface TestCardProps {
  calculator: ModelTypes['ConfigurableOperationInput'] | undefined;
  checker: ModelTypes['ConfigurableOperationInput'] | undefined;
}

export const TestCard: React.FC<TestCardProps> = ({ calculator, checker }) => {
  const { t } = useTranslation('shippingMethods');
  const [testResult, setTestResult] = useState<ModelTypes['TestShippingMethodResult']>();
  const { countries } = useServer();

  const { state, setField } = useGFFLP(
    'TestShippingMethodInput',
    'shippingAddress',
    'calculator',
    'checker',
    'lines',
  )({
    shippingAddress: {
      initialValue: {
        countryCode: '',
        city: '',
        streetLine1: 'test',
        postalCode: '',
        province: '',
      },
    },
  });

  useEffect(() => {
    if (calculator) setField('calculator', calculator);
    if (checker) setField('checker', checker);
  }, [calculator, checker, setField]);

  const setAddressField = useCallback(
    (addressField: string, e: string | undefined) => {
      setField('shippingAddress', {
        ...state.shippingAddress!.value,
        [addressField]: e,
      });
    },
    [state.shippingAddress],
  );

  const testShippingMethod = useCallback(async () => {
    if (state.calculator && state.checker && state.shippingAddress && state.lines?.validatedValue) {
      const resp = await apiClient('query')({
        testShippingMethod: [
          {
            input: {
              calculator: state.calculator.validatedValue,
              checker: state.checker.validatedValue,
              lines: state.lines.validatedValue,
              shippingAddress: state.shippingAddress.validatedValue,
            },
          },
          {
            eligible: true,
            quote: {
              metadata: true,
              price: true,
              priceWithTax: true,
            },
          },
        ],
      });

      setTestResult(resp.testShippingMethod);
    }
  }, [state]);

  return (
    <CustomCard
      title={t('details.test.title')}
      icon={<CardIcons.shipping />}
      color="cyan"
      bottomRight={
        <Button className="w-48" variant={'action'} onClick={testShippingMethod}>
          {t('details.test.button')}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <Stack className="flex-wrap gap-3">
          <Stack className="flex-1 basis-full md:basis-1/3">
            <Input
              label={t('details.test.city')}
              value={state.shippingAddress?.value.city ?? undefined}
              onChange={(e) => setAddressField('city', e.target.value)}
              required
            />
          </Stack>
          <Stack className="flex-1 basis-full md:basis-1/3">
            <Input
              label={t('details.test.province')}
              value={state.shippingAddress?.value.province ?? undefined}
              onChange={(e) => setAddressField('province', e.target.value)}
              required
            />
          </Stack>
          <Stack className="flex-1 basis-full md:basis-1/3">
            <Input
              label={t('details.test.postalCode')}
              value={state.shippingAddress?.value.postalCode ?? undefined}
              onChange={(e) => setAddressField('postalCode', e.target.value)}
              required
            />
          </Stack>
          <Stack className="flex-1 basis-full md:basis-1/3">
            <SimpleSelect
              label={t('details.test.country')}
              value={state.shippingAddress?.value.countryCode}
              onValueChange={(e) => setAddressField('countryCode', e)}
              options={countries.map((c) => ({
                label: c.name,
                value: c.code,
              }))}
            />
          </Stack>
        </Stack>
        <Separator />
        <Lines onLinesChange={(e) => setField('lines', e)} />
        {testResult && (
          <Stack column className="gap-3">
            <Stack className="gap-3">
              {testResult.eligible ? (
                <>
                  <CircleCheck color="green" />
                  {t('details.test.eligible')}
                </>
              ) : (
                <>
                  <CircleX color="red" />
                  {t('details.test.notEligible')}
                </>
              )}
            </Stack>
            <div>
              <span className="font-semibold">{t('details.lines.price')}:</span>{' '}
              {priceFormatter(testResult.quote?.price)}
            </div>
            <div>
              <span className="font-semibold">{t('details.lines.total')}:</span>{' '}
              {priceFormatter(testResult.quote?.priceWithTax)}
            </div>
          </Stack>
        )}
      </div>
    </CustomCard>
  );
};
