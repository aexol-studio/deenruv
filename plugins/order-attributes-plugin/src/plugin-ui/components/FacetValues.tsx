import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Input,
    Label,
    useLazyQuery,
} from '@deenruv/react-ui-devkit';
import { translationNS } from '../translation-ns';
import { FacetValueType } from '../graphql';
import { ProductFacetValuesQuery } from '../graphql/queries';
import { GroupValue } from './GroupValue';
import { Trash } from 'lucide-react';
import { Data, FacetValueData } from './AttributesInput';
import { v4 as uuidv4 } from 'uuid';

interface FacetsAccordionsProps {
    setValue: (value: string) => void;
    value?: string | null;
    additionalData?: Record<string, unknown>;
    disabled?: boolean;
}

const match = (facetValues?: FacetValueType[]) => {
    if (!facetValues) return [];
    const facets = facetValues.reduce((acc, item) => {
        const facet = acc.find(f => f.id === item.facet.id);
        const newItem: FacetValueData = {
            code: item.code,
            id: item.id,
            name: item.name,
            hexColor: item.customFields?.hexColor || '',
            imagePreview: (item.customFields?.image as unknown as { preview: string })?.preview || '',
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

export const FacetValues: React.FC<FacetsAccordionsProps> = ({
    disabled,
    additionalData,
    setValue,
    value,
}) => {
    const { t } = useTranslation(translationNS);
    const [fetchFacetValues, { loading }] = useLazyQuery(ProductFacetValuesQuery);
    const id =
        additionalData?.product &&
        typeof additionalData.product === 'object' &&
        'id' in additionalData.product
            ? additionalData.product.id
            : null;

    const [facets, setFacets] = useState<Data[]>([]);
    const currentValue = useMemo(
        () => (value ? (JSON.parse(value as string) as Record<string, string>) : {}),
        [value],
    );
    const [defined, setDefined] = useState<Record<string, string>>({});
    const [custom, setCustom] = useState<{ id: string; key: string; value: string }[]>([]);

    useEffect(() => {
        if (!id || facets.length) return;
        fetchFacetValues({ productId: id })
            .then(resp => {
                setFacets(match(resp.product?.facetValues));
            })
            .catch();
    }, [id]);

    useEffect(() => {
        if (!facets) return;
        const defined = Object.keys(currentValue)
            .filter(i => facets.some(a => a.code === i))
            .reduce((acc, val) => ({ ...acc, [val]: currentValue[val] }), {});
        setDefined(defined);
        const custom = Object.keys(currentValue)
            .filter(i => !facets.some(a => a.code === i))
            .map(i => ({ id: uuidv4(), value: currentValue[i], key: i }));
        setCustom(custom);
    }, [facets, currentValue]);

    const onCustomChange = (id?: string, key?: string, value?: string) => {
        if (!id) return;
        const newCustomValues = custom.filter(i => i.id !== id);
        if (key && value) {
            newCustomValues.push({ id, key, value });
        }
        setCustom(newCustomValues);
        setValue(
            JSON.stringify({
                ...defined,
                ...newCustomValues.reduce<Record<string, string>>(
                    (acc, { key, value }) => ({ ...acc, [key]: value }),
                    {},
                ),
            }),
        );
    };

    const onDefinedChange = (key: string, value: string) => {
        const newDefined = { ...defined, [key]: value };
        setDefined(newDefined);
        setValue(
            JSON.stringify({
                ...newDefined,
                ...custom.reduce<Record<string, string>>(
                    (acc, { key, value }) => ({ ...acc, [key]: value }),
                    {},
                ),
            }),
        );
    };

    if (!facets.length) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button disabled={disabled} variant="outline">
                    {t('custom.editAttributes')}
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[800px] max-w-[800px]">
                <DialogHeader>
                    <DialogTitle>{t('custom.editAttributes')}</DialogTitle>
                    <DialogDescription>{t('custom.editAttributesDescription')}</DialogDescription>
                </DialogHeader>
                <div className="flex h-full flex-col overflow-auto">
                    <div className="flex items-center justify-between gap-4 pb-2 ">
                        <Button
                            variant="secondary"
                            className="w-min"
                            onClick={() => onCustomChange(uuidv4())}
                        >
                            {t('custom.addCustomKey')}
                        </Button>
                        <Label>{t('custom.customAdditional', { value: custom.length })}</Label>
                    </div>
                    <div className="grow overflow-y-auto py-2  pr-4">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 border-b pb-4 ">
                                {custom.map(i => (
                                    <div className="flex items-center justify-start gap-4 " key={i.id}>
                                        <Input
                                            label={t('custom.customKey')}
                                            value={i.key}
                                            onChange={e => {
                                                onCustomChange(i.id, e.currentTarget.value, i.value);
                                            }}
                                        />
                                        <Input
                                            label={t('custom.customValue')}
                                            value={i.value}
                                            onChange={e => {
                                                onCustomChange(i.id, i.key, e.currentTarget.value);
                                            }}
                                        />
                                        <Trash
                                            className="mt-[20px] shrink-0 cursor-pointer text-red-600"
                                            onClick={() => {
                                                onCustomChange(i.id);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                            {facets.map(facet => {
                                const isCustom = !facet.facetValues.some(i => i.code === defined[facet.code]);
                                return (
                                    <div key={facet.id} className="border-b pb-2">
                                        <div className="mb-2 font-bold">{facet.name}</div>
                                        <div className="grid  grid-cols-4 items-center gap-2">
                                            {facet.facetValues.map(value => (
                                                <GroupValue
                                                    key={value.id}
                                                    entry={value}
                                                    isValueSelected={defined[facet.code] === value.code}
                                                    handleFacetValueSelect={() =>
                                                        onDefinedChange(facet.code, value.code)
                                                    }
                                                />
                                            ))}
                                        </div>
                                        <div className="my-2 flex items-center gap-2">
                                            <span className="shrink-0">{t('custom.customLabel')}</span>
                                            <Input
                                                placeholder={t('custom.customPlaceholder')}
                                                value={isCustom ? defined[facet.code] : ''}
                                                onChange={e =>
                                                    onDefinedChange(facet.code, e.currentTarget.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
