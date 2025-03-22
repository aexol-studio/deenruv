'use client';

import { setInArrayBy } from '@/lists/useGflp.js';
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
  useGFFLP,
  useDetailView,
  cn,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import type { LanguageCode, ModelTypes } from '@deenruv/admin-types';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getGqlError } from '@/utils';
import { useSettings } from '@deenruv/react-ui-devkit';
import { Save, Database, Globe, AlertCircle } from 'lucide-react';

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
  initialValues?: EntityWithCF;
  additionalData?: Record<string, unknown>;
  withoutBorder?: boolean;
};
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
  mutation,
  fetch,
  onChange,
  hideButton,
  disabled,
  initialValues,
  additionalData,
  withoutBorder,
}: Props<T>) {
  const { t } = useTranslation('common');
  const currentLanguage = useSettings((p) => p.translationsLanguage);
  const [isUpdating, setIsUpdating] = useState(false);

  const [loading, setLoading] = useState(false);
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

  const translatableFieldsDict = useMemo(
    () =>
      entityCustomFields?.reduce(
        (acc, el) => {
          if (el.type === 'localeText' || el.type === 'localeString') {
            acc[el.name] = true;
          }
          return acc;
        },
        {} as Record<string, boolean>,
      ) || {},
    [entityCustomFields],
  );

  useEffect(() => {
    if (onChange) {
      const newCustomFields = Object.entries((state.customFields?.validatedValue || {}) as Record<string, any>).reduce(
        (acc, [key, val]) => {
          if (readOnlyFieldsDict[key] || translatableFieldsDict[key]) return acc;
          if (relationFields?.includes(key)) {
            const newKey = key + (Array.isArray(val) ? 'Ids' : 'Id');
            acc[newKey] = Array.isArray(val) ? val?.map((el) => el.id) : val?.id || null;
          } else acc[key] = val;
          return acc;
        },
        {} as CF,
      );
      if (
        JSON.stringify(newCustomFields) !== JSON.stringify(state.customFields?.validatedValue) ||
        JSON.stringify(state?.translations?.validatedValue) !== JSON.stringify(newCustomFields.translations)
      ) {
        onChange(newCustomFields, state?.translations?.validatedValue);
      }
    }
  }, [state.customFields, state.translations]);

  const capitalizedEntityName = useMemo(
    () => (entityName.charAt(0).toUpperCase() + entityName.slice(1)) as Capitalize<T>,
    [entityName],
  );

  const runtimeSelector = useMemo(
    () => mergeSelectorWithCustomFields({}, capitalizedEntityName, entityCustomFields),
    [entityCustomFields, capitalizedEntityName],
  );

  const fetchEntity = async () => {
    if (!id) return;
    try {
      let response;
      if (initialValues) {
        response = initialValues;
      } else if (fetch) {
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
    } catch (err) {
      toast.error(getGqlError(err) || t('toasts.error.fetch'));
    }
  };

  const updateEntity = async () => {
    const preparedCustomFields = Object.entries(
      (state.customFields?.validatedValue || {}) as Record<string, any>,
    ).reduce((acc, [key, val]) => {
      if (readOnlyFieldsDict[key]) return acc;

      if (relationFields?.includes(key)) {
        const newKey = key + (Array.isArray(val) ? 'Ids' : 'Id');
        acc[newKey] = Array.isArray(val) ? val?.map((el) => el.id) : val?.id || null;
      } else acc[key] = val;

      return acc;
    }, {} as CF);

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
  };

  useEffect(() => {
    if (!Object.keys(entityCustomFields || {}).length) return;
    try {
      setLoading(true);
      fetchEntity();
    } finally {
      setLoading(false);
    }
  }, [initialValues, entityCustomFields]);

  if (!entityCustomFields?.length) return null;
  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations?.find((v) => v.languageCode === currentLanguage);

  const getEntityDisplayName = () => {
    const name = capitalizedEntityName;
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <Card
      className={cn({
        'border-l-4 border-l-rose-500 dark:border-l-rose-400': !withoutBorder,
        'shadow-sm transition-shadow duration-200 hover:shadow': !disabled && !isUpdating,
      })}
    >
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
        </div>
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
