import { Badge, CardIcons, CustomCard } from '@deenruv/react-ui-devkit';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ChannelsCardProps {
  channels: {
    id: string;
    code: string;
  }[];
}

export const ChannelsCard: React.FC<ChannelsCardProps> = ({ channels }) => {
  const { t } = useTranslation('products');

  return (
    <CustomCard title={t('channels')} color="orange" icon={<CardIcons.default />}>
      <div className="flex flex-wrap gap-2">
        {channels.map((p) => (
          <Badge key={p.id}>{p.code}</Badge>
        ))}
      </div>
    </CustomCard>
  );
};
