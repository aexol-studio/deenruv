import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
} from '@deenruv/react-ui-devkit';
import { EntityCustomFields } from '@/components';
import { AddFacetValueDialog } from './AddFacetValueDialog.js';
import { Permission, SortOrder } from '@deenruv/admin-types';

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

const STOCK_LOCATION_FORM_KEYS = ['CreateFacetInput', 'translations', 'values', 'code', 'isPrivate'] as const;

export const FacetsDetailView = () => {
  const { id } = useParams();
  const { form, fetchEntity, entity, additionalData, setAdditionalData } = useDetailView(
    'facets-detail-view',
    ...STOCK_LOCATION_FORM_KEYS,
  );
  const {
    base: { setField, state },
  } = form;
  const editMode = useMemo(() => !!id, [id]);
  const { t } = useTranslation(['common', 'facets']);
  const [facetValueIdInModal, setFacetValueIdInModal] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { translationsLanguage: currentTranslationLng } = useSettings();
  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === currentTranslationLng);

  const setTranslationField = useCallback(
    (field: string, e: string) => {
      setField(
        'translations',
        setInArrayBy(translations, (t) => t.languageCode !== currentTranslationLng, {
          [field]: e,
          languageCode: currentTranslationLng,
        }),
      );
    },

    [currentTranslationLng, translations],
  );

  const fetchFacetValues = useCallback(
    async <T, K>(
      { page, perPage, filter, filterOperator, sort }: PaginationInput,
      customFieldsSelector?: T,
      additionalSelector?: K,
    ) => {
      const selector = deepMerge({ id: true, name: true, code: true }, additionalSelector ?? {});
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
          { items: selector, totalItems: true },
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
      setField('translations', res.translations);
      setField('code', res.code);
      setField('isPrivate', res.isPrivate);
    })();
  }, []);

  useEffect(() => {
    if (!editMode && currentTranslationValue?.name) {
      setField('code', currentTranslationValue.name.toLowerCase().replace(/\s+/g, '-'));
    }
  }, [currentTranslationValue?.name, editMode]);

  return (
    <main className="my-4">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <div className="flex flex-col gap-3">
          <CustomCard title={t('facets:details.basicInfo')} icon={<CardIcons.basic />} color="green">
            <div className="flex gap-8 p-0 pt-2">
              <div className="basis-full md:basis-1/2 xl:basis-1/3">
                <Input
                  label={t('facets:table.name')}
                  value={currentTranslationValue?.name ?? undefined}
                  onChange={(e) => setTranslationField('name', e.target.value)}
                  errors={state.translations?.errors}
                  required
                />
              </div>
              <div className="basis-full md:basis-1/2 xl:basis-1/3">
                <Input
                  label={t('facets:table.code')}
                  value={state.code?.value}
                  onChange={(e) => setField('code', e.target.value)}
                  errors={state.code?.errors}
                  required
                />
              </div>
              <div className="basis-full md:basis-1/2 xl:basis-1/3">
                <Label>{t('facets:table.isPrivate')}</Label>
                <div className="mt-2 flex gap-3">
                  <Switch checked={state.isPrivate?.value} onCheckedChange={(e) => setField('isPrivate', e)} />
                  <p>{state.isPrivate?.value ? t('facets:table.isPrivate') : t('facets:table.public')}</p>
                </div>
              </div>
            </div>
          </CustomCard>
          <DetailViewMarker position={'facets-detail-view'} />
          {id && <EntityCustomFields entityName="facet" id={id} />}
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
                tableId={'facet-values-list'}
                noPaddings
                createPermissions={[Permission.CreateFacet]}
                deletePermissions={[Permission.DeleteFacet]}
              />
            </CustomCard>
          )}
        </div>
      </div>
    </main>
  );
};
