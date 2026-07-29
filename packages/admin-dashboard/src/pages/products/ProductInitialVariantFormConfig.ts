export const getProductInitialVariantFormConfig = (isCreating: boolean, initialVariantSkuRequiredError: string) => {
  if (!isCreating) return {};

  return {
    initialVariantSku: {
      validate: (value: unknown) => {
        if (!value || typeof value !== 'string' || !value.trim()) {
          return [initialVariantSkuRequiredError];
        }
      },
    },
    initialVariantPrice: {
      initialValue: 0,
    },
    initialVariantName: {},
  };
};
