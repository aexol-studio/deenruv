import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Input,
  Label,
  Switch,
  apiClient,
  DetailList,
  deepMerge,
  PaginationInput,
  useDetailView,
  useSettings,
  setInArrayBy,
  DetailViewMarker,
  CustomCard,
  CardIcons,
  ListLocations,
  CF,
  EntityCustomFields,
  useTranslation,
  EntityChannelManagementBulkAction,
} from '@deenruv/react-ui-devkit';
import { AddFacetValueDialog } from './AddFacetValueDialog.js';
import { Permission, SortOrder } from '@deenruv/admin-types';

const tableId = 'facet-values-list';
const { selector } = ListLocations[tableId];

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean | any> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteFacetValues } = await apiClient('mutation')({
      deleteFacetValues: [{ ids }, { message: true, result: true }],
    });
    return !!deleteFacetValues.length;
  } catch (error) {
    return error;
  }
};

const STOCK_LOCATION_FORM_KEYS = [
  'CreateFacetInput',
  'translations',
  'values',
  'code',
  'isPrivate',
  'customFields',
] as const;

export const FacetsDetailView = () => {
  const { form, fetchEntity, entity, additionalData, setAdditionalData, id } = useDetailView(
    'facets-detail-view',
    ...STOCK_LOCATION_FORM_KEYS,
  );
  const { base } = form;
  const editMode = useMemo(() => !!id, [id]);
  const { t } = useTranslation(['common', 'facets']);
  const [facetValueIdInModal, setFacetValueIdInModal] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { translationsLanguage: currentTranslationLng } = useSettings();
  const translations = base.watch('translations') || [];
  const currentTranslationValue = translations.find((v: any) => v.languageCode === currentTranslationLng);

  const setTranslationField = useCallback(
    (field: string, e: string) => {
      const baseTranslation = currentTranslationValue ?? {
        languageCode: currentTranslationLng,
        name: '',
      };

      base.setField(
        'translations',
        setInArrayBy(translations, (t: any) => t.languageCode === currentTranslationLng, {
          ...baseTranslation,
          [field]: e,
          languageCode: currentTranslationLng,
        }),
      );
    },

    [currentTranslationLng, translations, currentTranslationValue],
  );

  const fetchFacetValues = useCallback(
    async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
      // if (!id) return Promise.resolve([]);
      const response = await apiClient('query')({
        ['facetValues']: [
          {
            options: {
              take: perPage,
              skip: (page - 1) * perPage,
              filterOperator: filterOperator,
              sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
              ...(filter && { filter: { ...filter, facetId: { eq: id } } }),
            },
          },
          { items: deepMerge(selector, additionalSelector ?? {}), totalItems: true },
        ],
      });
      return response['facetValues'];
    },
    [id],
  );

  useEffect(() => {
    (async () => {
      const res = await fetchEntity();
      if (!res) return;
      base.setField('translations', res.translations);
      base.setField('code', res.code);
      base.setField('isPrivate', res.isPrivate);
      if ('customFields' in res) base.setField('customFields', res.customFields as CF);
    })();
  }, []);

  useEffect(() => {
    if (!editMode && currentTranslationValue?.name) {
      base.setField('code', currentTranslationValue.name.toLowerCase().replace(/\s+/g, '-'));
    }
  }, [currentTranslationValue?.name, editMode]);

  return (
    <main className="my-4">
      <div className="flex flex-col gap-3">
        <CustomCard title={t('facets:details.basicInfo')} icon={<CardIcons.basic />} color="green">
          <div className="flex gap-8 p-0 pt-2">
            <div className="basis-full md:basis-1/2 xl:basis-1/3">
              <Input
                label={t('facets:table.name')}
                value={currentTranslationValue?.name ?? ''}
                onChange={(e) => setTranslationField('name', e.target.value)}
                errors={
                  base.formState.errors?.translations?.message
                    ? [base.formState.errors.translations.message as string]
                    : undefined
                }
                required
              />
            </div>
            <div className="basis-full md:basis-1/2 xl:basis-1/3">
              <Input
                label={t('facets:table.code')}
                value={base.watch('code') ?? ''}
                onChange={(e) => base.setField('code', e.target.value)}
                errors={
                  base.formState.errors?.code?.message ? [base.formState.errors.code.message as string] : undefined
                }
                required
              />
            </div>
            <div className="basis-full md:basis-1/2 xl:basis-1/3">
              <Label>{t('facets:table.isPrivate')}</Label>
              <div className="mt-2 flex gap-3">
                <Switch
                  checked={base.watch('isPrivate') ?? false}
                  onCheckedChange={(e) => base.setField('isPrivate', e)}
                />
                <p>{base.watch('isPrivate') ? t('facets:table.isPrivate') : t('facets:table.public')}</p>
              </div>
            </div>
          </div>
        </CustomCard>
        <DetailViewMarker position={'facets-detail-view'} />
        <EntityCustomFields
          entityName="facet"
          id={id}
          hideButton
          onChange={(customFields, translations) => {
            base.setField('customFields', customFields);
            if (translations) base.setField('translations', translations);
          }}
          initialValues={
            entity && 'customFields' in entity
              ? { customFields: entity.customFields as CF, translations: entity.translations as any }
              : { customFields: {} }
          }
        />
        {entity && editMode && (
          <CustomCard
            title={t('facets:details.facetValues')}
            icon={<CardIcons.tag />}
            color="teal"
            upperRight={
              <AddFacetValueDialog
                open={open}
                setOpen={setOpen}
                facetId={entity.id}
                facetValueId={facetValueIdInModal}
                onFacetValueChange={() => {
                  setAdditionalData({ ...additionalData, refetchList: true });
                  setFacetValueIdInModal(null);
                }}
              />
            }
          >
            <DetailList
              entityName="FacetValue"
              hideColumns={['customFields', 'createdAt', 'updatedAt']}
              additionalBulkActions={[...EntityChannelManagementBulkAction(tableId)]}
              fetch={fetchFacetValues}
              onRemove={onRemove}
              route={{
                edit: (id) => {
                  setFacetValueIdInModal(id);
                  setOpen(true);
                },
                create: () => {
                  setFacetValueIdInModal(null);
                  setOpen(true);
                },
              }}
              searchFields={['name']}
              tableId={tableId}
              noPaddings
              createPermissions={[Permission.CreateFacet]}
              deletePermissions={[Permission.DeleteFacet]}
            />
          </CustomCard>
        )}
      </div>
    </main>
  );
};
