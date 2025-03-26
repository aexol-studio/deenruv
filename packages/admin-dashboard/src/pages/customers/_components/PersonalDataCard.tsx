import React from 'react';
import { CardIcons, CustomCard, Input } from '@deenruv/react-ui-devkit';
import { Stack } from '@/components';
import { useTranslation } from 'react-i18next';

interface PersonalDataCard {
  setField: (fieldName: 'title' | 'firstName' | 'lastName' | 'emailAddress' | 'phoneNumber', value: string) => void;
  state: any;
}

export const PersonalDataCard: React.FC<PersonalDataCard> = ({ setField, state }) => {
  const { t } = useTranslation('customers');

  return (
    <CustomCard title={t('personalData.header')} icon={<CardIcons.basic />} color="blue">
      <Stack column className="gap-4">
        <Stack className="w-1/4 gap-3">
          <Input
            label={t('personalData.title')}
            value={state.title?.value}
            onChange={(e) => setField('title', e.target.value)}
          />
        </Stack>
        <Stack className="items-start gap-3">
          <Input
            label={t('personalData.firstName')}
            value={state.firstName?.value}
            onChange={(e) => setField('firstName', e.target.value)}
            errors={state.firstName?.errors}
            required
          />
          <Input
            label={t('personalData.lastName')}
            value={state.lastName?.value}
            onChange={(e) => setField('lastName', e.target.value)}
            errors={state.lastName?.errors}
            required
          />
        </Stack>
        <Stack className="items-start  gap-3">
          <Input
            label={t('personalData.emailAddress')}
            value={state.emailAddress?.value}
            onChange={(e) => setField('emailAddress', e.target.value)}
            errors={state.emailAddress?.errors}
            required
          />
          <Input
            label={t('personalData.phoneNumber')}
            value={state.phoneNumber?.value}
            onChange={(e) => setField('phoneNumber', e.target.value)}
          />
        </Stack>
      </Stack>
    </CustomCard>
  );
};
