import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
  DropdownMenuItem,
  Separator,
  apiClient,
  CustomCard,
  CardIcons,
} from '@deenruv/react-ui-devkit';

import { StockLevelsType } from '@/graphql/products';
import { GlobalFlag } from '@deenruv/admin-types';
import { MapPin } from 'lucide-react';
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface StockLevelsValueType {
  stockLocationId: string;
  stockOnHand: number;
}

interface StockCardProps {
  priceValue: number | undefined | null;
  onThresholdChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onUseGlobalChange: (e: boolean) => void;
  onTrackInventoryChange: (e: GlobalFlag) => void;
  onStockOnHandChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onStockLocationsChange: (e: StockLevelsValueType[]) => void;
  taxRateValue: string | undefined | null;
  stockLevelsValue: StockLevelsValueType[] | undefined | null;
  stockOnHandValue: number | undefined | null;
  stockAllocated: number | undefined | null;
  outOfStockThresholdValue: number | undefined | null;
  useGlobalOutOfStockThresholdValue: boolean | undefined | null;
  trackInventoryValue: GlobalFlag | undefined | null;
  allStockLocations: StockLevelsType[] | undefined | null;
}

export const StockCard: React.FC<StockCardProps> = ({
  outOfStockThresholdValue,
  stockOnHandValue,
  useGlobalOutOfStockThresholdValue,
  trackInventoryValue,
  stockAllocated,
  stockLevelsValue,
  allStockLocations,
  onThresholdChange,
  onUseGlobalChange,
  onTrackInventoryChange,
  onStockOnHandChange,
  onStockLocationsChange,
}) => {
  const { t } = useTranslation('products');
  const [stockLocations, setStockLocations] = useState<{ id: string; name: string }[]>([]);

  const notUsedStockLocations = useMemo(
    () => stockLocations.filter((sL) => stockLevelsValue?.findIndex((v) => v.stockLocationId === sL.id) === -1),
    [stockLocations, stockLevelsValue],
  );

  const fetchStockLocations = useCallback(async () => {
    const response = await apiClient('query')({
      stockLocations: [
        {},
        {
          items: {
            id: true,
            name: true,
          },
        },
      ],
    });

    setStockLocations(response.stockLocations.items);
  }, []);

  useEffect(() => {
    fetchStockLocations();
  }, [fetchStockLocations]);

  const handleChangeStockLocation = useCallback(
    (location: StockLevelsValueType) => {
      const newLevels = stockLevelsValue ? [...stockLevelsValue] : [];
      const elementIdx = newLevels.findIndex((l) => l.stockLocationId === location.stockLocationId);

      if (elementIdx !== -1) {
        newLevels[elementIdx].stockOnHand = location.stockOnHand;
      } else {
        newLevels.push(location);
      }

      onStockLocationsChange(newLevels);
    },
    [onStockLocationsChange, stockLevelsValue],
  );

  const getLocationAllocatedValue = useCallback(
    (id: string) => allStockLocations?.find((e) => e.stockLocationId === id)?.stockAllocated,
    [allStockLocations],
  );

  return (
    <CustomCard title={t('details.stockLevels')} color="blue" icon={<CardIcons.stock />}>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-start justify-start gap-x-4">
          <div className="w-1/2">
            <Input
              type="number"
              placeholder={t('details.outThreshold')}
              label={t('details.outThreshold')}
              value={outOfStockThresholdValue ?? undefined}
              onChange={onThresholdChange}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Label>{t('details.useGlobal')}</Label>
            <Switch checked={useGlobalOutOfStockThresholdValue ?? undefined} onCheckedChange={onUseGlobalChange} />
          </div>
        </div>
        <div className="flex flex-col items-start justify-start gap-2">
          <Label>{t('details.trackInventory')}</Label>
          <Select
            value={trackInventoryValue ?? undefined}
            onValueChange={(value: GlobalFlag) => onTrackInventoryChange(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={GlobalFlag.INHERIT}>{t('details.inherit')}</SelectItem>
              <SelectItem value={GlobalFlag.TRUE}>{t('details.track')}</SelectItem>
              <SelectItem value={GlobalFlag.FALSE}>{t('details.notTrack')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator orientation="horizontal" />
        <div className="flex items-start justify-start gap-4">
          <div className="w-1/2">
            <Input
              type="number"
              label={t('details.defaultStock1')}
              value={stockOnHandValue ?? undefined}
              disabled
              // onChange={onStockOnHandChange}
            />
          </div>
          <div className="flex w-1/2 flex-col gap-3">
            <Label>{t('details.defaultStock2')}</Label>
            {stockAllocated}
          </div>
        </div>
        {stockLevelsValue?.map((sL) => (
          <div key={'inputs' + sL.stockLocationId} className="flex items-start justify-start gap-4">
            <div className="w-1/2">
              <Input
                type="number"
                label={`Stock location: ${stockLocations.find((l) => l.id === sL.stockLocationId)?.name}`}
                value={sL.stockOnHand}
                onChange={(e) =>
                  handleChangeStockLocation({ stockLocationId: sL.stockLocationId, stockOnHand: +e.target.value })
                }
              />
            </div>
            <div className="flex w-1/2 flex-col gap-3">
              <Label>Allocated</Label>
              {getLocationAllocatedValue(sL.stockLocationId)}
            </div>
          </div>
        ))}
        <div className="flex">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild disabled={!notUsedStockLocations.length}>
              <Button size={'sm'} className="mt-4">
                {t('details.addStockLocation')}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" side="bottom" align="end">
              <DropdownMenuGroup>
                {notUsedStockLocations.map((sL) => (
                  <DropdownMenuItem
                    key={'dropdown' + sL.id}
                    onClick={() => handleChangeStockLocation({ stockLocationId: sL.id, stockOnHand: 0 })}
                  >
                    <MapPin className="mr-2" />
                    {sL.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CustomCard>
  );
};
