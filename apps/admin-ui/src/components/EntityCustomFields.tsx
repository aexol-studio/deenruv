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
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { LanguageCode, ModelTypes } from '@deenruv/admin-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useServer } from '@/state';
import { CardContent } from '.';
import { apiCall } from '@/graphql/client';
import { toast } from 'sonner';
import { getGqlError } from '@/utils';

type ViableEntity = Lowercase<keyof Pick<ModelTypes, 'Product' | 'Order' | 'Asset'>>;
type CustomFields = Record<string, any>;

type Props<T extends ViableEntity> = {
  entityName: T;
  id: string;
  currentLanguage?: LanguageCode;
};

const entityDictionary: Record<
  ViableEntity,
  {
    inputName: keyof Pick<ModelTypes, 'UpdateOrderInput' | 'UpdateProductInput' | 'UpdateAssetInput'>;
    mutationName: keyof Pick<ModelTypes['Mutation'], 'setOrderCustomFields' | 'updateProduct' | 'updateAsset'>;
  }
> = {
  product: {
    inputName: 'UpdateProductInput',
    mutationName: 'updateProduct',
  },
  order: {
    inputName: 'UpdateOrderInput',
    mutationName: 'setOrderCustomFields',
  },
  asset: {
    inputName: 'UpdateAssetInput',
    mutationName: 'updateAsset',
  },
};

// this serves a purpose of having common customFields and translation.customFields as a common value for all entity types
// because gfflp only accepts zeus modelType input
const typeWithCommonCustomFields: keyof Pick<ModelTypes, 'UpdateProductOptionInput'> = 'UpdateProductOptionInput';

export function EntityCustomFields<T extends ViableEntity>({ id, entityName, currentLanguage }: Props<T>) {
  const { t } = useTranslation('common');
  const [loading, setLoading] = useState(true);
  const { state, setField } = useGFFLP(typeWithCommonCustomFields, 'customFields', 'translations')({});
  const allCustomFields = useServer((p) => p.serverConfig?.entityCustomFields);

  const capitalizedEntityName = useMemo(
    () => (entityName.charAt(0).toUpperCase() + entityName.slice(1)) as Capitalize<T>,
    [entityName],
  );

  const entityCustomFields = useMemo(
    () => allCustomFields?.find((el) => el.entityName.toLowerCase() === entityName)?.customFields || [],
    [allCustomFields, entityName],
  );

  const runtimeSelector = useMemo(
    () => mergeSelectorWithCustomFields({}, capitalizedEntityName, entityCustomFields),
    [entityCustomFields, capitalizedEntityName],
  );

  useEffect(() => {
    if (!entityCustomFields.length) return;

    try {
      setLoading(true);
      fetchEntity();
    } finally {
      setLoading(false);
    }
  }, [entityCustomFields, id]);

  const fetchEntity = useCallback(async () => {
    try {
      const { [entityName]: response } = (await apiCall()('query')({
        [entityName]: [{ id }, runtimeSelector],
      } as any)) as Record<
        T,
        { customFields: CustomFields; translations: { customFields: CustomFields; languageCode: LanguageCode }[] }
      >;

      if (!response) {
        toast.error(t('custom-fields.toasts.error.fetch'));
        return;
      }

      setField('customFields', response?.customFields);
      setField('translations', response?.translations);
    } catch (err) {
      toast.error(getGqlError(err) || t('custom-fields.toasts.error.fetch'));
    }
  }, [runtimeSelector, entityName]);

  const updateEntity = useCallback(async () => {
    const mutationName = entityDictionary[entityName]['mutationName'];

    try {
      await apiCall()('mutation')({
        [mutationName]: [
          {
            input: {
              id,
              customFields: state.customFields?.validatedValue,
              translations: state?.translations?.validatedValue,
            },
          },
          { id: true },
        ],
      } as any);
    } catch (err) {
      toast.error(getGqlError(err) || t('custom-fields.toasts.error.mutation'));
    }
  }, [state, entityName]);

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
        <Button onClick={updateEntity}>Update</Button>
      </CardContent>
    </Card>
  );
}
