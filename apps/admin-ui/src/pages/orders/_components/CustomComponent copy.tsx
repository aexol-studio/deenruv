import { useEffect, useMemo, useState } from 'react';
import { apiCall } from '@/graphql/client';
import { Selector } from '@/zeus';
import { FromSelectorWithScalars } from '@/graphql/scalars';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Checkbox,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  Label,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components';
import { useTranslation } from 'react-i18next';
import placeholder from '@/assets/image-placeholder.svg';
import { cn } from '@/lib/utils';
import { Trash } from 'lucide-react';

const ProductSelector = Selector('Product')({
  slug: true,
  facetValues: {
    id: true,
    code: true,
    name: true,
    customFields: { hexColor: true, image: { preview: true } },
    facet: { id: true, name: true, code: true, customFields: { usedForProductCreations: true } },
  },
});
type ProductType = FromSelectorWithScalars<typeof ProductSelector, 'Product'>;
type Facet = { id: string; code: string; name: string; hexColor?: string; imagePreview?: string };
type Data = {
  id: string;
  code: string;
  name: string;
  usedForProductCreations: boolean;
  facetValues: Facet[];
};

const match = (facetValues?: ProductType['facetValues']) => {
  if (!facetValues) return [];
  const facets = facetValues.reduce((acc, item) => {
    const facet = acc.find((f) => f.id === item.facet.id);
    const newItem: Facet = {
      code: item.code,
      id: item.id,
      name: item.name,
      hexColor: item.customFields?.hexColor,
      imagePreview: item.customFields?.image?.preview,
    };
    if (facet) {
      facet.facetValues.push(newItem);
    } else {
      acc.push({
        id: item.facet.id,
        code: item.facet.code,
        name: item.facet.name,
        usedForProductCreations: !!item.facet.customFields?.usedForProductCreations,
        facetValues: [newItem],
      });
    }
    return acc;
  }, [] as Data[]);
  return facets;
};

export const CustomComponent = ({
  value,
  setValue,
  productId,
}: {
  value: string | null;
  setValue: (value: string) => void;
  productId?: string;
}) => {
  const { t } = useTranslation('orders');
  const [facets, setFacets] = useState<Data[]>([]);
  const currentValue = useMemo(() => (value ? (JSON.parse(value as string) as Record<string, string>) : {}), [value]);
  const [defined, setDefined] = useState<Record<string, string>>({});
  const [custom, setCustom] = useState<{ id: string; key: string; value: string }[]>([]);

  useEffect(() => {
    const init = async () => {
      if (!productId) return;
      const { product } = await apiCall()('query')({
        product: [{ id: productId }, ProductSelector],
      });
      setFacets(match(product?.facetValues));
    };
    init();
  }, [productId]);

  useEffect(() => {
    if (facets) {
      setDefined(
        Object.keys(currentValue)
          .filter((i) => facets.some((a) => a.code === i))
          .reduce((acc, val) => ({ ...acc, [val]: currentValue[val] }), {}),
      );
      setCustom(
        Object.keys(currentValue)
          .filter((i) => !facets.some((a) => a.code === i))
          .map((i) => ({
            id: uuidv4(),
            value: currentValue[i],
            key: i,
          })),
      );
    }
  }, [facets, currentValue]);

  const onDefinedChange = (key: string, value: string) => {
    const newSelectedValues = { ...defined };
    if (newSelectedValues[key] === value || value === '') {
      delete newSelectedValues[key];
    } else {
      newSelectedValues[key] = value;
    }
    setDefined(newSelectedValues);
  };

  return facets.length ? (
    <div>
      <div className="flex items-center justify-between gap-4 ">
        <Button
          variant="secondary"
          className="w-min"
          onClick={() => setCustom((p) => [...p, { key: '', value: '', id: uuidv4() }])}
        >
          {t('custom.addCustomKey')}
        </Button>
        <Label>{t('custom.customAdditional', { value: custom.length })}</Label>
      </div>
      <ScrollArea className="h-[50vh]">
        <div className="flex flex-col gap-4 ">
          {facets.map((facet) => {
            const isCustom = !facet.facetValues.some((i) => i.code === defined[facet.code]);
            return (
              <div key={facet.id} className="border-b pb-2">
                <div className="mb-2 font-bold">{facet.name}</div>
                <div className="grid  grid-cols-4 items-center gap-2">
                  {facet.facetValues.map((value) => (
                    <GroupValue
                      key={value.id}
                      entry={value}
                      isValueSelected={defined[facet.code] === value.code}
                      handleFacetValueSelect={() => onDefinedChange(facet.code, value.code)}
                    />
                  ))}
                </div>
                <div className="my-2 flex items-center gap-2">
                  <span className="shrink-0">{t('custom.customLabel')}</span>
                  <Input
                    placeholder={t('custom.customPlaceholder')}
                    value={isCustom ? defined[facet.code] : ''}
                    onChange={(e) => onDefinedChange(facet.code, e.currentTarget.value)}
                  />
                </div>
              </div>
            );
          })}{' '}
          {facets.map((facet) => {
            const isCustom = !facet.facetValues.some((i) => i.code === defined[facet.code]);
            return (
              <div key={facet.id}>
                <div className="mb-2 font-bold">{facet.name}</div>
                <div className="grid  grid-cols-4 items-center gap-2">
                  {facet.facetValues.map((value) => (
                    <GroupValue
                      key={value.id}
                      entry={value}
                      isValueSelected={defined[facet.code] === value.code}
                      handleFacetValueSelect={() => onDefinedChange(facet.code, value.code)}
                    />
                  ))}
                </div>
                <div className="my-2 max-w-[300px]">
                  <Input
                    label={t('custom.customLabel')}
                    placeholder={t('custom.customPlaceholder')}
                    value={isCustom ? defined[facet.code] : ''}
                    onChange={(e) => onDefinedChange(facet.code, e.currentTarget.value)}
                  />
                </div>
              </div>
            );
          })}{' '}
          {facets.map((facet) => {
            const isCustom = !facet.facetValues.some((i) => i.code === defined[facet.code]);
            return (
              <div key={facet.id}>
                <div className="mb-2 font-bold">{facet.name}</div>
                <div className="grid  grid-cols-4 items-center gap-2">
                  {facet.facetValues.map((value) => (
                    <GroupValue
                      key={value.id}
                      entry={value}
                      isValueSelected={defined[facet.code] === value.code}
                      handleFacetValueSelect={() => onDefinedChange(facet.code, value.code)}
                    />
                  ))}
                </div>
                <div className="my-2 max-w-[300px]">
                  <Input
                    label={t('custom.customLabel')}
                    placeholder={t('custom.customPlaceholder')}
                    value={isCustom ? defined[facet.code] : ''}
                    onChange={(e) => onDefinedChange(facet.code, e.currentTarget.value)}
                  />
                </div>
              </div>
            );
          })}{' '}
          {facets.map((facet) => {
            const isCustom = !facet.facetValues.some((i) => i.code === defined[facet.code]);
            return (
              <div key={facet.id}>
                <div className="mb-2 font-bold">{facet.name}</div>
                <div className="grid  grid-cols-4 items-center gap-2">
                  {facet.facetValues.map((value) => (
                    <GroupValue
                      key={value.id}
                      entry={value}
                      isValueSelected={defined[facet.code] === value.code}
                      handleFacetValueSelect={() => onDefinedChange(facet.code, value.code)}
                    />
                  ))}
                </div>
                <div className="my-2 max-w-[300px]">
                  <Input
                    label={t('custom.customLabel')}
                    placeholder={t('custom.customPlaceholder')}
                    value={isCustom ? defined[facet.code] : ''}
                    onChange={(e) => onDefinedChange(facet.code, e.currentTarget.value)}
                  />
                </div>
              </div>
            );
          })}
          {custom.map((i) => (
            <div className="flex items-center justify-start gap-4" key={i.id}>
              <div className="w-[300px]">
                <Input
                  label={t('custom.customKey')}
                  value={i.key}
                  onChange={(e) =>
                    setCustom((p) => {
                      const copy = [...p];
                      const index = copy.findIndex((c) => c.id === i.id);
                      if (index !== -1) copy[index].key = e.currentTarget.value;
                      return copy;
                    })
                  }
                />
              </div>
              <div className="w-[300px]">
                <Input
                  label={t('custom.customValue')}
                  value={i.value}
                  onChange={(e) =>
                    setCustom((p) => {
                      const copy = [...p];
                      const index = copy.findIndex((c) => c.id === i.id);
                      if (index !== -1) copy[index].value = e.currentTarget.value;
                      return copy;
                    })
                  }
                />
              </div>
              <Trash
                className="mt-[20px] cursor-pointer text-red-600"
                onClick={() => {
                  setCustom((p) => p.filter((a) => a.id !== i.id));
                }}
              />
            </div>
          ))}
          <Label>{t('custom.customAdditional', { value: custom.length })}</Label>
          <Button
            variant="secondary"
            className="w-min"
            onClick={() => setCustom((p) => [...p, { key: '', value: '', id: uuidv4() }])}
          >
            {t('custom.addCustomKey')}
          </Button>
        </div>
      </ScrollArea>
      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setDefined(
              Object.keys(currentValue)
                .filter((i) => facets.some((a) => a.code === i))
                .reduce((acc, val) => ({ ...acc, [val]: currentValue[val] }), {}),
            );
            setCustom(
              Object.keys(currentValue)
                .filter((i) => !facets.some((a) => a.code === i))
                .map((i) => ({
                  id: uuidv4(),
                  value: currentValue[i],
                  key: i,
                })),
            );
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            {t('custom.selectAttributes')}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[80vw]">
          <DialogHeader>
            <DialogTitle>{t('custom.selectAttributes')}</DialogTitle>
            <DialogDescription>{t('custom.selectAttributesDescription')}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[50vh]">
            <div className="flex flex-col gap-4 ">
              <Label>{t('custom.customAdditional', { value: custom.length })}</Label>
              <Button
                variant="secondary"
                className="w-min"
                onClick={() => setCustom((p) => [...p, { key: '', value: '', id: uuidv4() }])}
              >
                {t('custom.addCustomKey')}
              </Button>
            </div>
          </ScrollArea>
          <DialogFooter>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                {Object.keys(defined).length + custom.length > 0
                  ? t('custom.selectedAttributesValue', { value: Object.keys(defined).length + custom.length })
                  : t('custom.noSelectedAttributes')}
              </span>
              {custom.length > 0 && custom.some((i) => !i.key || !i.value) ? (
                <DialogClose>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button disabled={true}>{t('custom.close')}</Button>
                      </TooltipTrigger>
                      <TooltipContent align="end" className="bg-red-50">
                        <p className="text-red-400">{t('custom.hint')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </DialogClose>
              ) : (
                <DialogClose asChild>
                  <Button
                    onClick={() => {
                      const newSelectedValues: Record<string, string> = {
                        ...defined,
                        ...custom.reduce<Record<string, string>>(
                          (acc, item) => ({ ...acc, [item.key]: item.value }),
                          {},
                        ),
                      };
                      const json = JSON.stringify(newSelectedValues);
                      setValue(json);
                    }}
                  >
                    {t('custom.close')}
                  </Button>
                </DialogClose>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ) : null;
};

const GroupValue = ({
  entry,
  handleFacetValueSelect,
  isValueSelected,
}: {
  entry: Facet;
  handleFacetValueSelect: () => void;
  isValueSelected: boolean;
}) => {
  return (
    <div className="flex items-center gap-2 px-1">
      <Checkbox id={entry.id} checked={isValueSelected} onCheckedChange={handleFacetValueSelect} />
      <label htmlFor={entry.id}>
        <HoverCard openDelay={300}>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-2">
              {entry.imagePreview ? (
                <img className="h-5 w-5 rounded-full" src={entry.imagePreview || placeholder} />
              ) : (
                <div
                  className="h-5 w-5 rounded-full border-[1px] border-[rgba(0,0,0,0.4)]"
                  style={{ backgroundColor: entry?.hexColor || 'transparent' }}
                ></div>
              )}
              <div className="text-nowrap">{entry.name}</div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className={cn('w-80 p-0', !entry.imagePreview && 'h-40 w-40')}>
            {entry?.imagePreview ? (
              <img className="rounded object-cover" src={entry.imagePreview || placeholder} />
            ) : (
              <div className="h-40 w-40 rounded" style={{ backgroundColor: entry?.hexColor || 'transparent' }} />
            )}
          </HoverCardContent>
        </HoverCard>
      </label>
    </div>
  );
};
