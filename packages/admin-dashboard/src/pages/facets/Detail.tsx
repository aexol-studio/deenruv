import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { FacetDetailsSelector, FacetDetailsType } from '@/graphql/facets';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Switch,
  Routes,
  apiClient,
  DetailList,
  deepMerge,
  PaginationInput,
} from '@deenruv/react-ui-devkit';
import { EntityCustomFields } from '@/components';
import { ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { AddFacetValueDialog } from './_components/AddFacetValueDialog.js';
import { DeletionResult, LanguageCode, SortOrder } from '@deenruv/admin-types';
import { toast } from 'sonner';
import { useGFFLP } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';

const onRemove = async <T extends { id: string }[]>(items: T): Promise<boolean> => {
  try {
    const ids = items.map((item) => item.id);
    const { deleteFacetValues } = await apiClient('mutation')({
      deleteFacetValues: [{ ids }, { message: true, result: true }],
    });
    return !!deleteFacetValues.length;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const FacetsDetailPage = () => {
  const { id } = useParams();
  const editMode = useMemo(() => !!id, [id]);
  const navigate = useNavigate();
  const { resetCache } = cache('facets');
  const { t } = useTranslation(['common', 'facets']);
  const [loading, setLoading] = useState(id ? true : false);
  const [facet, setFacet] = useState<FacetDetailsType>();
  const [facetChanged, setFacetChanged] = useState(false);
  const [facetValueIdInModal, setFacetValueIdInModal] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const fetchFacetValues = useCallback(
    async <T, K>(
      { page, perPage, filter, filterOperator, sort }: PaginationInput,
      customFieldsSelector?: T,
      additionalSelector?: K,
    ) => {
      const selector = deepMerge(
        deepMerge(
          { id: true, name: true, code: true, customFields: true },
          customFieldsSelector ?? { hexColor: true, isNew: true, isHidden: true, image: true },
        ),
        additionalSelector ?? {},
      );
      const response = await apiClient('query')({
        ['facetValues']: [
          {
            options: {
              take: perPage,
              skip: (page - 1) * perPage,
              filterOperator: filterOperator,
              sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
              ...(filter && {
                filter: {
                  ...filter,
                  facetId: { eq: id },
                },
              }),
            },
          },
          { items: selector, totalItems: true },
        ],
      });
      return response['facetValues'];
    },
    [id],
  );

  const fetchFacet = useCallback(async () => {
    if (id) {
      const response = await apiClient('query')({
        facet: [
          {
            id,
          },
          FacetDetailsSelector,
        ],
      });
      setFacet(response.facet);
      setLoading(false);
    } else setLoading(false);
  }, [id]);

  const { state, setField } = useGFFLP(
    'Facet',
    'name',
    'code',
    'isPrivate',
    'customFields',
  )({
    code: {
      validate: (v) => {
        if (!v || v === '') return [t('facets:requiredError')];
      },
    },
  });

  useEffect(() => {
    if (!facet) return;

    setField('name', facet.name);
    setField('code', facet.code);
    setField('isPrivate', facet.isPrivate);
    // setField('customFields', facet.customFields);
  }, [facet]);

  useEffect(() => {
    if (!editMode && state.name?.value) {
      setField('code', state.name.value.toLowerCase().replace(/\s+/g, '-'));
    }
  }, [state.name?.value, setField, editMode]);

  const saveChanges = useCallback(() => {
    apiClient('mutation')({
      ['updateFacet']: [
        {
          input: {
            id: id!,
            code: state.code?.value,
            isPrivate: state.isPrivate?.value,
            translations: [
              {
                languageCode: LanguageCode.pl,
                name: state.name!.value,
              },
            ],
            customFields: {
              colorsCollection: state.customFields?.value?.colorsCollection,
              usedForColors: state.customFields?.value?.usedForColors,
            },
          },
        },
        {
          name: true,
        },
      ],
    })
      .then(() => {
        toast.message(t('facets:toasts.facetUpdateSuccess'));
        fetchFacet();
        resetCache();
      })
      .catch(() => toast.error(t('facets:toasts.facetUpdateError')));
  }, [state, resetCache, fetchFacet, id, t]);

  const createFacet = useCallback(() => {
    apiClient('mutation')({
      createFacet: [
        {
          input: {
            code: state.code!.value,
            isPrivate: !!state.isPrivate?.value,
            translations: [
              {
                languageCode: LanguageCode.pl,
                name: state.name!.value,
              },
            ],
            customFields: {
              colorsCollection: state.customFields?.value?.colorsCollection,
              usedForColors: state.customFields?.value?.usedForColors,
            },
          },
        },
        {
          name: true,
          id: true,
        },
      ],
    })
      .then((res) => {
        toast.message(t('facets:toasts.facetUpdateSuccess'));
        resetCache();
        navigate(Routes.facets.to(res.createFacet.id));
      })
      .catch(() => toast.error(t('facets:toasts.facetUpdateError')));
  }, [state, navigate, resetCache, t]);

  useEffect(() => {
    const areEqual = areObjectsEqual(
      {
        name: state.name?.value,
        code: state?.code?.value,
        isPrivate: state?.isPrivate?.value,
        // customFields: {
        //   usedForColors: state?.customFields?.value?.usedForColors,
        //   colorsCollection: state?.customFields?.value?.colorsCollection,
        // },
      },
      {
        name: facet?.name,
        code: facet?.code,
        isPrivate: facet?.isPrivate,
        // customFields: {
        //   usedForColors: facet?.customFields?.usedForColors,
        //   colorsCollection: facet?.customFields?.colorsCollection,
        // },
      },
    );
    setFacetChanged(!areEqual);
  }, [state, facet]);

  const removeAssetValue = useCallback(
    async (id: string) => {
      const response = await apiClient('mutation')({
        deleteFacetValues: [
          {
            ids: [id],
          },
          {
            message: true,
            result: true,
          },
        ],
      });

      if (response.deleteFacetValues[0].result === DeletionResult.DELETED) {
        toast.message(t('facets:details.valueDeleteSuccess'));
        fetchFacet();
      } else toast.error(t('facets:details.valueDeleteFail') + response.deleteFacetValues[0].message);
    },
    [fetchFacet, t],
  );

  useEffect(() => {
    setLoading(true);
    fetchFacet();
  }, [id, setLoading, fetchFacet]);

  return loading ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      <div className="customSpinner" />
    </div>
  ) : !facet && editMode ? (
    <div className="flex min-h-[80vh] w-full items-center justify-center">
      {t('facets:toasts.facetLoadingError', { value: id })}
    </div>
  ) : (
    <main className="my-4">
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(Routes.facets.list)}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">{t('common:back')}</span>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {facet?.name}
            </h1>
          </div>
          <Button variant={'action'} disabled={!facetChanged} onClick={editMode ? saveChanges : createFacet}>
            {editMode ? 'Edit' : 'Create'}
          </Button>
        </div>
        {editMode && facet && (
          <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
            <Label className="text-muted-foreground">{t('facets:baseInfoId', { value: id })}</Label>
            <Label className="text-muted-foreground">|</Label>
            <Label className="text-muted-foreground">
              {t('facets:baseInfoCreated', { value: format(new Date(facet.createdAt), 'dd.MM.yyyy hh:mm') })}
            </Label>
            <Label className="text-muted-foreground">|</Label>
            <Label className="text-muted-foreground">
              {t('facets:baseInfoUpdated', { value: format(new Date(facet.updatedAt), 'dd.MM.yyyy hh:mm') })}
            </Label>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">{t('facets:details.basicInfo')}</CardTitle>
              <CardContent className="flex gap-8 p-0 pt-2">
                <div className="basis-full md:basis-1/2 xl:basis-1/3">
                  <Label>{t('facets:table.name')}</Label>
                  <Input value={state.name?.value} onChange={(e) => setField('name', e.target.value)} />
                </div>
                <div className="basis-full md:basis-1/2 xl:basis-1/3">
                  <Label>{t('facets:table.code')}</Label>
                  <Input value={state.code?.value} onChange={(e) => setField('code', e.target.value)} />
                </div>
                <div className="basis-full md:basis-1/2 xl:basis-1/3">
                  <Label>{t('facets:table.isPrivate')}</Label>
                  <div className="mt-2 flex gap-3">
                    <Switch checked={state.isPrivate?.value} onCheckedChange={(e) => setField('isPrivate', e)} />
                    <p>{state.isPrivate?.value ? t('facets:table.isPrivate') : t('facets:table.public')}</p>
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
          {id && <EntityCustomFields entityName="facet" id={id} />}
          {facet && editMode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-row justify-between text-base">
                  {t('facets:details.facetValues')}
                  <AddFacetValueDialog
                    open={open}
                    setOpen={setOpen}
                    facetId={facet.id}
                    facetValueId={facetValueIdInModal}
                    onFacetValueChange={fetchFacet}
                  />
                </CardTitle>
                <CardContent className="flex p-0 pt-0">
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
                    tableId={'facet-values-list' as any}
                    type={'facetValues' as any}
                    noPaddings
                  />
                </CardContent>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
};
