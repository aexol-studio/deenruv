import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiCall } from '@/graphql/client';
import { FacetDetailsSelector, FacetDetailsType } from '@/graphql/facets';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  ContextMenu,
  DropdownMenuItem,
  EmptyState,
  Input,
  Label,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components';
import { Routes } from '@/utils';
import { ChevronLeft, ImageOff, Check, X, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ColorSample } from './_components/ColorSample';
import { AddFacetValueDialog } from './_components/AddFacetValueDialog';
import { DeletionResult, LanguageCode } from '@/zeus';
import { toast } from 'sonner';
import { useGFFLP } from '@/lists/useGflp';
import { areObjectsEqual } from '@/utils/deepEqual';
import { cache } from '@/lists/cache';

export const FacetPage = () => {
  const { id } = useParams();
  const editMode = useMemo(() => !!id, [id]);
  const navigate = useNavigate();
  const { resetCache } = cache('facets');
  const { t } = useTranslation(['common', 'facets']);
  const [loading, setLoading] = useState(id ? true : false);
  const [facet, setFacet] = useState<FacetDetailsType>();
  const [facetChanged, setFacetChanged] = useState(false);

  const fetchFacet = useCallback(async () => {
    if (id) {
      const response = await apiCall()('query')({
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
    setField('customFields', facet.customFields);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facet]);

  useEffect(() => {
    if (!editMode && state.name?.value) {
      setField('code', state.name.value.toLowerCase().replace(/\s+/g, '-'));
    }
  }, [state.name?.value, setField, editMode]);

  const saveChanges = useCallback(() => {
    apiCall()('mutation')({
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
    apiCall()('mutation')({
      createFacet: [
        {
          input: {
            code: state.code!.value,
            isPrivate: state.isPrivate!.value,
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
        navigate(Routes.facet.to(res.createFacet.id));
      })
      .catch(() => toast.error(t('facets:toasts.facetUpdateError')));
  }, [state, navigate, resetCache, t]);

  useEffect(() => {
    const areEqual = areObjectsEqual(
      {
        name: state.name?.value,
        code: state?.code?.value,
        isPrivate: state?.isPrivate?.value,
        customFields: {
          usedForColors: state?.customFields?.value?.usedForColors,
          colorsCollection: state?.customFields?.value?.colorsCollection,
        },
      },
      {
        name: facet?.name,
        code: facet?.code,
        isPrivate: facet?.isPrivate,
        customFields: {
          usedForColors: facet?.customFields?.usedForColors,
          colorsCollection: facet?.customFields?.colorsCollection,
        },
      },
    );
    setFacetChanged(!areEqual);
  }, [state, facet]);

  const tableHeaders = [
    t('facets:table.name'),
    t('facets:table.code'),
    t('facets:table.createdAt'),
    t('facets:table.color'),
    t('facets:table.new'),
    t('facets:table.isPrivate'),
    t('facets:table.image'),
    '',
  ];

  const removeAssetValue = useCallback(
    async (id: string) => {
      const response = await apiCall()('mutation')({
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
    <main>
      <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(Routes.facets)}>
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
              {t('facets:baseInfoCreated', { value: format(facet.createdAt, 'dd.MM.yyyy hh:mm') })}
            </Label>
            <Label className="text-muted-foreground">|</Label>
            <Label className="text-muted-foreground">
              {t('facets:baseInfoUpdated', { value: format(facet.updatedAt, 'dd.MM.yyyy hh:mm') })}
            </Label>
          </div>
        )}
        <Stack column className="gap-3">
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
                  <Stack className="mt-2 gap-3">
                    <Switch checked={state.isPrivate?.value} onCheckedChange={(e) => setField('isPrivate', e)} />
                    <p>{state.isPrivate?.value ? t('facets:table.isPrivate') : t('facets:table.public')}</p>
                  </Stack>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-row justify-between text-base">
                {t('facets:details.customFields')}
              </CardTitle>
              <CardContent className="flex gap-8 p-0 pt-2">
                <div className="flex basis-full items-center gap-4 md:basis-1/2 xl:basis-1/2">
                  <Checkbox
                    checked={state.customFields?.value?.usedForColors}
                    onCheckedChange={(e) =>
                      setField('customFields', { ...state.customFields?.value, usedForColors: e as boolean })
                    }
                  />
                  <div>
                    <Label>{t('facets:table.usedForColors')}</Label>
                    <p className="text-sm">{t('facets:details.usedForColorsDesc')}</p>
                  </div>
                </div>
                <div className="flex basis-full items-center gap-4 md:basis-1/2 xl:basis-1/2">
                  <Checkbox
                    checked={state.customFields?.value?.colorsCollection}
                    onCheckedChange={(e) =>
                      setField('customFields', { ...state.customFields?.value, colorsCollection: e as boolean })
                    }
                  />
                  <div>
                    <Label>{t('facets:table.colorsCollection')}</Label>
                    <p className="text-sm">{t('facets:details.colorsCollectionDesc')}</p>
                  </div>
                </div>
              </CardContent>
            </CardHeader>
          </Card>
          {facet && editMode && (
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-row justify-between text-base">
                  {t('facets:details.facetValues')}
                  <AddFacetValueDialog facetId={facet.id} onFacetValueChange={fetchFacet} />
                </CardTitle>
                <CardContent className="flex gap-8 p-0 pt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {tableHeaders.map((h) => (
                          <TableHead key={h}>{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {facet.values.length ? (
                        facet.values.map((v) => (
                          <TableRow key={v.name}>
                            <TableCell>{v.name}</TableCell>
                            <TableCell>{v.code}</TableCell>
                            <TableCell>{format(v.createdAt, 'PPP')}</TableCell>
                            <TableCell>
                              <ColorSample color={v.customFields?.hexColor} />
                            </TableCell>
                            <TableCell>{v.customFields?.isNew ? <Check /> : <X />}</TableCell>
                            <TableCell>{v.customFields?.isHidden ? <Check /> : <X />}</TableCell>
                            <TableCell>
                              {v.customFields?.image?.source ? (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <img width={24} src={v.customFields.image.source + '?preset=tiny'} />
                                  </TooltipTrigger>
                                  <TooltipContent className="my-2">
                                    <img width={300} src={v.customFields.image.source + '?preset=medium'} />
                                  </TooltipContent>
                                </Tooltip>
                              ) : (
                                <ImageOff />
                              )}
                            </TableCell>
                            <TableCell className="flex justify-end gap-2">
                              <ContextMenu>
                                <DropdownMenuItem
                                  onClick={() => removeAssetValue(v.id)}
                                  className="flex cursor-pointer items-center gap-3 p-2"
                                >
                                  <Trash2 size={20} />
                                  {t('facets:buttons.deleteValue')}
                                </DropdownMenuItem>
                                <AddFacetValueDialog
                                  facetId={facet.id}
                                  onFacetValueChange={fetchFacet}
                                  facetValue={v}
                                />
                              </ContextMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <>
                          <EmptyState columnsLength={tableHeaders.length} elementsType="facets" />
                        </>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </CardHeader>
            </Card>
          )}
        </Stack>
      </div>
    </main>
  );
};
