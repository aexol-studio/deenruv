const MERCHANT_ID_PATTERN = /^[1-9]\d*$/;

export type GoogleDataSourceDiscoveryRequest = {
  generation: number;
  merchantId: string;
};

export function isValidGoogleMerchantId(value: string): boolean {
  return MERCHANT_ID_PATTERN.test(value.trim());
}

export function createGoogleDataSourceDiscoveryRequestTracker(): {
  begin: (merchantId: string) => GoogleDataSourceDiscoveryRequest;
  invalidate: () => void;
  isCurrent: (
    request: GoogleDataSourceDiscoveryRequest,
    currentMerchantId: string,
  ) => boolean;
} {
  let generation = 0;
  return {
    begin: (merchantId) => ({
      generation: ++generation,
      merchantId: merchantId.trim(),
    }),
    invalidate: () => {
      generation += 1;
    },
    isCurrent: (request, currentMerchantId) =>
      request.generation === generation &&
      request.merchantId === currentMerchantId.trim(),
  };
}

export function selectDiscoveredGoogleDataSource(
  currentValue: string,
  selectedValue: string,
  discoveredValues: readonly string[],
): string {
  return discoveredValues.includes(selectedValue) ? selectedValue : currentValue;
}
