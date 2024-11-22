import { useEffect, useMemo, useState } from 'react';

import { Selector } from '@deenruv/admin-types';
import { FromSelectorWithScalars } from '@/graphql/scalars';
import { v4 as uuidv4 } from 'uuid';
import {
  Button,
  Checkbox,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
  Input,
  Label,
  apiClient,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { InfoIcon, Trash } from 'lucide-react';

const ProductSelector = Selector('Product')({
  slug: true,
  facetValues: {
    id: true,
    code: true,
    name: true,
    // customFields: { hexColor: true, image: { preview: true } },
    facet: {
      id: true,
      name: true,
      code: true,
      // customFields: { usedForProductCreations: true }
    },
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
      // hexColor: item.customFields?.hexColor,
      // imagePreview: item.customFields?.image?.preview,
    };
    if (facet) {
      facet.facetValues.push(newItem);
    } else {
      acc.push({
        id: item.facet.id,
        code: item.facet.code,
        name: item.facet.name,
        // usedForProductCreations: !!item.facet.customFields?.usedForProductCreations,
        usedForProductCreations: true,
        facetValues: [newItem],
      });
    }
    return acc;
  }, [] as Data[]);
  return facets;
};

export const CustomComponent = ({
  value,
  onVariantAdd,
  productId,
}: {
  value: string | null;
  setValue: (value: string) => void;
  onVariantAdd: (attributes?: string) => Promise<void>;
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
      const { product } = await apiClient('query')({
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

  const finalAdd = async () => {
    const newSelectedValues: Record<string, string> = {
      ...defined,
      ...custom.reduce<Record<string, string>>((acc, { key, value }) => ({ ...acc, [key]: value }), {}),
    };
    const json = JSON.stringify(newSelectedValues);
    await onVariantAdd(json);
  };
  return facets.length ? (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-4 pb-2 ">
        <Button
          variant="secondary"
          className="w-min"
          onClick={() => setCustom((p) => [...p, { key: '', value: '', id: uuidv4() }])}
        >
          {t('custom.addCustomKey')}
        </Button>
        <Label>{t('custom.customAdditional', { value: custom.length })}</Label>
      </div>

      <div className="h-0 grow overflow-y-auto py-2  pr-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 border-b pb-4 ">
            {custom.map((i) => (
              <div className="flex items-center justify-start gap-4 " key={i.id}>
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
                <Trash
                  className="mt-[20px] shrink-0 cursor-pointer text-red-600"
                  onClick={() => {
                    setCustom((p) => p.filter((a) => a.id !== i.id));
                  }}
                />
              </div>
            ))}
          </div>
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
          })}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pt-4">
        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <InfoIcon />
          <span className="">
            Modyfikacja ceny nowo dodanej linii zamówienia będzie możliwa dopiero po zapisaniu zmian zamówienia
          </span>
        </div>
        <Button onClick={finalAdd}>{t('create.add')}</Button>
      </div>
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
                <img className="h-5 w-5 rounded-full" src={entry.imagePreview || 'placeholder'} />
              ) : (
                <div
                  className="h-5 w-5 shrink-0 rounded-full border-[1px] border-[rgba(0,0,0,0.4)]"
                  style={{ backgroundColor: entry?.hexColor || 'transparent' }}
                ></div>
              )}
              <div className="">{entry.name}</div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className={cn('w-80 p-0', !entry.imagePreview && 'h-40 w-40')}>
            {entry?.imagePreview ? (
              <img className="rounded object-cover" src={entry.imagePreview || 'placeholder'} />
            ) : (
              <div className="h-40 w-40 rounded" style={{ backgroundColor: entry?.hexColor || 'transparent' }} />
            )}
          </HoverCardContent>
        </HoverCard>
      </label>
    </div>
  );
};
