import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CustomFieldsComponent,
  Spinner,
  mergeSelectorWithCustomFields,
  CardContent,
  useServer,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { LanguageCode, ModelTypes } from '@deenruv/admin-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiCall } from '@/graphql/client';
import { toast } from 'sonner';
import { getGqlError } from '@/utils';

type ViableEntity = Uncapitalize<
  keyof Pick<
    ModelTypes,
    'Product' | 'ProductVariant' | 'Order' | 'Asset' | 'Collection' | 'Facet' | 'OrderLine' | 'ProductOptionGroup'
  >
>;
type CF = Record<string, unknown>;

type EntityWithCF = {
  customFields: CF;
  translations?: { customFields: CF; languageCode: LanguageCode }[];
};

type Props<T extends ViableEntity> = {
  entityName: T;
  id?: string;
  currentLanguage?: LanguageCode;
  fetch?: (runtimeSelector: any) => Promise<EntityWithCF>;
  mutation?: (customFields: unknown, translations?: unknown) => Promise<void>;
  disabled?: boolean;
};

const entityDictionary: Partial<
  Record<
    ViableEntity,
    {
      inputName: keyof ModelTypes;
      mutationName: keyof ModelTypes['Mutation'];
    }
  >
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
};

// this serves a purpose of having common customFields and translation.customFields as a common value for all entity types
// because gfflp only accepts zeus modelType input
const typeWithCommonCustomFields: keyof Pick<ModelTypes, 'UpdateProductOptionInput'> = 'UpdateProductOptionInput';

export function EntityCustomFields<T extends ViableEntity>({
  id,
  entityName,
  currentLanguage: _currentLanguage,
  mutation,
  fetch,
  disabled,
}: Props<T>) {
  const { t, i18n } = useTranslation('common');

  const currentLanguage = useMemo(
    () => _currentLanguage || i18n?.language || 'en',
    [_currentLanguage, t],
  ) as LanguageCode;

  const [loading, setLoading] = useState(true);
  const { state, setField } = useGFFLP(typeWithCommonCustomFields, 'customFields', 'translations')({});
  const entityCustomFields = useServer((p) =>
    p.serverConfig?.entityCustomFields?.find(
      (el) => el.entityName.charAt(0).toLowerCase() + el.entityName.slice(1) === entityName,
    ),
  )?.customFields;

  const capitalizedEntityName = useMemo(
    () => (entityName.charAt(0).toUpperCase() + entityName.slice(1)) as Capitalize<T>,
    [entityName],
  );

  const runtimeSelector = useMemo(
    () => mergeSelectorWithCustomFields({}, capitalizedEntityName, entityCustomFields),
    [entityCustomFields, capitalizedEntityName],
  );

  const relationFields = useMemo(
    () => entityCustomFields?.filter((el) => el.__typename === 'RelationCustomFieldConfig').map((el) => el.name),
    [entityCustomFields],
  );

  const fetchEntity = useCallback(async () => {
    if (!id) return;
    try {
      let response;

      if (fetch) {
        response = await fetch(runtimeSelector);
      } else {
        const { [entityName]: genericResponse } = (await apiCall()('query')({
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
  }, [runtimeSelector, entityName, id]);

  const updateEntity = useCallback(async () => {
    const preparedCustomFields = Object.entries(
      (state.customFields?.validatedValue || {}) as Record<string, any>,
    ).reduce((acc, [key, val]) => {
      if (relationFields?.includes(key)) {
        const newKey = key + (Array.isArray(val) ? 'Ids' : 'Id');
        acc[newKey] = Array.isArray(val) ? val?.map((el) => el.id) : val?.id || null;
      } else acc[key] = val;

      return acc;
    }, {} as CF);

    try {
      if (mutation) {
        await mutation(preparedCustomFields, state?.translations?.validatedValue);
      } else {
        const mutationName = entityDictionary[entityName]?.['mutationName'];
        if (!mutationName)
          throw new Error('no mutationName provided. Add it to entityDictionary or provide custom mutation prop');
        await apiCall()('mutation')({
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
    }
  }, [state, entityName]);

  useEffect(() => {
    if (!entityCustomFields?.length) return;

    try {
      setLoading(true);
      fetchEntity();
    } finally {
      setLoading(false);
    }
  }, [entityCustomFields, id]);

  if (!entityCustomFields?.length) return <></>;

  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations?.find((v) => v.languageCode === currentLanguage);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('custom-fields.title')}</CardTitle>
        <CardDescription>{t('custom-fields.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Spinner />
        ) : (
          <CustomFieldsComponent
            value={state.customFields?.value}
            translation={currentTranslationValue}
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
            customFields={entityCustomFields}
          />
        )}
        <hr className="my-4" />
        <div className="flex justify-end">
          <Button disabled={disabled} onClick={updateEntity}>
            {t('update')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
