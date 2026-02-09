import {
  Button,
  Input,
  Separator,
  useServer,
  apiClient,
  CustomCard,
  CardIcons,
  useDeenruvForm,
  z,
  SimpleSelect,
  priceFormatter,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CircleCheck, CircleX } from 'lucide-react';

import { ModelTypes } from '@deenruv/admin-types';
import { Lines } from '@/pages/shipping-methods/_components/Lines';

interface TestCardProps {
  calculator: ModelTypes['ConfigurableOperationInput'] | undefined;
  checker: ModelTypes['ConfigurableOperationInput'] | undefined;
}

const testShippingSchema = z.object({
  shippingAddress: z
    .object({
      countryCode: z.string().default(''),
      city: z.string().default(''),
      streetLine1: z.string().default('test'),
      postalCode: z.string().default(''),
      province: z.string().default(''),
    })
    .default({ countryCode: '', city: '', streetLine1: 'test', postalCode: '', province: '' }),
  calculator: z.any().optional(),
  checker: z.any().optional(),
  lines: z.array(z.any()).optional(),
});

export const TestCard: React.FC<TestCardProps> = ({ calculator, checker }) => {
  const { t } = useTranslation('shippingMethods');
  const [testResult, setTestResult] = useState<ModelTypes['TestShippingMethodResult']>();
  const { countries } = useServer();

  const form = useDeenruvForm({
    schema: testShippingSchema,
    defaultValues: {
      shippingAddress: {
        countryCode: '',
        city: '',
        streetLine1: 'test',
        postalCode: '',
        province: '',
      },
    },
  });
  const shippingAddress = form.watch('shippingAddress');
  const calculatorValue = form.watch('calculator');
  const checkerValue = form.watch('checker');
  const lines = form.watch('lines');

  // Sync calculator/checker props into local form only when the serialized
  // value actually changes.  Props arrive from parent's watch() which
  // returns new object refs on every render — the ref-based comparison
  // prevents an infinite setValue → rerender → setValue loop.
  // `form.setField` is now referentially stable (useCallback in useDeenruvForm),
  // so it won't re-trigger these effects on its own.
  const prevCalculatorRef = useRef<string>(undefined);
  const prevCheckerRef = useRef<string>(undefined);

  useEffect(() => {
    const serialized = calculator ? JSON.stringify(calculator) : undefined;
    if (serialized && serialized !== prevCalculatorRef.current) {
      prevCalculatorRef.current = serialized;
      form.setField('calculator', calculator);
    }
  }, [calculator, form.setField]);

  useEffect(() => {
    const serialized = checker ? JSON.stringify(checker) : undefined;
    if (serialized && serialized !== prevCheckerRef.current) {
      prevCheckerRef.current = serialized;
      form.setField('checker', checker);
    }
  }, [checker, form.setField]);

  // Read the current address via getValues inside the callback to avoid
  // stale-closure issues without adding `shippingAddress` (which changes
  // on every keystroke) to the dependency array.
  const setAddressField = useCallback(
    (addressField: string, e: string | undefined) => {
      const current = form.getValues('shippingAddress');
      form.setField('shippingAddress', {
        ...current,
        [addressField]: e,
      });
    },
    [form.getValues, form.setField],
  );

  const testShippingMethod = useCallback(async () => {
    const currentValues = form.getValues();
    const { calculator: calc, checker: chk, shippingAddress: addr, lines: ln } = currentValues;
    if (calc && chk && addr && ln) {
      const resp = await apiClient('query')({
        testShippingMethod: [
          {
            input: {
              calculator: calc,
              checker: chk,
              lines: ln,
              shippingAddress: addr as ModelTypes['CreateAddressInput'],
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

      setTestResult(resp.testShippingMethod as ModelTypes['TestShippingMethodResult']);
    }
  }, [form.getValues]);

  // Stable callback for Lines component — avoids identity churn that would
  // cause Lines' useEffect(onLinesChange) to re-fire every render.
  const handleLinesChange = useCallback(
    (e: { productVariantId: string; quantity: number }[]) => {
      form.setField('lines', e);
    },
    [form.setField],
  );

  return (
    <CustomCard
      title={t('details.test.title')}
      icon={<CardIcons.shipping />}
      color="cyan"
      bottomRight={
        <Button className="w-48" onClick={testShippingMethod}>
          {t('details.test.button')}
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="flex flex-1 basis-full md:basis-1/3">
            <Input
              label={t('details.test.city')}
              value={shippingAddress?.city ?? undefined}
              onChange={(e) => setAddressField('city', e.target.value)}
              required
            />
          </div>
          <div className="flex flex-1 basis-full md:basis-1/3">
            <Input
              label={t('details.test.province')}
              value={shippingAddress?.province ?? undefined}
              onChange={(e) => setAddressField('province', e.target.value)}
              required
            />
          </div>
          <div className="flex flex-1 basis-full md:basis-1/3">
            <Input
              label={t('details.test.postalCode')}
              value={shippingAddress?.postalCode ?? undefined}
              onChange={(e) => setAddressField('postalCode', e.target.value)}
              required
            />
          </div>
          <div className="flex flex-1 basis-full md:basis-1/3">
            <SimpleSelect
              label={t('details.test.country')}
              value={shippingAddress?.countryCode}
              onValueChange={(e) => setAddressField('countryCode', e)}
              options={countries.map((c) => ({
                label: c.name,
                value: c.code,
              }))}
            />
          </div>
        </div>
        <Separator />
        <Lines onLinesChange={handleLinesChange} />
        {testResult && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
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
            </div>
            <div>
              <span className="font-semibold">{t('details.lines.price')}:</span>{' '}
              {priceFormatter(testResult.quote?.price)}
            </div>
            <div>
              <span className="font-semibold">{t('details.lines.total')}:</span>{' '}
              {priceFormatter(testResult.quote?.priceWithTax)}
            </div>
          </div>
        )}
      </div>
    </CustomCard>
  );
};
