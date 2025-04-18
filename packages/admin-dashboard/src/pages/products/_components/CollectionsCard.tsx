import { useTranslation, Badge, CardIcons, CustomCard } from '@deenruv/react-ui-devkit';
import React from 'react';

interface CollectionsCardProps {
  collections: {
    name: string;
    slug: string;
  }[];
}

export const CollectionsCard: React.FC<CollectionsCardProps> = ({ collections }) => {
  const { t } = useTranslation('products');

  return (
    <CustomCard title={t('collections')} color="teal" icon={<CardIcons.group />}>
      <div className="flex flex-wrap gap-2">
        {collections.map((c) => (
          <Badge variant="secondary" key={c.slug}>
            {c.name}
          </Badge>
        ))}
      </div>
    </CustomCard>
  );
};
