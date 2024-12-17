import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, Input } from '@deenruv/react-ui-devkit';
import { Stack } from '@/components';
import { useTranslation } from 'react-i18next';

interface PersonalDataCard {
  setField: (fieldName: 'title' | 'firstName' | 'lastName' | 'emailAddress' | 'phoneNumber', value: string) => void;
  state: any;
}

export const PersonalDataCard: React.FC<PersonalDataCard> = ({ setField, state }) => {
  const { t } = useTranslation('customers');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('personalData.header')}</CardTitle>
        <CardContent className="flex flex-col gap-4 p-0 pt-4">
          <Stack column className="gap-3">
            <Stack className="w-1/4 gap-3">
              <Input
                label={t('personalData.title')}
                value={state.title?.value}
                onChange={(e) => setField('title', e.target.value)}
                required
              />
            </Stack>
            <Stack className="gap-3">
              <Input
                label={t('personalData.firstName')}
                value={state.firstName?.value}
                onChange={(e) => setField('firstName', e.target.value)}
                required
              />
              <Input
                label={t('personalData.lastName')}
                value={state.lastName?.value}
                onChange={(e) => setField('lastName', e.target.value)}
                required
              />
            </Stack>
            <Stack className="gap-3">
              <Input
                label={t('personalData.emailAddress')}
                value={state.emailAddress?.value}
                onChange={(e) => setField('emailAddress', e.target.value)}
                required
              />
              <Input
                label={t('personalData.phoneNumber')}
                value={state.phoneNumber?.value}
                onChange={(e) => setField('phoneNumber', e.target.value)}
                required
              />
            </Stack>
          </Stack>
        </CardContent>
      </CardHeader>
    </Card>
  );
};
