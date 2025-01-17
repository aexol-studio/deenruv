import { Badge, Card, CardContent, CardHeader, CardTitle } from '@deenruv/react-ui-devkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface CollectionsCardProps {
  collections: {
    name: string;
    slug: string;
  }[];
}

export const CollectionsCard: React.FC<CollectionsCardProps> = ({ collections }) => {
  const { t } = useTranslation('products');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('collections')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {collections.map((c) => (
            <Badge variant="secondary" key={c.slug}>
              {c.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
