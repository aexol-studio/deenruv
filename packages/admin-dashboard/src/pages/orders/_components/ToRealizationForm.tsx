import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  Textarea,
  cn,
  useOrder,
} from '@deenruv/react-ui-devkit';

import { DraftOrderType } from '@/graphql/draft_order';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { AssetsModalInput, ImageWithPreview } from '@/components';

const colors = ['BIAŁA', 'ŻÓŁTA', 'POMARAŃCZOWA', 'RÓŻOWA', 'ZIELONA', 'CZERWONA'];

type Asset = { id: string; orderLineID: string; preview: string };
interface Props {
  onRealizationFinished: () => void;
}

export const ToRealizationForm: React.FC<Props> = ({ onRealizationFinished }) => {
  const { t } = useTranslation('orders');
  const { order } = useOrder();
  const [plannedDate, setPlannedDate] = useState<Date | undefined>(new Date());
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(
    new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
  );
  const [color, setColor] = useState<string>(colors[0]);
  const [note, setNote] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset[]>(
    order?.lines.map((line) => ({
      id: line.productVariant.featuredAsset?.id || '',
      orderLineID: line.id,
      preview: line.productVariant.featuredAsset?.preview || '',
    })) || [],
  );

  const addRealization = async () => {
    if (!order || !deadlineDate || !plannedDate) return;
    // const { registerRealization } = await apiClient('mutation')({
    //   registerRealization: [
    //     {
    //       input: {
    //         orderID: order.id,
    //         color,
    //         finalPlannedAt: format(deadlineDate, 'yyyy-MM-dd'),
    //         plannedAt: format(plannedDate, 'yyyy-MM-dd'),
    //         assets: selectedAsset,
    //         note,
    //       },
    //     },
    //     { url: true },
    //   ],
    // });

    // if (registerRealization?.url) {
    //   window.open(registerRealization.url, '_blank');
    //   onRealizationFinished();
    // }
  };

  return (
    <div className="flex max-h-[60vh] w-auto  min-w-[60vw] max-w-[95vw] flex-col gap-2 overflow-y-auto pr-1">
      <div className="flex gap-4">
        <div className="flex w-[280px] flex-col gap-4">
          <div>
            <Label>{t('changeStatus.planned')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !plannedDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {plannedDate ? format(plannedDate, 'PPP') : <span>{t('changeStatus.datePlaceholder')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={plannedDate} onSelect={setPlannedDate} />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>{t('changeStatus.deadline')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[280px] justify-start text-left font-normal',
                    !plannedDate && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadlineDate ? format(deadlineDate, 'PPP') : <span>{t('changeStatus.datePlaceholder')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={deadlineDate} onSelect={setDeadlineDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>{t('changeStatus.color')}</Label>
            <Select name="color" value={color} onValueChange={(e) => setColor(e)}>
              <SelectTrigger className=" w-[280px] ">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {colors.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>{t('changeStatus.info')}</Label>
            <Textarea
              className="h-[60px] w-[280px]  resize-none"
              maxLength={64}
              value={note}
              onChange={(e) => setNote(e.currentTarget.value)}
            />
            <Label className="text-muted-foreground text-xs ">
              {t('changeStatus.charLeft', { value: 64 - note.length })}
            </Label>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <Label>{t('changeStatus.selectImages')}</Label>
          <div className="flex max-h-[calc(60vh-70px)] flex-1 flex-col gap-2 overflow-y-auto pr-2">
            {order?.lines.map((line) => (
              <Line
                key={line.id}
                line={line}
                asset={selectedAsset.find((a) => a.orderLineID === line.id)}
                onAssetChange={(image) =>
                  setSelectedAsset((prev) =>
                    prev.map((p) =>
                      p.orderLineID === line.id
                        ? { orderLineID: p.orderLineID, id: image?.id || '', preview: image?.preview || '' }
                        : p,
                    ),
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>

      <Button
        className="ml-auto w-min"
        onClick={async () => {
          if (!plannedDate) {
            toast.error(t('changeStatus.plannedError'));
            return;
          }
          if (!deadlineDate) {
            toast.error(t('changeStatus.deadlineError'));
            return;
          }
          if (!color) {
            toast.error(t('changeStatus.colorError'));
            return;
          }
          await addRealization();
        }}
        variant="action"
      >
        {t('changeStatus.button')}
      </Button>
    </div>
  );
};

const Line: React.FC<{
  line: DraftOrderType['lines'][0];
  asset?: { id: string; preview: string };
  onAssetChange: (asset?: { id: string; preview: string }) => void;
}> = ({ line, asset, onAssetChange }) => {
  console.log(asset);

  return (
    <div key={line.id} className="flex items-center gap-4">
      <ImageWithPreview src={asset?.preview} imageClassName="h-20 w-20 object-contain" alt={asset?.id || line.id} />
      <span className="flex-1">{line.productVariant?.name}</span>
      <AssetsModalInput value={asset} setValue={onAssetChange} />
    </div>
  );
};
