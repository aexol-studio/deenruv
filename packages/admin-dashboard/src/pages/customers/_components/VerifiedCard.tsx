import React from 'react';
import { Badge, Card, CardContent, CardHeader, CardTitle } from '@deenruv/react-ui-devkit';
import { Stack } from '@/components';
import { useTranslation } from 'react-i18next';

interface RolesCardProps {
  verified: boolean;
}

export const VerifiedCard: React.FC<RolesCardProps> = ({ verified }) => {
  const { t } = useTranslation('customers');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('roles.header')}</CardTitle>
        <CardContent className="flex flex-col gap-4 p-0 pt-4">
          <Stack className="gap-2">
            {verified ? <Badge>{t('verified.true')}</Badge> : <Badge>{t('verified.false')}</Badge>}
          </Stack>
        </CardContent>
      </CardHeader>
    </Card>
  );
};
