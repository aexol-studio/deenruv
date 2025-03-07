'use client';

import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CustomFieldsComponent,
  mergeSelectorWithCustomFields,
  CardContent,
  useServer,
  apiClient,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import type { LanguageCode, ModelTypes } from '@deenruv/admin-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getGqlError } from '@/utils';
import { useSettings } from '@deenruv/react-ui-devkit';
import { RefreshCw, Save, Database, Globe, AlertCircle } from 'lucide-react';

type ViableEntity = Uncapitalize<
  keyof Pick<
    ModelTypes,
    | 'Address'
    | 'Product'
    | 'ProductVariant'
    | 'Order'
    | 'OrderLine'
    | 'Asset'
    | 'Collection'
    | 'Facet'
    | 'OrderLine'
    | 'ProductOptionGroup'
    | 'PaymentMethod'
    | 'ShippingMethod'
    | 'FacetValue'
    | 'ProductOption'
    | 'TaxCategory'
    | 'TaxRate'
    | 'Channel'
    | 'Country'
    | 'Seller'
    | 'Zone'
    | 'Administrator'
    | 'Role'
    | 'StockLocation'
    | 'Promotion'
    | 'Customer'
    | 'CustomerGroup'
  >
>;
export type CF = Record<string, unknown>;

type EntityWithCF = {
  customFields: CF;
  translations?: { customFields: CF; languageCode: LanguageCode }[];
};

type Props<T extends ViableEntity> = {
  entityName: T;
  id?: string | null;
  currentLanguage?: LanguageCode;
  onChange?: (customFields: CF, translations?: unknown) => void;
  hideButton?: boolean;
  fetch?: (runtimeSelector: any) => Promise<EntityWithCF>;
  mutation?: (customFields: unknown, translations?: unknown) => Promise<void>;
  disabled?: boolean;
  fetchInitialValues?: boolean;
  initialValues?: CF;
  additionalData?: Record<string, unknown>;
} & (
  | {
      fetchInitialValues: false;
      initialValues: { customFields: CF; translations?: Array<{ customFields: CF; languageCode: LanguageCode }> };
    }
  | { fetchInitialValues?: true }
);

const entityDictionary: Partial<
  Record<ViableEntity, { inputName: keyof ModelTypes; mutationName: keyof ModelTypes['Mutation'] }>
> = {
  product: {
    inputName: 'UpdateProductInput',
    mutationName: 'updateProduct',
  },
  productVariant: {
    inputName: 'UpdateProductVariantInput',
    mutationName: 'updateProductVariants',
  },
  order: {
    inputName: 'UpdateOrderInput',
    mutationName: 'setOrderCustomFields',
  },
  orderLine: {
    inputName: 'OrderLineInput',
    mutationName: 'adjustDraftOrderLine',
  },
  asset: {
    inputName: 'UpdateAssetInput',
    mutationName: 'updateAsset',
  },
  collection: {
    inputName: 'UpdateCollectionInput',
    mutationName: 'updateCollection',
  },
  facet: {
    inputName: 'UpdateFacetInput',
    mutationName: 'updateFacet',
  },
  paymentMethod: {
    inputName: 'UpdatePaymentMethodInput',
    mutationName: 'updatePaymentMethod',
  },
  shippingMethod: {
    inputName: 'UpdateShippingMethodInput',
    mutationName: 'updateShippingMethod',
  },
  facetValue: {
    inputName: 'UpdateFacetValueInput',
    mutationName: 'updateFacetValues',
  },
  productOption: {
    inputName: 'UpdateProductOptionInput',
    mutationName: 'updateProductOption',
  },
  address: {
    inputName: 'CreateAddressInput',
    mutationName: 'createCustomerAddress',
  },
};

const typeWithCommonCustomFields: keyof Pick<ModelTypes, 'UpdateProductOptionInput'> = 'UpdateProductOptionInput';
export function EntityCustomFields<T extends ViableEntity>({
  id,
  entityName,
  currentLanguage: _currentLanguage,
  mutation,
  fetch,
  onChange,
  hideButton,
  disabled,
  fetchInitialValues = true,
  additionalData,
  initialValues,
}: Props<T>) {
  const { t } = useTranslation('common');
  const language = useSettings((p) => p.translationsLanguage);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentLanguage = useMemo(
    () => _currentLanguage || language || 'en',
    [_currentLanguage, language],
  ) as LanguageCode;

  const [loading, setLoading] = useState(fetchInitialValues);
  const { state, setField } = useGFFLP(typeWithCommonCustomFields, 'customFields', 'translations')({});
  const entityCustomFields = useServer((p) =>
    p.serverConfig?.entityCustomFields?.find(
      (el) => el.entityName.charAt(0).toLowerCase() + el.entityName.slice(1) === entityName,
    ),
  )?.customFields;

  const relationFields = useMemo(
    () => entityCustomFields?.filter((el) => el.__typename === 'RelationCustomFieldConfig').map((el) => el.name),
    [entityCustomFields],
  );

  const readOnlyFieldsDict = useMemo(
    () =>
      entityCustomFields?.reduce(
        (acc, el) => {
          if (el.readonly) {
            acc[el.name] = true;
          }
          return acc;
        },
        {} as Record<string, boolean>,
      ) || {},
    [entityCustomFields],
  );

  const prepareCustomFields = useCallback(
    (props?: { filterReadonly: boolean }) => {
      const { filterReadonly } = props || {};

      return Object.entries((state.customFields?.validatedValue || {}) as Record<string, any>).reduce(
        (acc, [key, val]) => {
          if (filterReadonly && readOnlyFieldsDict[key]) return acc;

          if (relationFields?.includes(key)) {
            const newKey = key + (Array.isArray(val) ? 'Ids' : 'Id');
            acc[newKey] = Array.isArray(val) ? val?.map((el) => el.id) : val?.id || null;
          } else acc[key] = val;

          return acc;
        },
        {} as CF,
      );
    },
    [state, relationFields, readOnlyFieldsDict],
  );

  useEffect(() => {
    // TODO Add debounce
    if (onChange) {
      const preparedCustomFields = prepareCustomFields();
      onChange(preparedCustomFields, state?.translations?.validatedValue);
    }
  }, [state, prepareCustomFields, onChange]);

  const capitalizedEntityName = useMemo(
    () => (entityName.charAt(0).toUpperCase() + entityName.slice(1)) as Capitalize<T>,
    [entityName],
  );

  const runtimeSelector = useMemo(
    () => mergeSelectorWithCustomFields({}, capitalizedEntityName, entityCustomFields),
    [entityCustomFields, capitalizedEntityName],
  );
  console.log('render test');
  const fetchEntity = useCallback(
    async (showLoading = true) => {
      if (!id) return;
      try {
        if (showLoading) setIsRefreshing(true);

        let response;

        if (fetch) {
          response = await fetch(runtimeSelector);
        } else {
          const { [entityName]: genericResponse } = (await apiClient('query')({
            [entityName]: [{ id }, runtimeSelector],
          } as any)) as Record<T, EntityWithCF>;
          response = genericResponse;
        }

        if (!response) {
          toast.error(t('toasts.error.fetch'));
          return;
        }

        setField('customFields', response?.customFields);
        setField('translations', response?.translations);

        if (showLoading) {
          toast.success(t('custom-fields.refreshSuccess', 'Custom fields refreshed successfully'));
        }
      } catch (err) {
        toast.error(getGqlError(err) || t('toasts.error.fetch'));
      } finally {
        if (showLoading) setIsRefreshing(false);
      }
    },
    [runtimeSelector, entityName, id],
  );

  const updateEntity = useCallback(async () => {
    const preparedCustomFields = prepareCustomFields({ filterReadonly: true });

    try {
      setIsUpdating(true);

      if (mutation) {
        await mutation(preparedCustomFields, state?.translations?.validatedValue);
      } else {
        const mutationName = entityDictionary[entityName]?.['mutationName'];
        if (!mutationName)
          throw new Error('no mutationName provided. Add it to entityDictionary or provide custom mutation prop');
        await apiClient('mutation')({
          [mutationName]: [
            {
              input: {
                id,
                customFields: preparedCustomFields,
                translations: state?.translations?.validatedValue,
              },
            },
            { id: true },
          ],
        } as any);
      }

      toast.success(t('toasts.success.update'));
    } catch (err) {
      toast.error(getGqlError(err) || t('toasts.error.mutation'));
    } finally {
      setIsUpdating(false);
    }
  }, [state, entityName, id, mutation, prepareCustomFields, t]);

  useEffect(() => {
    if (!entityCustomFields?.length || !fetchInitialValues) {
      setField('customFields', initialValues?.customFields || {});
      return;
    }
    try {
      setLoading(true);
      fetchEntity(false);
    } finally {
      setLoading(false);
    }
  }, [entityCustomFields, fetchInitialValues]);
  if (!entityCustomFields?.length) return null;

  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations?.find((v) => v.languageCode === currentLanguage);

  // Get entity display name for the header
  const getEntityDisplayName = () => {
    const name = capitalizedEntityName;
    // Add spaces before capital letters and trim
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <Card className="border-l-4 border-l-rose-500 shadow-sm transition-shadow duration-200 hover:shadow dark:border-l-rose-400">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-rose-500 dark:text-rose-400" />
            <div>
              <CardTitle>{t('custom-fields.title', 'Custom Fields')}</CardTitle>
              <CardDescription className="mt-1">
                {t('custom-fields.description', `Manage custom fields for this ${getEntityDisplayName()}`)}
              </CardDescription>
            </div>
          </div>
          {id && fetchInitialValues && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchEntity()}
              disabled={isRefreshing}
              className="h-8 gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {t('refresh', 'Refresh')}
            </Button>
          )}
        </div>

        {currentLanguage && translations?.length > 0 && (
          <div className="bg-muted/50 mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm">
            <Globe className="h-4 w-4 text-rose-500" />
            <span>
              {t('custom-fields.currentLanguage', 'Current language')}:
              <span className="ml-1 font-medium">{currentLanguage.toUpperCase()}</span>
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500"></div>
            <p className="text-muted-foreground text-sm">{t('custom-fields.loading', 'Loading custom fields...')}</p>
          </div>
        ) : entityCustomFields?.length ? (
          <div className="space-y-6 p-6 pt-0">
            <CustomFieldsComponent
              additionalData={additionalData}
              value={state.customFields?.value}
              translation={currentTranslationValue}
              customFields={entityCustomFields}
              disabled={disabled}
              setValue={(field, data) => {
                const translatable = field.type === 'localeText' || field.type === 'localeString';

                if (translatable && currentLanguage) {
                  setField(
                    'translations',
                    setInArrayBy(translations, (t) => t.languageCode !== currentLanguage, {
                      customFields: {
                        ...translations.find((t) => t.languageCode === currentLanguage)?.customFields,
                        [field.name]: data,
                      },
                      languageCode: currentLanguage,
                    }),
                  );
                  return;
                }

                if (!translatable) {
                  setField('customFields', { ...state.customFields?.value, [field.name]: data });
                  return;
                }
              }}
            />

            {!hideButton && (
              <div className="mt-6 flex justify-end border-t pt-4">
                <Button disabled={disabled || isUpdating} onClick={updateEntity} className="gap-2">
                  {isUpdating ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                      {t('processing', 'Processing...')}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {t('update', 'Save Changes')}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="rounded-full bg-rose-100 p-3 dark:bg-rose-900/30">
              <AlertCircle className="h-6 w-6 text-rose-500 dark:text-rose-400" />
            </div>
            <div>
              <p className="font-medium">{t('custom-fields.noFields', 'No custom fields available')}</p>
              <p className="text-muted-foreground mt-1 text-sm">
                {t('custom-fields.noFieldsHint', 'This entity type does not have any custom fields configured')}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
