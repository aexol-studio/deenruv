import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '@/components';
import { cn } from '@/lib/utils';
import { endOfDay, format, startOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BetterMetricsCustomDates: React.FC<{
  startDate: Date | undefined;
  endDate: Date | undefined;
  setDate: (date: Date | undefined, key: 'start' | 'end') => void;
  isVisible: boolean;
}> = ({ endDate, startDate, setDate, isVisible }) => {
  const { t } = useTranslation('dashboard');
  if (!isVisible) return null;
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'h-[30px] w-[240px] justify-start text-left text-[13px] font-normal',
              !startDate && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, 'PPP') : <span>{t('chooseStartDate')}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={(e) => setDate(e ? startOfDay(e) : e, 'start')}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'h-[30px] w-[240px] justify-start text-left text-[13px] font-normal',
              !endDate && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, 'PPP') : <span>{t('chooseEndDate')}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={(e) => setDate(e ? endOfDay(e) : e, 'end')}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );
};
