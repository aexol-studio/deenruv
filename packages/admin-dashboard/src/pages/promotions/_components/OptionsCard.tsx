import {
  Input,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  Calendar,
  cn,
  Label,
  CustomCard,
  CardIcons,
} from '@deenruv/react-ui-devkit';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';

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
          <Popover>
            <div className="flex flex-1 flex-col">
              <Label className="mb-2">{t('options.startsAt')}</Label>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn('pl-3 text-left font-normal', !startsAt && 'text-muted-foreground')}
                >
                  {startsAt ? format(new Date(startsAt), 'PPP') : <span>{t('options.pickDate')}</span>}
                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                </Button>
              </PopoverTrigger>
            </div>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startsAt as unknown as Date}
                onSelect={(date) => setField('startsAt', date as unknown as string)}
                disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Popover>
            <div className="flex flex-1 flex-col">
              <Label className="mb-2">{t('options.endsAt')}</Label>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn('pl-3 text-left font-normal', endsAt && 'text-muted-foreground')}
                >
                  {endsAt ? format(new Date(endsAt), 'PPP') : <span>{t('options.pickDate')}</span>}
                  <CalendarIcon className="ml-auto size-4 opacity-50" />
                </Button>
              </PopoverTrigger>
            </div>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endsAt as unknown as Date}
                onSelect={(date) => setField('endsAt', date as unknown as string)}
                disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
