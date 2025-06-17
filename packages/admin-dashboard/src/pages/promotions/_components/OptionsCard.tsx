import { Input, CustomCard, CardIcons, useTranslation, DateTimePicker } from '@deenruv/react-ui-devkit';
import React from 'react';

interface OptionsCardProps {
  startsAt: string;
  endsAt: string;
  perCustomerUsageLimit: number | undefined;
  usageLimit: number | undefined;
  couponCode: string | undefined;
  setField: (
    field: 'startsAt' | 'endsAt' | 'perCustomerUsageLimit' | 'usageLimit' | 'couponCode',
    value: string | number,
  ) => void;
}

export const OptionsCard: React.FC<OptionsCardProps> = ({
  startsAt,
  endsAt,
  couponCode,
  perCustomerUsageLimit,
  usageLimit,
  setField,
}) => {
  const { t } = useTranslation('promotions');

  return (
    <CustomCard title={t('options.header')} color="orange" icon={<CardIcons.options />}>
      <div className="flex flex-1 flex-col gap-y-4">
        <div className="flex gap-3">
          <DateTimePicker
            value={startsAt ? new Date(startsAt) : undefined}
            onChange={(date) => setField('startsAt', date ? date.toISOString() : '')}
            min={new Date()}
            max={endsAt ? new Date(endsAt) : undefined}
          />
          <DateTimePicker
            value={endsAt ? new Date(endsAt) : undefined}
            onChange={(date) => setField('endsAt', date ? date.toISOString() : '')}
            min={startsAt ? new Date(startsAt) : undefined}
            max={new Date(new Date().getFullYear() + 10, 11, 31)}
          />
        </div>
        <div className="flex gap-3">
          <Input
            label={t('options.couponCode')}
            placeholder={t('options.couponCode')}
            value={couponCode}
            onChange={(e) => setField('couponCode', e.target.value)}
          />
          <Input
            label={t('options.usageLimit')}
            placeholder={t('options.usageLimit')}
            value={usageLimit}
            type="number"
            onChange={(e) => setField('usageLimit', +e.target.value)}
          />
          <Input
            label={t('options.perCustomerUsageLimit')}
            placeholder={t('options.perCustomerUsageLimit')}
            value={perCustomerUsageLimit}
            type="number"
            onChange={(e) => setField('perCustomerUsageLimit', +e.target.value)}
          />
        </div>
      </div>
    </CustomCard>
  );
};
