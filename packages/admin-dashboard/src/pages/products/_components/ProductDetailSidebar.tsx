import { Badge, Card, CardContent, CardHeader, CardTitle, useDetailViewStore } from '@deenruv/react-ui-devkit';
import { useEffect } from 'react';

import { SettingsCard } from './SettingsCard';
import { useTranslation } from 'react-i18next';

export const ProductDetailSidebar = () => {
  const { contentLanguage, setContentLanguage, view, form } = useDetailViewStore(
    'products-detail-view',
    ({ contentLanguage, setContentLanguage, view, form }) => ({
      contentLanguage,
      setContentLanguage,
      view,
      form,
    }),
    'CreateProductInput',
  );
  const { t } = useTranslation('products');
  const {
    base: { state, setField },
  } = form;

  useEffect(() => {
    if (!view.entity) return;
    setField('translations', view.entity.translations);
    setField(
      'facetValueIds',
      view.entity.facetValues.map((f) => f.id),
    );
    setField(
      'assetIds',
      view.entity.assets.map((a) => a.id),
    );
    setField('featuredAssetId', view.entity.featuredAsset?.id);
  }, [view.entity]);

  return (
    <div className="flex w-full flex-col gap-4">
      <SettingsCard
        currentTranslationLng={contentLanguage}
        enabledValue={state.enabled?.value}
        onEnabledChange={(e) => setField('enabled', e)}
        onCurrentLanguageChange={setContentLanguage}
      />
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between text-base">{t('channels')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {view.entity?.channels.map((p) => <Badge key={p.id}>{p.code}</Badge>)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row justify-between text-base">{t('collections')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {view.entity?.collections.map((c) => <Badge key={c.slug}>{c.name}</Badge>)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
