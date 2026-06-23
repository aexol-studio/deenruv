import React from 'react';
import { useTranslation, CardIcons, CustomCard, Input } from '@deenruv/react-ui-devkit';

interface PersonalDataCard {
  setField: (fieldName: 'title' | 'firstName' | 'lastName' | 'emailAddress' | 'phoneNumber', value: string) => void;
  state: any;
}

export const PersonalDataCard: React.FC<PersonalDataCard> = ({ setField, state }) => {
  const { t } = useTranslation('customers');
  const getFieldErrors = (fieldName: 'firstName' | 'lastName' | 'emailAddress') =>
    state.formState.errors?.[fieldName]?.message ? [state.formState.errors[fieldName].message as string] : undefined;

  return (
    <CustomCard title={t('personalData.header')} icon={<CardIcons.basic />} color="blue">
      <div className="flex flex-col gap-4">
        <div className="flex w-1/4 gap-3">
          <Input
            label={t('personalData.title')}
            value={state.watch('title') ?? undefined}
            onChange={(e) => setField('title', e.target.value)}
          />
        </div>
        <div className="flex items-start gap-3">
          <Input
            label={t('personalData.firstName')}
            value={state.watch('firstName') ?? undefined}
            onChange={(e) => setField('firstName', e.target.value)}
            errors={getFieldErrors('firstName')}
            required
          />
          <Input
            label={t('personalData.lastName')}
            value={state.watch('lastName') ?? undefined}
            onChange={(e) => setField('lastName', e.target.value)}
            errors={getFieldErrors('lastName')}
            required
          />
        </div>
        <div className="flex items-start gap-3">
          <Input
            label={t('personalData.emailAddress')}
            value={state.watch('emailAddress') ?? undefined}
            onChange={(e) => setField('emailAddress', e.target.value)}
            errors={getFieldErrors('emailAddress')}
            required
          />
          <Input
            label={t('personalData.phoneNumber')}
            value={state.watch('phoneNumber') ?? undefined}
            onChange={(e) => setField('phoneNumber', e.target.value)}
          />
        </div>
      </div>
    </CustomCard>
  );
};
