import { LanguageCode, ModelTypes } from '@deenruv/admin-types';
import { useTranslation } from 'react-i18next';

export const useValidators = () => {
  const { t } = useTranslation('common');

  const nameValidator = {
    validate: (v: string | null | undefined) => {
      if (!v || v === '') return [t('validation.nameRequired')];
    },
  };

  const stringValidator = (requiredMessage?: string) => ({
    validate: (v: string | null | undefined) => {
      if (!v || v === '') return [requiredMessage ?? t('validation.fieldRequired')];
    },
  });

  const numberValidator = (requiredMessage?: string) => ({
    validate: (v: number | null | undefined) => {
      if (v === null || v === undefined) return [requiredMessage ?? t('validation.fieldRequired')];
    },
  });

  const emailValidator = {
    validate: (v: string | null | undefined) => {
      const errors: string[] = [];
      if (!v || v === '') errors.push(t('validation.emailRequired'));
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) errors.push(t('validation.emailPattern'));

      return errors;
    },
  };

  const translationsValidator = {
    validate: (
      v?:
        | {
            id?: string | null | undefined;
            languageCode: LanguageCode | null | undefined;
            name?: string | null | undefined;
            description?: string | null | undefined;
            customFields?: any;
          }[]
        | null
        | undefined,
    ) => {
      if (!v) return [t('validation.nameRequired')];
      const { name } = v[0];

      if (!name) return [t('validation.nameRequired')];
    },
  };

  const configurableOperationValidator = (requiredCodeMessage?: string, requiredArgsMessage?: string) => ({
    validate: (v?: ModelTypes['ConfigurableOperationInput'] | null | undefined) => {
      const hasCode = !!v?.code;
      const hasInvalidArguments = v?.arguments.filter((a) => !a.value).length; // args have 'false' value by default
      const errors = [];

      if (!hasCode) errors.push(requiredCodeMessage ?? t('validation.configurableCodeRequired'));
      if (hasInvalidArguments) errors.push(requiredArgsMessage ?? t('validation.configurableArgsRequired'));
      return errors;
    },
  });

  const configurableOperationArrayValidator = (requiredCodeMessage?: string, requiredArgsMessage?: string) => ({
    validate: (v?: Array<ModelTypes['ConfigurableOperationInput']> | null | undefined) => {
      if (!v) return [requiredCodeMessage ?? t('validation.configurableCodeRequired')];
      const hasCode = !!v?.[0]?.code;
      const hasInvalidArguments = v.some((op) =>
        // op.arguments.some(a => !a.value || a.value === 'false')
        op.arguments.some((a) => !a.value),
      );

      const errors = [];
      if (!hasCode) errors.push(requiredCodeMessage ?? t('validation.configurableCodeRequired'));
      if (hasInvalidArguments) errors.push(requiredArgsMessage ?? t('validation.configurableArgsRequired'));
      return errors;
    },
  });

  const arrayValidator = (requiredMessage?: string) => ({
    validate: (v: any[] | null | undefined) => {
      if (!v || !v.length) return [requiredMessage ?? t('validation.nameRequired')];
    },
  });

  return {
    nameValidator,
    stringValidator,
    numberValidator,
    emailValidator,
    arrayValidator,
    translationsValidator,
    configurableOperationValidator,
    configurableOperationArrayValidator,
  };
};
