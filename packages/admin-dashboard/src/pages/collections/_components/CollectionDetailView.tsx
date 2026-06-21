import { useCallback, useEffect, useRef } from 'react';

import {
  CF,
  EntityCustomFields,
  Input,
  Label,
  Switch,
  Checkbox,
  CustomCard,
  CardIcons,
  useDetailView,
  useSettings,
  useServer,
  RichTextEditor,
  useTranslation,
  setInArrayBy,
  EntityChannelManager,
  Routes,
  normalizeString,
} from '@deenruv/react-ui-devkit';
import { FiltersCard } from '@/pages/collections/_components/FiltersCard';
import { ContentsCard } from '@/pages/collections/_components/ContentsCard';
import { AssetsCard } from '@/pages/products/_components/AssetsCard.js';
import { useNavigate } from 'react-router';

export const CollectionsDetailView = () => {
  const { t } = useTranslation('collections');
  const contentLng = useSettings((p) => p.translationsLanguage);
  const selectedChannel = useSettings((p) => p.selectedChannel);
  const channels = useServer((p) => p.channels);
  const navigate = useNavigate();
  const { form, fetchEntity, entity, id } = useDetailView(
    'collections-detail-view',
    'CreateCollectionInput',
    'translations',
    'assetIds',
    'featuredAssetId',
    'isPrivate',
    'inheritFilters',
    'filters',
    'customFields',
  );

  const { base } = form;

  // --- Slug auto-generation ---
  // Track whether the user has manually edited the slug for the current language.
  // Using a ref avoids extra re-renders; keyed per-language so switching tabs resets.
  const slugManuallyEditedRef = useRef<Record<string, boolean>>({});

  // Reset manual-edit flag when switching to a language whose slug is still empty
  // (so auto-gen kicks in for new translations).
  useEffect(() => {
    if (!contentLng) return;
    const current = slugManuallyEditedRef.current[contentLng];
    if (current === undefined) {
      slugManuallyEditedRef.current[contentLng] = false;
    }
  }, [contentLng]);

  useEffect(() => {
    (async () => {
      const resp = await fetchEntity();
      if (!resp) return;

      base.setField('translations', resp.translations);
      base.setField(
        'assetIds',
        resp.assets.map((a) => a.id),
      );
      base.setField('featuredAssetId', resp.featuredAsset?.id);
      base.setField('isPrivate', resp.isPrivate);
      base.setField('inheritFilters', resp.inheritFilters);
      base.setField(
        'filters',
        resp.filters.map((f) => ({ code: f.code, arguments: f.args })),
      );
    })();
  }, [contentLng, selectedChannel?.id]);

  const translations = base.watch('translations') || [];
  const additionalChannelIds = (base.watch('additionalChannelIds') as string[] | undefined) ?? [];
  const currentTranslationValue = translations.find((v: any) => v.languageCode === contentLng);

  const toggleAdditionalChannel = useCallback(
    (channelId: string, checked: boolean) => {
      if (channelId === selectedChannel?.id) return;
      const currentIds = (base.watch('additionalChannelIds') as string[] | undefined) ?? [];
      const nextIds = checked ? [...new Set([...currentIds, channelId])] : currentIds.filter((id) => id !== channelId);
      base.setField('additionalChannelIds', nextIds);
    },
    [base, selectedChannel?.id],
  );

  const handleAddAsset = useCallback(
    (newId: string | undefined | null) => {
      if (!newId) return;
      const currentIds = base.watch('assetIds') || [];
      base.setField('assetIds', [...currentIds, newId]);
    },
    [base, base.setField],
  );

  const setTranslationField = useCallback(
    (field: string, e: string) => {
      // On create the translations array is initially empty, so build a
      // fallback translation object so the field update is never lost.
      const baseTranslation = currentTranslationValue ?? {
        languageCode: contentLng,
        name: '',
        slug: '',
        description: '',
      };

      const updatedTranslation: Record<string, unknown> = {
        ...baseTranslation,
        [field]: e,
        languageCode: contentLng,
      };

      // Auto-generate slug when name changes
      if (field === 'name') {
        const isCreate = id === undefined;
        const existingSlug = baseTranslation.slug;
        const slugWasManuallyEdited = slugManuallyEditedRef.current[contentLng ?? ''];

        // Auto-fill slug when:
        // 1. Create mode: always, unless user manually edited slug
        // 2. Edit mode: only if the existing slug is empty/missing
        if (!slugWasManuallyEdited && (isCreate || !existingSlug)) {
          updatedTranslation.slug = normalizeString(e, '-');
        }
      }

      base.setField(
        'translations',
        setInArrayBy(translations, (t: any) => t.languageCode === contentLng, updatedTranslation),
      );
    },
    [contentLng, translations, currentTranslationValue, id],
  );

  const handleSlugManualEdit = useCallback(() => {
    if (contentLng) {
      slugManuallyEditedRef.current[contentLng] = true;
    }
  }, [contentLng]);

  return (
    <main>
      <div className="flex flex-col gap-3">
        <CustomCard title={t('details.basic.title')} icon={<CardIcons.basic />} color="blue">
          <div className="flex flex-wrap items-start gap-4 p-0 pt-4">
            <div className="flex w-full flex-wrap items-start gap-4 p-0 pt-4 xl:flex-nowrap">
              <div className="flex basis-full md:basis-1/3">
                <Input
                  label={t('details.basic.name')}
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
              <div className="flex basis-full md:basis-1/3">
                <Input
                  label={t('details.basic.slug')}
                  value={currentTranslationValue?.slug ?? ''}
                  onChange={(e) => {
                    handleSlugManualEdit();
                    setTranslationField('slug', e.target.value);
                  }}
                  required
                />
              </div>
              <div className="mt-7 flex basis-full items-center gap-3 md:basis-1/3">
                <Switch
                  checked={base.watch('isPrivate') ?? false}
                  onCheckedChange={(e) => base.setField('isPrivate', e)}
                />
                <Label>{t('details.basic.isPrivate')}</Label>
              </div>
            </div>
            <div className="flex basis-full flex-col">
              <Label className="mb-2">{t('details.basic.description')}</Label>
              <RichTextEditor
                content={currentTranslationValue?.description ?? ''}
                onContentChanged={(e) => setTranslationField('description', e)}
              />
            </div>
          </div>
        </CustomCard>
        <AssetsCard
          onAddAsset={handleAddAsset}
          featuredAssetId={base.watch('featuredAssetId') ?? undefined}
          assetsIds={base.watch('assetIds') ?? undefined}
          onFeaturedAssetChange={(id) => base.setField('featuredAssetId', id)}
          onAssetsChange={(ids) => base.setField('assetIds', ids)}
        />
        {id ? (
          <EntityChannelManager
            entity="collection"
            entityId={id}
            entityChannels={[{ id: selectedChannel?.id, code: selectedChannel?.code }]}
            onRemoveSuccess={() => navigate(Routes.collections.list)}
          />
        ) : (
          <CustomCard title={t('details.channels.title')} icon={<CardIcons.shipping />} color="green">
            <div className="flex flex-col gap-4 pt-4">
              <p className="text-sm text-muted-foreground">{t('details.channels.description')}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {channels.map((channel) => {
                  const isCurrentChannel = channel.id === selectedChannel?.id;
                  const checked = isCurrentChannel || additionalChannelIds.includes(channel.id);

                  return (
                    <label
                      key={channel.id}
                      className="flex items-center gap-3 rounded-md border p-3 text-sm transition-colors hover:bg-muted/50"
                    >
                      <Checkbox
                        checked={checked}
                        disabled={isCurrentChannel}
                        onCheckedChange={(value) => toggleAdditionalChannel(channel.id, !!value)}
                      />
                      <span className="font-medium">{channel.code}</span>
                      {isCurrentChannel && (
                        <span className="ml-auto rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                          {t('details.channels.currentChannel')}
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
              {!channels.length && <p className="text-sm text-muted-foreground">{t('details.channels.noChannels')}</p>}
            </div>
          </CustomCard>
        )}
        <FiltersCard
          currentFiltersValue={base.watch('filters') ?? undefined}
          onFiltersValueChange={(filters) => base.setField('filters', filters ?? [])}
          inheritValue={base.watch('inheritFilters') ?? false}
          onInheritChange={(e) => base.setField('inheritFilters', e)}
          errors={
            base.formState.errors?.filters?.message ? [base.formState.errors.filters.message as string] : undefined
          }
        />
        <EntityCustomFields
          entityName="collection"
          id={id}
          hideButton
          onChange={(customFields, translations) => {
            base.setField('customFields', customFields);
            if (translations) base.setField('translations', translations as any);
          }}
          initialValues={
            entity && 'customFields' in entity
              ? { customFields: entity.customFields as CF, translations: entity.translations as any }
              : { customFields: {} }
          }
        />
        {id && <ContentsCard collectionId={id} />}
      </div>
    </main>
  );
};
