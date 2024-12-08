import { Button, Calendar, cn, Popover, PopoverContent, PopoverTrigger } from '@deenruv/react-ui-devkit';
import { endOfDay, format, startOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface MetricsCustomDatesProps {
    startDate: Date | undefined;
    endDate: Date | undefined;
    setDate: (date: Date | undefined, key: 'start' | 'end') => void;
    isVisible: boolean;
}

export const MetricsCustomDates: React.FC<MetricsCustomDatesProps> = ({
    endDate,
    startDate,
    setDate,
    isVisible,
}) => {
    const { t } = useTranslation('dashboard-widgets-plugin', {
        i18n: window.__DEENRUV_SETTINGS__.i18n,
    });
    if (!isVisible) return null;
    return (
        <div className="flex flex-col xl:flex-row gap-2 justify-end">
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'h-[30px] w-full max-w-[240px] justify-start text-left text-[13px] font-normal',
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
                        onSelect={e => setDate(e ? startOfDay(e) : e, 'start')}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                            'h-[30px] w-full max-w-[240px] justify-start text-left text-[13px] font-normal',
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
                        onSelect={e => setDate(e ? endOfDay(e) : e, 'end')}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};
