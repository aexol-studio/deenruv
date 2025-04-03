'use client';

import { setInArrayBy } from '@/lists/useGflp.js';
import {
  Button,
  CustomFieldsComponent,
  mergeSelectorWithCustomFields,
  useServer,
  apiClient,
  useGFFLP,
  CustomCard,
  CardIcons,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import type { LanguageCode, ModelTypes } from '@deenruv/admin-types';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { getGqlError } from '@/utils';
import { useSettings } from '@deenruv/react-ui-devkit';
import { Save, AlertCircle } from 'lucide-react';

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
  onChange?: (customFields: CF, translations?: Array<{ languageCode: LanguageCode }>) => void;
  hideButton?: boolean;
  fetch?: (runtimeSelector: any) => Promise<EntityWithCF>;
  mutation?: (customFields: unknown, translations?: Array<{ languageCode: LanguageCode }>) => Promise<void>;
  disabled?: boolean;
  fetchInitialValues?: boolean;
  initialValues?: EntityWithCF;
  additionalData?: Record<string, unknown>;
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
}: Props<T>) {
  const { t } = useTranslation('common');
  const currentLanguage = useSettings((p) => p.translationsLanguage);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setInitialized] = useState(false);

  const entityCustomFields = useServer((p) =>
    p.serverConfig?.entityCustomFields?.find(
      (el) => el.entityName.charAt(0).toLowerCase() + el.entityName.slice(1) === entityName,
    ),
  )?.customFields;

  const relationFields = useMemo(
    () => entityCustomFields?.filter((el) => el.__typename === 'RelationCustomFieldConfig').map((el) => el.name),
    [entityCustomFields],
  );

  const { state, setField } = useGFFLP(
    typeWithCommonCustomFields,
    'customFields',
    'translations',
  )({
    customFields: {
      initialValue: {},
    },
  });

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

  const capitalizedEntityName = useMemo(
    () => (entityName.charAt(0).toUpperCase() + entityName.slice(1)) as Capitalize<T>,
    [entityName],
  );

  const runtimeSelector = useMemo(
    () => mergeSelectorWithCustomFields({}, capitalizedEntityName, entityCustomFields),
    [entityCustomFields, capitalizedEntityName],
  );

  const fetchEntity = async () => {
    let response;
    if (!id) return;
    try {
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
        await mutation(preparedCustomFields, state?.translations?.validatedValue || []);
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
    if (
      !Object.keys(entityCustomFields || {}).length ||
      (initialValues?.customFields ? Object.keys(initialValues.customFields).length === 0 : false) ||
      isInitialized
    ) {
      return;
    }
    try {
      setLoading(true);
      if (initialValues) {
        setField('customFields', initialValues.customFields);
        setField('translations', initialValues.translations);
        setInitialized(true);
      } else {
        fetchEntity().then(() => setInitialized(true));
      }
    } finally {
      setLoading(false);
    }
  }, [initialValues, entityCustomFields, isInitialized]);

  if (!entityCustomFields?.length) return null;
  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations?.find((v) => v.languageCode === currentLanguage);

  const getEntityDisplayName = () => {
    const name = capitalizedEntityName;
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  return (
    <CustomCard
      title={t('custom-fields.title', 'Custom Fields')}
      description={t('custom-fields.description', `Manage custom fields for this ${getEntityDisplayName()}`)}
      color="rose"
      icon={<CardIcons.customFields />}
      // upperRight={
      //   currentLanguage &&
      //   translations?.length > 0 && (
      //     <div className="bg-muted/50 mt-2 flex items-center gap-2 rounded-md px-3 py-2 text-sm">
      //       <Globe className="size-4 text-rose-500" />
      //       <span>
      //         {t('custom-fields.currentLanguage', 'Current language')}:
      //         <span className="ml-1 font-medium">{currentLanguage.toUpperCase()}</span>
      //       </span>
      //     </div>
      //   )
      // }
      bottomRight={
        !hideButton && (
          <Button disabled={disabled || isUpdating} onClick={updateEntity} className="gap-2">
            {isUpdating ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                {t('processing', 'Processing...')}
              </>
            ) : (
              <>
                <Save className="size-4" />
                {t('update', 'Save Changes')}
              </>
            )}
          </Button>
        )
      }
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="size-8 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500"></div>
          <p className="text-muted-foreground text-sm">{t('custom-fields.loading', 'Loading custom fields...')}</p>
        </div>
      ) : entityCustomFields?.length ? (
        <CustomFieldsComponent
          additionalData={additionalData}
          value={state.customFields?.value}
          translation={currentTranslationValue}
          customFields={entityCustomFields}
          disabled={disabled}
          setValue={(field, data) => {
            const translatable = field.type === 'localeText' || field.type === 'localeString';
            if (translatable && currentLanguage) {
              const customFieldsTranslations = setInArrayBy(translations, (t) => t.languageCode !== currentLanguage, {
                customFields: {
                  ...translations.find((t) => t.languageCode === currentLanguage)?.customFields,
                  [field.name]: data,
                },
                languageCode: currentLanguage,
              });
              const newCustomFields = Object.entries(state.customFields?.value || {}).reduce((acc, [key, val]) => {
                if (readOnlyFieldsDict[key] || translatableFieldsDict[key]) return acc;
                if (relationFields?.includes(key)) {
                  const newKey = key + (Array.isArray(val) ? 'Ids' : 'Id');
                  acc[newKey] = Array.isArray(val) ? val?.map((el) => el.id) : (val as any)?.id || null;
                } else acc[key] = val;
                return acc;
              }, {} as CF);
              onChange?.(newCustomFields, customFieldsTranslations);
              setField('translations', customFieldsTranslations);
              return;
            }

            if (!translatable) {
              const newCustomFields = Object.entries({ ...state.customFields?.value, [field.name]: data }).reduce(
                (acc, [key, val]) => {
                  if (readOnlyFieldsDict[key] || translatableFieldsDict[key]) return acc;
                  if (relationFields?.includes(key)) {
                    const newKey = key + (Array.isArray(val) ? 'Ids' : 'Id');
                    acc[newKey] = Array.isArray(val) ? val?.map((el) => el.id) : (val as any)?.id || null;
                  } else acc[key] = val;
                  return acc;
                },
                {} as CF,
              );
              onChange?.(newCustomFields, state.translations?.value || []);
              setField('customFields', { ...state.customFields?.value, [field.name]: data });
              return;
            }
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="rounded-full bg-rose-100 p-3 dark:bg-rose-900/30">
            <AlertCircle className="size-6 text-rose-500 dark:text-rose-400" />
          </div>
          <div>
            <p className="font-medium">{t('custom-fields.noFields', 'No custom fields available')}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('custom-fields.noFieldsHint', 'This entity type does not have any custom fields configured')}
            </p>
          </div>
        </div>
      )}
    </CustomCard>
  );
}
