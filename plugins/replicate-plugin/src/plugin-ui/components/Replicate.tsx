import React, { useState, type MouseEvent, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { addDays, format } from 'date-fns';
import { Check, ChevronsUpDown, CalendarIcon } from 'lucide-react';
import { cn } from '@deenruv/react-ui-devkit';
import { DateRange } from 'react-day-picker';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Dialog,
    DialogTrigger,
    Input,
    Label,
    useLazyQuery,
    useMutation,
    useSettings,
} from '@deenruv/react-ui-devkit';
import { translationNS } from '../translation-ns';
import { useForm, useFormContext, FormProvider } from 'react-hook-form';
import { startOrderExportToReplicateMutation } from '../graphql/mutations.js';
import { getPredictionQuery, getPredictionIDQuery } from '../graphql/queries.js';
import { PredictionStatus, PredictionType } from '../zeus/index.js';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Calendar,
} from '@deenruv/react-ui-devkit';

type Formvalues = {
    num_last_order: number;
    start_date: string;
    end_date: string;
    predict_type: PredictionType;
    show_metrics: boolean;
};

const predictionTypes = [
    {
        value: PredictionType.RFM_SCORE,
        label: 'RFM Score',
    },
    {
        value: PredictionType.SEGMENTATION,
        label: 'Segmentation',
    },
];

export function PredictionTypeCombobox() {
    const { setValue, watch } = useFormContext<Formvalues>();
    const [open, setOpen] = React.useState(false);
    const value = watch('predict_type');

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value ? predictionTypes.find(pt => pt.value === value)?.label : 'Select prediction type'}
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <Command>
                    <CommandInput placeholder="Search prediction type..." />
                    <CommandList>
                        <CommandEmpty>No prediction type found.</CommandEmpty>
                        <CommandGroup>
                            {predictionTypes.map(prediction_type => (
                                <CommandItem
                                    key={prediction_type.value}
                                    value={prediction_type.value}
                                    onSelect={currentValue => {
                                        setValue('predict_type', currentValue as PredictionType);
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            'mr-2 h-4 w-4',
                                            value === prediction_type.value ? 'opacity-100' : 'opacity-0',
                                        )}
                                    />
                                    {prediction_type.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

function DatePickerWithRange({ className }: React.HTMLAttributes<HTMLDivElement>) {
    const { setValue, watch } = useFormContext<Formvalues>();
    const [date, setDate] = React.useState<DateRange | undefined>(undefined);

    useEffect(() => {
        if (date?.from) {
            setValue('start_date', format(date.from, 'yyyy-MM-dd'));
        }
        if (date?.to) {
            setValue('end_date', format(date.to, 'yyyy-MM-dd'));
        }
    }, [date, setValue]);

    const startDate = watch('start_date');
    const endDate = watch('end_date');

    useEffect(() => {
        if (startDate || endDate) {
            setDate({
                from: startDate ? new Date(startDate) : undefined,
                to: endDate ? new Date(endDate) : undefined,
            });
        }
    }, [startDate, endDate]);

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={'outline'}
                        className={cn(
                            'w-[300px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground',
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                                </>
                            ) : (
                                format(date.from, 'LLL dd, y')
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}

const MAX_RETRIES = 25;
const MAX_RETRIES_PREDICTION = 50;
export const ReplicateInput = () => {
    const { t } = useTranslation(translationNS);
    const methods = useForm<Formvalues>({
        defaultValues: {
            num_last_order: 10000,
            start_date: '',
            end_date: '',
            predict_type: PredictionType.RFM_SCORE,
            show_metrics: true,
        },
    });
    const { register, handleSubmit } = methods;
    const [startOrderExportToReplicate] = useMutation(startOrderExportToReplicateMutation);
    const [getData, { data }] = useLazyQuery(getPredictionQuery);
    const [getPredictionID] = useLazyQuery(getPredictionIDQuery);
    const [predictionID, setPredictionID] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [predictionEntityID, setPredictionEntityID] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(true);
    const retryCountRef = useRef(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (!predictionEntityID || !isPolling) return;

        intervalRef.current = setInterval(() => {
            if (retryCountRef.current >= MAX_RETRIES) {
                console.warn('Max retries reached. Stopping polling.');
                clearInterval(intervalRef.current as NodeJS.Timeout);
                setIsPolling(false);
                return;
            }

            getPredictionID({
                prediction_entity_id: predictionEntityID,
            })
                .then(response => {
                    if (response?.getPredictionID) {
                        clearInterval(intervalRef.current as NodeJS.Timeout);
                        setIsPolling(false);
                        setPredictionID(response.getPredictionID);
                    } else {
                        retryCountRef.current += 1;
                    }
                })
                .catch(error => {
                    console.error('Error fetching prediction:', error);
                    retryCountRef.current += 1;
                });
        }, 5000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [predictionEntityID, isPolling]);

    const retryPredictionCountRef = useRef(0);
    const intervalPredictionRef = useRef<NodeJS.Timeout | null>(null);
    useEffect(() => {
        if (!predictionID) return;
        intervalPredictionRef.current = setInterval(() => {
            if (retryPredictionCountRef.current >= MAX_RETRIES_PREDICTION) {
                console.warn('Max retries reached. Stopping polling.');
                clearInterval(intervalPredictionRef.current as NodeJS.Timeout);
                return;
            }
            getData({
                prediction_id: predictionID,
            })
                .then(response => {
                    if (response?.getPrediction.status === PredictionStatus.succeeded) {
                        clearInterval(intervalPredictionRef.current as NodeJS.Timeout);
                        setLoading(false);
                    } else if (response?.getPrediction.status === PredictionStatus.failed) {
                        clearInterval(intervalPredictionRef.current as NodeJS.Timeout);
                        setLoading(false);
                        setPredictionID(null);
                    } else {
                        retryPredictionCountRef.current += 1;
                    }
                })
                .catch(error => {
                    console.error('Error fetching prediction:', error);
                    retryPredictionCountRef.current += 1;
                });
        }, 5000);
        return () => {
            if (intervalPredictionRef.current) clearInterval(intervalPredictionRef.current);
        };
    }, [predictionID]);

    const submit = async (data: Formvalues) => {
        try {
            console.log('data', data);
            const response = await startOrderExportToReplicate({
                input: {
                    numLastOrder: Number(data.num_last_order),
                    startDate: new Date(data.start_date),
                    endDate: new Date(data.end_date),
                    predictType: data.predict_type,
                    showMetrics: data.show_metrics,
                },
            });

            setPredictionEntityID(response.startOrderExportToReplicate);
            setLoading(true);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <FormProvider {...methods}>
            <div className="flex w-full gap-8 justify-beetwen p-16">
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-2">
                                <CardTitle>{t('Set up your model')}</CardTitle>
                                <CardDescription>
                                    {t('model parametes:\n Set number of latest orders or orders data range')}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1 mt-2">
                                <Label>{t('Number of latest orders:')}</Label>
                                <Input {...register('num_last_order')} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1 mt-2">
                                <Label>{t('Orders data range:')}</Label>
                                <DatePickerWithRange />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1 mt-2">
                                <Label>{t('Prediction type:')}</Label>
                                <PredictionTypeCombobox />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button onClick={handleSubmit(data => submit(data))}>{t('Run model')}</Button>
                        </div>
                    </CardContent>
                </Card>
                <Card className="w-full">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="flex flex-col gap-2">
                                <CardTitle>{t('The most promising customers')}</CardTitle>
                                <CardDescription>{t('customer emails:')}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div>{t('loading')}</div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                {data?.getPrediction.predictions && (
                                    <div>
                                        [
                                        {(data.getPrediction.predictions ?? [])
                                            .filter((prediction: any) => prediction.email !== 'no-email')
                                            .map((prediction: any, index: number) => (
                                                <span key={prediction.id}>
                                                    {prediction.email}
                                                    {index <
                                                        (data.getPrediction.predictions ?? []).length - 1 &&
                                                        ', '}
                                                </span>
                                            ))}
                                        ]
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </FormProvider>
    );
};
