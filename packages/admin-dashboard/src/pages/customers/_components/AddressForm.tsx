import { forwardRef, useEffect, useImperativeHandle } from 'react';
import {
  CustomerAddressType,
  Input,
  SimpleSelect,
  useDeenruvForm,
  z,
  useServer,
  EntityCustomFields,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { ModelTypes } from '@deenruv/admin-types';

interface AddressCardProps {
  addressId?: string;
  initialValues?: Omit<CustomerAddressType, 'id'>;
  onInputChange: (input: ModelTypes['CreateAddressInput']) => void;
}

export type AddressFormRef = {
  validate: () => boolean;
};

export const AddressForm = forwardRef<AddressFormRef, AddressCardProps>(
  ({ initialValues: address, addressId, onInputChange }, ref) => {
    const { t } = useTranslation('customers');
    const countries = useServer((p: { countries: Array<{ name: string; code: string }> }) => p.countries);

    const addressSchema = z.object({
      fullName: z.string().min(1, t('selectAddress.nameRequired')),
      company: z.string().default(''),
      streetLine1: z.string().min(1, t('selectAddress.streetRequired')),
      streetLine2: z.string().default(''),
      postalCode: z.string().min(1, t('selectAddress.postalCodeRequired')),
      countryCode: z.string().min(1, t('selectAddress.countryRequired')),
      phoneNumber: z.string().min(1, t('selectAddress.phoneNumberRequired')),
      city: z.string().min(1, t('selectAddress.cityRequired')),
      province: z.string().default(''),
      customFields: z.record(z.string(), z.any()).default({}),
    });
    const form = useDeenruvForm({
      schema: addressSchema,
      defaultValues: {
        fullName: address?.fullName ?? '',
        company: address?.company ?? '',
        streetLine1: address?.streetLine1 ?? '',
        streetLine2: address?.streetLine2 ?? '',
        postalCode: address?.postalCode ?? '',
        countryCode: address?.country?.code ?? '',
        phoneNumber: address?.phoneNumber ?? '',
        city: address?.city ?? '',
        province: address?.province ?? '',
        customFields: {},
      },
    });
    const formValues = form.watch();

    useImperativeHandle(ref, () => ({
      validate: () => {
        // trigger is async but ref API expects sync boolean — use formState.isValid
        // which is reliable because mode is 'onTouched' and all fields have been interacted with
        void form.trigger();
        return form.formState.isValid;
      },
    }));

    useEffect(() => {
      const input: ModelTypes['CreateAddressInput'] = {
        countryCode: formValues.countryCode,
        streetLine1: formValues.streetLine1,
        streetLine2: formValues.streetLine2,
        city: formValues.city,
        company: formValues.company,
        fullName: formValues.fullName,
        phoneNumber: formValues.phoneNumber,
        postalCode: formValues.postalCode,
        province: formValues.province,
        ...(formValues.customFields && Object.keys(formValues.customFields).length > 0
          ? { customFields: formValues.customFields }
          : {}),
      };
      onInputChange(input);
    }, [formValues]);

    return (
      <form className="flex flex-col gap-3 overflow-auto">
        <Input
          label={t('selectAddress.inputNameLabel')}
          placeholder={t('selectAddress.inputNamePlaceholder')}
          value={formValues.fullName ?? undefined}
          defaultValue={formValues.fullName ?? undefined}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setField('fullName', e.target.value)}
          errors={form.formState.errors.fullName?.message ? [form.formState.errors.fullName.message] : undefined}
          required
        />
        <Input
          label={t('selectAddress.inputCompanyLabel')}
          placeholder={t('selectAddress.inputCompanyPlaceholder')}
          value={formValues.company ?? undefined}
          defaultValue={formValues.company ?? undefined}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setField('company', e.target.value)}
          errors={form.formState.errors.company?.message ? [form.formState.errors.company.message] : undefined}
        />
        <Input
          label={t('selectAddress.inputStreetLabel')}
          placeholder={t('selectAddress.inputStreetPlaceholder')}
          value={formValues.streetLine1}
          defaultValue={formValues.streetLine1}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setField('streetLine1', e.target.value)}
          errors={form.formState.errors.streetLine1?.message ? [form.formState.errors.streetLine1.message] : undefined}
          required
        />
        <Input
          label={t('selectAddress.inputStreet2Label')}
          placeholder={t('selectAddress.inputStreet2Placeholder')}
          value={formValues.streetLine2 ?? undefined}
          defaultValue={formValues.streetLine2 ?? undefined}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setField('streetLine2', e.target.value)}
          errors={form.formState.errors.streetLine2?.message ? [form.formState.errors.streetLine2.message] : undefined}
        />
        <Input
          label={t('selectAddress.inputCityLabel')}
          placeholder={t('selectAddress.inputCityPlaceholder')}
          defaultValue={formValues.city ?? undefined}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setField('city', e.target.value)}
          errors={form.formState.errors.city?.message ? [form.formState.errors.city.message] : undefined}
          required
        />
        <Input
          label={t('selectAddress.inputProvinceLabel')}
          placeholder={t('selectAddress.inputProvincePlaceholder')}
          defaultValue={formValues.province ?? undefined}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setField('province', e.target.value)}
          errors={form.formState.errors.province?.message ? [form.formState.errors.province.message] : undefined}
        />
        <Input
          label={t('selectAddress.inputPostalLabel')}
          placeholder={t('selectAddress.inputPostalPlaceholder')}
          value={formValues.postalCode ?? undefined}
          defaultValue={formValues.postalCode ?? undefined}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setField('postalCode', e.target.value)}
          errors={form.formState.errors.postalCode?.message ? [form.formState.errors.postalCode.message] : undefined}
          required
        />
        <Input
          label={t('selectAddress.inputPhoneLabel')}
          placeholder={t('selectAddress.inputPhonePlaceholder')}
          value={formValues.phoneNumber ?? undefined}
          defaultValue={formValues.phoneNumber ?? undefined}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => form.setField('phoneNumber', e.target.value)}
          errors={form.formState.errors.phoneNumber?.message ? [form.formState.errors.phoneNumber.message] : undefined}
          required
        />
        <SimpleSelect
          label={t('selectAddress.countrySelectLabel')}
          options={countries.map((c: { name: string; code: string }) => ({ label: c.name, value: c.code }))}
          value={formValues.countryCode}
          onValueChange={(value: string) => form.setField('countryCode', value)}
          errors={form.formState.errors.countryCode?.message ? [form.formState.errors.countryCode.message] : undefined}
          required
        />
        {addressId && (
          <EntityCustomFields
            id={addressId}
            entityName="address"
            hideButton
            initialValues={
              address && 'customFields' in address
                ? { customFields: address.customFields as any }
                : { customFields: {} }
            }
            onChange={(cf: Record<string, unknown>) => {
              form.setField('customFields', cf);
            }}
            additionalData={{}}
            withoutBorder
          />
        )}
      </form>
    );
  },
);
