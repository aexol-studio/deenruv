import { useTranslation, Badge, CardIcons, CustomCard, DEFAULT_CHANNEL_CODE } from '@deenruv/react-ui-devkit';
import React from 'react';

interface ChannelsCardProps {
  channels: {
    id: string;
    code: string;
  }[];
}

export const ChannelsCard: React.FC<ChannelsCardProps> = ({ channels }) => {
  const { t } = useTranslation(['products', 'channels']);

  return (
    <CustomCard title={t('products:channels')} color="orange" icon={<CardIcons.default />}>
      <div className="flex flex-wrap gap-2">
        {channels.map((p) => (
          <Badge key={p.id}>{p.code === DEFAULT_CHANNEL_CODE ? t('channels:defaultChannel') : p.code}</Badge>
        ))}
      </div>
    </CustomCard>
  );
};
