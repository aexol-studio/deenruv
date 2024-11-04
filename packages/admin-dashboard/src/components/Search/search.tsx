import React, { useEffect, useMemo, useState } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Switch,
} from '@/components';
import { LogicalOperator, ModelTypes } from '@deenruv/admin-types';

import { useTranslation } from 'react-i18next';
import { useDebounce } from 'use-debounce';
import { ChevronDown, CircleX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StringOperator } from '@/components/Search/StringOperator';
import {
  SearchProps,
  orderFilterFields,
  productFilterFields,
  collectionFilterFields,
  facetFilterFields,
  countriesFilterFields,
  adminsFilterFields as adminFilterFields,
  roleFilterFields,
  channelFilterFields,
  zoneFilterFields,
  taxCategoryFilterFields,
  taxRateFilterFields,
  stockLocationFilterFields,
  sellerFilterFields,
  paymentMethodFilterFields,
  shippingMethodFilterFields,
} from '@/components/Search/types';
import { DateOperator } from '@/components/Search/DateOperator';
import { NumberOperator } from '@/components/Search/NumberOperator';
import { InOperator } from '@/components/Search/InOperator';
import { BooleanOperator } from '@/components/Search/BooleanOperator';
import { IdOperator } from '@/components/Search/IdOperator';

export const Search: React.FC<SearchProps> = ({
  setFilterLogicalOperator,
  type,
  filter,
  removeFilterField,
  setFilterField,
  setFilter,
}) => {
  const { t } = useTranslation('common');
  const [openedFilter, setOpenedFilter] = useState<string | undefined>();
  const [isAdvanced, setIsAdvanced] = useState<boolean>(() => {
    if (!filter) return false;

    const filterKeysCount = Object.keys(filter).length;

    switch (type) {
      case 'OrderFilterParameter':
        return !(
          filter.code?.contains &&
          filter.transactionId?.contains &&
          filter.customerLastName?.contains &&
          filter.code.contains === filter.transactionId.contains &&
          filter.code.contains === filter.customerLastName.contains &&
          filter.id?.eq === filter.customerLastName.contains &&
          filterKeysCount === 4
        );

      case 'FacetFilterParameter':
      case 'CollectionFilterParameter':
      case 'ProductFilterParameter':
      case 'ZoneFilterParameter':
      case 'TaxCategoryFilterParameter':
      case 'TaxRateFilterParameter':
      case 'StockLocationFilterParameter':
      case 'SellerFilterParameter':
      case 'PaymentMethodFilterParameter':
      case 'ShippingMethodFilterParameter':
      case 'CountryFilterParameter':
        return !(filter.name?.contains && filterKeysCount === 1);

      case 'AdministratorFilterParameter':
        return !(filter.emailAddress?.contains && filterKeysCount === 1);

      case 'RoleFilterParameter':
        return !(filter.description?.contains && filterKeysCount === 1);

      case 'ChannelFilterParameter':
        return !(filter.code?.contains && filterKeysCount === 1);

      default:
        return true;
    }
  });

  const [defaultSearch, setDefaultSearch] = useState<string>(
    !isAdvanced
      ? type === 'OrderFilterParameter' || type === 'ChannelFilterParameter'
        ? filter?.code?.contains || ''
        : type === 'AdministratorFilterParameter'
          ? filter?.emailAddress?.contains || ''
          : type === 'RoleFilterParameter'
            ? filter?.description?.contains || ''
            : filter?.name?.contains || ''
      : '',
  );
  const [debouncedSearch] = useDebounce(defaultSearch, 500);

  const toggleAdvanced = () => {
    if (isAdvanced) {
      setIsAdvanced(false);
      setFilterLogicalOperator(undefined);
    } else {
      setIsAdvanced(true);
      setDefaultSearch('');
      setFilterLogicalOperator(LogicalOperator.AND);
    }
    setFilter(undefined);
  };
  useEffect(() => {
    if (!isAdvanced) {
      if (debouncedSearch && debouncedSearch !== '') {
        if (type === 'OrderFilterParameter') {
          setFilter({
            code: { contains: debouncedSearch },
            customerLastName: { contains: debouncedSearch },
            transactionId: { contains: debouncedSearch },
            id: { eq: debouncedSearch },
          });
        } else if (type === 'AdministratorFilterParameter') {
          setFilter({ emailAddress: { contains: debouncedSearch } });
        } else if (type === 'RoleFilterParameter') {
          setFilter({ description: { contains: debouncedSearch } });
        } else if (type === 'ChannelFilterParameter') {
          setFilter({ code: { contains: debouncedSearch } });
        } else {
          setFilter({ name: { contains: debouncedSearch } });
        }
      } else {
        setFilter(undefined);
      }
    }
    //isAdvanced should ot be in dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, type]);

  const filtersToAdd = useMemo(() => {
    let fields;

    switch (type) {
      case 'OrderFilterParameter':
        fields = orderFilterFields;
        break;
      case 'ProductFilterParameter':
        fields = productFilterFields;
        break;
      case 'CollectionFilterParameter':
        fields = collectionFilterFields;
        break;
      case 'CountryFilterParameter':
        fields = countriesFilterFields;
        break;
      case 'AdministratorFilterParameter':
        fields = adminFilterFields;
        break;
      case 'RoleFilterParameter':
        fields = roleFilterFields;
        break;
      case 'ChannelFilterParameter':
        fields = channelFilterFields;
        break;
      case 'ZoneFilterParameter':
        fields = zoneFilterFields;
        break;
      case 'TaxCategoryFilterParameter':
        fields = taxCategoryFilterFields;
        break;
      case 'TaxRateFilterParameter':
        fields = taxRateFilterFields;
        break;
      case 'StockLocationFilterParameter':
        fields = stockLocationFilterFields;
        break;
      case 'SellerFilterParameter':
        fields = sellerFilterFields;
        break;
      case 'PaymentMethodFilterParameter':
        fields = paymentMethodFilterFields;
        break;
      case 'ShippingMethodFilterParameter':
        fields = shippingMethodFilterFields;
        break;
      default:
        fields = facetFilterFields;
        break;
    }

    return fields.filter((i) => !Object.keys(filter || {}).includes(i.name));
  }, [filter, type]);
  return (
    <div className="flex min-h-10 flex-1 gap-4 ">
      <div className="flex h-[40px] items-center gap-2">
        <Switch className="border-foreground/20" id="advanceSearch" checked={isAdvanced} onClick={toggleAdvanced} />
        <Label className="text-nowrap" htmlFor="advanceSearch">
          {t(isAdvanced ? 'search.advanceToggle' : 'search.basicToggle')}
        </Label>
      </div>
      {isAdvanced ? (
        <div className="flex  gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {t('search.addFilter')} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="max-h-[400px] overflow-y-auto">
              {filtersToAdd.map((i, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() =>
                    setFilter(
                      i.type === 'BooleanOperators'
                        ? { ...filter, [i.name]: { eq: true } }
                        : { ...filter, [i.name]: {} },
                    )
                  }
                >
                  {t(`search.filterLabels.${i.name}`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-wrap gap-2 place-self-start">
            {type === 'OrderFilterParameter'
              ? orderFilterFields.map((i) => (
                  <>
                    {filter && i.name in filter && (
                      <Popover
                        open={openedFilter === i.name}
                        onOpenChange={(e) => setOpenedFilter(e ? i.name : undefined)}
                      >
                        <PopoverTrigger asChild>
                          <div
                            onClick={() => setOpenedFilter(i.name)}
                            className={cn(
                              'inline-flex cursor-pointer items-center gap-1 rounded-full border border-primary bg-primary-foreground py-0.5 pl-2.5 pr-1 text-xs font-semibold hover:brightness-90',
                              !Object.keys({ ...filter[i.name] }).length && 'border-red-600',
                            )}
                          >
                            {t(`search.filterLabels.${i.name}`)}
                            <CircleX size={14} onClick={() => removeFilterField(i.name)} />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="flex w-auto min-w-60 flex-col gap-2 bg-secondary">
                          {i.name === 'state' ? (
                            <InOperator
                              type="OrderState"
                              currentlySelected={filter.state?.in || []}
                              onSubmit={(value) => {
                                setFilterField('state', value.length > 0 ? { in: value } : {});
                                setOpenedFilter(undefined);
                              }}
                            />
                          ) : i.name === 'type' ? (
                            <InOperator
                              type="OrderType"
                              currentlySelected={filter.type?.in || []}
                              onSubmit={(value) => {
                                setFilterField('type', { in: value });
                                setOpenedFilter(undefined);
                              }}
                            />
                          ) : i.type === 'StringOperators' ? (
                            <StringOperator
                              currentValue={filter[i.name] as ModelTypes['StringOperators']}
                              onSubmit={(type, newVal) => {
                                setFilterField(i.name, { [type]: newVal });
                                setOpenedFilter(undefined);
                              }}
                            />
                          ) : i.type === 'DateOperators' ? (
                            <DateOperator
                              currentValue={filter[i.name] as ModelTypes['DateOperators']}
                              onDateSubmit={(value) => {
                                setFilterField(i.name, value);
                                setOpenedFilter(undefined);
                              }}
                            />
                          ) : i.type === 'IDOperators' ? (
                            <IdOperator
                              currentValue={(filter[i.name] as ModelTypes['IDOperators']).eq}
                              onSubmit={(newVal) => {
                                setFilterField(i.name, { eq: newVal });
                                setOpenedFilter(undefined);
                              }}
                            />
                          ) : i.type === 'NumberOperators' ? (
                            <NumberOperator
                              isCurrency={i.name !== 'totalQuantity'}
                              currentValue={filter[i.name] as ModelTypes['NumberOperators']}
                              onSubmit={(value) => {
                                setFilterField(i.name, value);
                                setOpenedFilter(undefined);
                              }}
                            />
                          ) : (
                            <BooleanOperator
                              currentValue={(filter[i.name] as ModelTypes['BooleanOperators'])?.eq}
                              onSubmit={(value) => {
                                setFilterField(i.name, { eq: value });
                                setOpenedFilter(undefined);
                              }}
                            />
                          )}
                          <div className="grid gap-4"></div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </>
                ))
              : type === 'ProductFilterParameter'
                ? productFilterFields.map((i) => (
                    <>
                      {filter && i.name in filter && (
                        <Popover
                          open={openedFilter === i.name}
                          onOpenChange={(e) => setOpenedFilter(e ? i.name : undefined)}
                        >
                          <PopoverTrigger asChild>
                            <div
                              onClick={() => setOpenedFilter(i.name)}
                              className={cn(
                                'inline-flex cursor-pointer items-center gap-1 rounded-full border border-primary bg-primary-foreground py-0.5 pl-2.5 pr-1 text-xs font-semibold hover:brightness-90',
                                !Object.keys({ ...filter[i.name] }).length && 'border-red-600',
                              )}
                            >
                              {t(`search.filterLabels.${i.name}`)}
                              <CircleX size={14} onClick={() => removeFilterField(i.name)} />
                            </div>
                          </PopoverTrigger>
                          <PopoverContent align="start" className="flex w-auto min-w-60 flex-col gap-2 bg-secondary">
                            {i.type === 'StringOperators' ? (
                              <StringOperator
                                currentValue={filter[i.name] as ModelTypes['StringOperators']}
                                onSubmit={(type, newVal) => {
                                  setFilterField(i.name, { [type]: newVal });
                                  setOpenedFilter(undefined);
                                }}
                              />
                            ) : i.type === 'DateOperators' ? (
                              <DateOperator
                                currentValue={filter[i.name] as ModelTypes['DateOperators']}
                                onDateSubmit={(value) => {
                                  setFilterField(i.name, value);
                                  setOpenedFilter(undefined);
                                }}
                              />
                            ) : i.type === 'IDOperators' ? (
                              <IdOperator
                                currentValue={(filter[i.name] as ModelTypes['IDOperators']).eq}
                                onSubmit={(newVal) => {
                                  setFilterField(i.name, { eq: newVal });
                                  setOpenedFilter(undefined);
                                }}
                              />
                            ) : i.type === 'NumberOperators' ? (
                              <NumberOperator
                                currentValue={filter[i.name] as ModelTypes['NumberOperators']}
                                onSubmit={(value) => {
                                  setFilterField(i.name, value);
                                  setOpenedFilter(undefined);
                                }}
                              />
                            ) : (
                              <BooleanOperator
                                currentValue={filter[i.name]?.eq}
                                onSubmit={(value) => {
                                  setFilterField(i.name, { eq: value });
                                  setOpenedFilter(undefined);
                                }}
                              />
                            )}
                            <div className="grid gap-4"></div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </>
                  ))
                : type === 'CountryFilterParameter'
                  ? countriesFilterFields.map((i) => (
                      <>
                        {filter && i.name in filter && (
                          <Popover
                            open={openedFilter === i.name}
                            onOpenChange={(e) => setOpenedFilter(e ? i.name : undefined)}
                          >
                            <PopoverTrigger asChild>
                              <div
                                onClick={() => setOpenedFilter(i.name)}
                                className={cn(
                                  'inline-flex cursor-pointer items-center gap-1 rounded-full border border-primary bg-primary-foreground py-0.5 pl-2.5 pr-1 text-xs font-semibold hover:brightness-90',
                                  !Object.keys({ ...filter[i.name] }).length && 'border-red-600',
                                )}
                              >
                                {t(`search.filterLabels.${i.name}`)}
                                <CircleX size={14} onClick={() => removeFilterField(i.name)} />
                              </div>
                            </PopoverTrigger>
                            <PopoverContent align="start" className="flex w-auto min-w-60 flex-col gap-2 bg-secondary">
                              {i.type === 'StringOperators' ? (
                                <StringOperator
                                  currentValue={filter[i.name] as ModelTypes['StringOperators']}
                                  onSubmit={(type, newVal) => {
                                    setFilterField(i.name, { [type]: newVal });
                                    setOpenedFilter(undefined);
                                  }}
                                />
                              ) : i.type === 'DateOperators' ? (
                                <DateOperator
                                  currentValue={filter[i.name] as ModelTypes['DateOperators']}
                                  onDateSubmit={(value) => {
                                    setFilterField(i.name, value);
                                    setOpenedFilter(undefined);
                                  }}
                                />
                              ) : i.type === 'IDOperators' ? (
                                <IdOperator
                                  currentValue={(filter[i.name] as ModelTypes['IDOperators']).eq}
                                  onSubmit={(newVal) => {
                                    setFilterField(i.name, { eq: newVal });
                                    setOpenedFilter(undefined);
                                  }}
                                />
                              ) : i.type === 'NumberOperators' ? (
                                <NumberOperator
                                  currentValue={filter[i.name] as ModelTypes['NumberOperators']}
                                  onSubmit={(value) => {
                                    setFilterField(i.name, value);
                                    setOpenedFilter(undefined);
                                  }}
                                />
                              ) : (
                                <BooleanOperator
                                  currentValue={filter[i.name]?.eq}
                                  onSubmit={(value) => {
                                    setFilterField(i.name, { eq: value });
                                    setOpenedFilter(undefined);
                                  }}
                                />
                              )}
                              <div className="grid gap-4"></div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </>
                    ))
                  : type === 'CollectionFilterParameter'
                    ? collectionFilterFields.map((i) => (
                        <>
                          {filter && i.name in filter && (
                            <Popover
                              open={openedFilter === i.name}
                              onOpenChange={(e) => setOpenedFilter(e ? i.name : undefined)}
                            >
                              <PopoverTrigger asChild>
                                <div
                                  onClick={() => setOpenedFilter(i.name)}
                                  className={cn(
                                    'inline-flex cursor-pointer items-center gap-1 rounded-full border border-primary bg-primary-foreground py-0.5 pl-2.5 pr-1 text-xs font-semibold hover:brightness-90',
                                    !Object.keys({ ...filter[i.name] }).length && 'border-red-600',
                                  )}
                                >
                                  {t(`search.filterLabels.${i.name}`)}
                                  <CircleX size={14} onClick={() => removeFilterField(i.name)} />
                                </div>
                              </PopoverTrigger>
                              <PopoverContent
                                align="start"
                                className="flex w-auto min-w-60 flex-col gap-2 bg-secondary"
                              >
                                {i.type === 'StringOperators' ? (
                                  <StringOperator
                                    currentValue={filter[i.name] as ModelTypes['StringOperators']}
                                    onSubmit={(type, newVal) => {
                                      setFilterField(i.name, { [type]: newVal });
                                      setOpenedFilter(undefined);
                                    }}
                                  />
                                ) : i.type === 'DateOperators' ? (
                                  <DateOperator
                                    currentValue={filter[i.name] as ModelTypes['DateOperators']}
                                    onDateSubmit={(value) => {
                                      setFilterField(i.name, value);
                                      setOpenedFilter(undefined);
                                    }}
                                  />
                                ) : i.type === 'IDOperators' ? (
                                  <IdOperator
                                    currentValue={(filter[i.name] as ModelTypes['IDOperators']).eq}
                                    onSubmit={(newVal) => {
                                      setFilterField(i.name, { eq: newVal });
                                      setOpenedFilter(undefined);
                                    }}
                                  />
                                ) : i.type === 'NumberOperators' ? (
                                  <NumberOperator
                                    currentValue={filter[i.name] as ModelTypes['NumberOperators']}
                                    onSubmit={(value) => {
                                      setFilterField(i.name, value);
                                      setOpenedFilter(undefined);
                                    }}
                                  />
                                ) : i.type === 'BooleanOperators' ? (
                                  <BooleanOperator
                                    currentValue={filter[i.name]?.eq}
                                    onSubmit={(value) => {
                                      setFilterField(i.name, { eq: value });
                                      setOpenedFilter(undefined);
                                    }}
                                  />
                                ) : null}
                                <div className="grid gap-4"></div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </>
                      ))
                    : null}
          </div>
        </div>
      ) : (
        <Input
          className="max-w-[400px]"
          placeholder={t(`search.${type}.placeholder`)}
          value={defaultSearch}
          onChange={(e) => setDefaultSearch(e.currentTarget.value)}
        />
      )}

      {/* //Old one */}
      {/* {groupedAdvancedParams && (
        <Sheet>
          <SheetTrigger>
            <Button>{advancedSearch?.actionTitle}</Button>
          </SheetTrigger>
          <SheetContent className="w-[500px]">
            <SheetHeader>
              <SheetTitle>{advancedSearch?.title}</SheetTitle>
              <ScrollArea className="h-[calc(100vh-6rem)] pr-4">
                <Accordion type="multiple">
                  {groupedAdvancedParams.map((p) => {
                    return <SearchAccordion key={p.title} {...p} />;
                  })}
                </Accordion>
              </ScrollArea>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )} */}
    </div>
  );
};
