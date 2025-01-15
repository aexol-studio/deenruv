import { Badge, Card, CardContent, CardHeader, CardTitle } from '@deenruv/react-ui-devkit';
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
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('channels')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {channels.map((p) => (
            <Badge key={p.id}>{p.code}</Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
