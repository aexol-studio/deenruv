import { Button, DialogFooter, Input, Label } from '@/components';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DraftOrderLineType } from '@/graphql/draft_order';

import { cn } from '@/lib/utils';

import { priceFormatter } from '@/utils';

import { RotateCcw } from 'lucide-react';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OnPriceQuantityChangeApproveInput } from './types.js';

type PriceType = 'brutto' | 'netto';

interface ActionQuantityPriceProps {
  line?: DraftOrderLineType;
  onOpenChange: (open: boolean) => void;
  onPriceQuantityChangeApprove: (input: OnPriceQuantityChangeApproveInput) => Promise<void>;
}

export const ActionQuantityPrice: React.FC<ActionQuantityPriceProps> = ({
  line,
  onOpenChange,

  onPriceQuantityChangeApprove,
}) => {
  const { t } = useTranslation('orders');
  const priceInputRef = useRef<HTMLInputElement | null>(null);
  const [priceType, setPriceType] = useState<PriceType>('netto');
  const [quantityChange, setQuantityChange] = useState<number | undefined>(undefined);
  const [initLinePrice, _] = useState<number | undefined>();
  const [priceChange, setPriceChange] = useState({ netto: 0, brutto: 0 });
  const TAX_RATE = useMemo(() => (line?.taxRate ? line.taxRate / 100 : 0), [line?.taxRate]);
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value) setQuantityChange(0);
    const value = parseInt(e.currentTarget.value, 10);
    setQuantityChange(value);
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.currentTarget.value) {
      setPriceChange({ netto: 0, brutto: 0 });
      return;
    }
    const value = parseInt(e.currentTarget.value, 10) * 100;
    if (priceType === 'brutto') setPriceChange({ netto: value / (1 + TAX_RATE), brutto: value });
    else setPriceChange({ netto: value, brutto: value * (1 + TAX_RATE) });
  };

  const handlePriceTypeChange = (newPriceType: PriceType) => {
    setPriceType(newPriceType);
    setPriceChange((prevPrice) => {
      if (newPriceType === 'brutto') {
        const newNetto = prevPrice.netto - prevPrice.netto * TAX_RATE;
        return { netto: newNetto, brutto: prevPrice.netto };
      } else {
        const newBrutto = prevPrice.brutto * (1 + TAX_RATE);
        return { netto: prevPrice.brutto, brutto: newBrutto };
      }
    });
  };
  const handleSetInitialPrice = () => {
    if (!initLinePrice) return;
    if (priceInputRef.current) priceInputRef.current.value = (initLinePrice / 100).toFixed(2);
    setPriceType('netto');
    setPriceChange({ netto: initLinePrice, brutto: initLinePrice * (1 + TAX_RATE) });
  };
  const quantityDelta = useMemo(
    () => (quantityChange ? quantityChange - (line?.quantity ?? 0) : 0),
    [quantityChange, line?.quantity],
  );
  const priceDelta = useMemo(
    () => ({
      netto: priceChange.netto !== 0 ? priceChange.netto - (line?.linePrice ? line.linePrice / line.quantity : 0) : 0,
      brutto:
        priceChange.brutto !== 0
          ? priceChange.brutto - (line?.linePrice ? (line.linePrice * (1 + TAX_RATE)) / line.quantity : 0)
          : 0,
    }),
    [priceChange, line?.linePrice, TAX_RATE, line?.quantity],
  );

  const handleApprove = async () => {
    if (!line?.id) return;
    onPriceQuantityChangeApprove({
      lineID: line.id,
      priceChange: priceChange.netto,
      pricewithTaxChange: priceChange.brutto,
      quantityChange: quantityChange,
      isNettoPrice: priceType === 'netto',
    });
    onOpenChange(false);
  };
  useEffect(() => {
    if (!line?.id) return;
    (async () => {
      try {
        // const { getInitialLinePrice } = await apiCall()('query')({
        //   getInitialLinePrice: [{ lineID: line?.id ?? '' }, true],
        // });
        // if (getInitialLinePrice) {
        //   setInitLinePrice(getInitialLinePrice);
        // }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [line?.id]);

  return (
    <>
      <div className="flex grow flex-col gap-10">
        <div className="flex items-center gap-4">
          <img
            alt="Product image"
            className="aspect-square w-24 rounded-md border object-cover"
            height="96"
            width="96"
            src={line?.productVariant?.featuredAsset?.preview || line?.productVariant?.product?.featuredAsset?.preview}
          />
          <span>{line?.productVariant.name}</span>
        </div>
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-y-28">
          <div className="flex h-full w-full flex-col gap-2">
            <span>{t('orderLineActionModal.quantityChange')}</span>
            <Input
              min={0}
              value={quantityChange}
              onChange={handleQuantityChange}
              className="w-full"
              type="number"
              placeholder={t('orderLineActionModal.changeQuantity')}
            />
          </div>
          <div className="grid shrink-0 grid-cols-3 gap-2 gap-x-5">
            <span className="min-w-max">{t('orderLineActionModal.actualQuantity')}</span>
            <span />
            <span className="text-right">{line?.quantity}</span>
            <span className="text-muted-foreground">{t('orderLineActionModal.change')}</span>
            <span />
            <span
              className={cn('text-right text-muted-foreground', {
                'text-destructive': quantityDelta < 0,
                'text-green-500': quantityDelta > 0,
              })}
            >
              {quantityDelta > 0 ? `+ ${quantityDelta}` : quantityDelta}
            </span>
            <span className="col-span-3 h-[1px] bg-secondary"></span>
            <span className="min-w-max">{t('orderLineActionModal.quantityAfter')}</span>
            <span />
            <span className="text-right">{(quantityChange ?? 0) > 0 ? quantityChange : line?.quantity}</span>
          </div>
          <div className="flex h-full w-full flex-col gap-2">
            <span className="h-4" />
            <div className="flex justify-between ">
              <span>{t('orderLineActionModal.newPrice')}</span>
              <RadioGroup
                onValueChange={(priceType) => handlePriceTypeChange(priceType as PriceType)}
                value={priceType}
                className="flex cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="netto" id="r1" />
                  <Label className="cursor-pointer" htmlFor="r1">
                    Netto
                  </Label>
                </div>
                <div className="flex cursor-pointer items-center space-x-2">
                  <RadioGroupItem value="brutto" id="r2" />
                  <Label className="cursor-pointer" htmlFor="r2">
                    Brutto
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Input
              ref={priceInputRef}
              min={0}
              onChange={handlePriceChange}
              className="w-full"
              type="number"
              placeholder={t('orderLineActionModal.changePrice')}
            />
            <Button
              onClick={handleSetInitialPrice}
              className={cn('mt-10  hidden', initLinePrice && 'flex gap-2')}
              variant="secondary"
            >
              <RotateCcw />
              <span>
                {`${t('orderLineActionModal.resetPrice')} (${priceFormatter(initLinePrice ?? 0, line?.productVariant.currencyCode)} netto)`}
              </span>
            </Button>
          </div>
          <div className="grid shrink-0 grid-cols-3 gap-2 gap-x-5">
            <span />
            <span className="text-right text-xs text-muted-foreground">Netto</span>
            <span className="text-right text-xs text-muted-foreground">{`Brutto (${TAX_RATE * 100}%)`}</span>
            <span className="min-w-max">{t('orderLineActionModal.actualPrice')}</span>
            <span className="text-right">
              {priceFormatter(line?.linePrice ? line.linePrice / line?.quantity : 0, line?.productVariant.currencyCode)}
            </span>
            <span className="text-right">
              {priceFormatter(
                line?.linePrice ? (line.linePrice * (1 + TAX_RATE)) / line?.quantity : 0,
                line?.productVariant.currencyCode,
              )}
            </span>
            <span className="text-muted-foreground">{t('orderLineActionModal.change')}</span>
            <span
              className={cn('text-right text-muted-foreground', {
                'text-destructive': priceDelta.netto < 0,
                'text-green-500': priceDelta.netto > 0,
              })}
            >
              {priceDelta.brutto > 0
                ? `+ ${priceFormatter(priceDelta.netto, line?.productVariant.currencyCode)}`
                : priceFormatter(priceDelta.netto, line?.productVariant.currencyCode)}
            </span>{' '}
            <span
              className={cn('text-right text-muted-foreground', {
                'text-destructive': priceDelta.brutto < 0,
                'text-green-500': priceDelta.brutto > 0,
              })}
            >
              {priceDelta.brutto > 0
                ? `+ ${priceFormatter(priceDelta.brutto, line?.productVariant.currencyCode)}`
                : priceFormatter(priceDelta.brutto, line?.productVariant.currencyCode)}
            </span>
            <span className="col-span-3 h-[1px] bg-secondary"></span>
            <span className="min-w-max">{t('orderLineActionModal.priceAfter')}</span>
            <span className="text-right">{priceFormatter(priceChange.netto, line?.productVariant.currencyCode)}</span>
            <span className="text-right">{priceFormatter(priceChange.brutto, line?.productVariant.currencyCode)}</span>
          </div>
        </div>
      </div>{' '}
      <DialogFooter>
        <Button onClick={() => onOpenChange(false)} variant="ghost">
          {t('orderLineActionModal.cancel')}
        </Button>
        <Button onClick={handleApprove}>{t('orderLineActionModal.save')}</Button>
      </DialogFooter>{' '}
    </>
  );
};
