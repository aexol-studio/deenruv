import React from 'react';
import { Badge, CardIcons, CustomCard } from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';

interface RolesCardProps {
  verified: boolean;
}

export const VerifiedCard: React.FC<RolesCardProps> = ({ verified }) => {
  const { t } = useTranslation('customers');

  return (
    <CustomCard title={t('verified.header')} icon={<CardIcons.permissions />} color="gray">
      <div className="flex gap-2">
        {verified ? <Badge>{t('verified.true')}</Badge> : <Badge>{t('verified.false')}</Badge>}
      </div>
    </CustomCard>
  );
};
