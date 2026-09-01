import { print } from 'graphql';
import { describe, expect, it } from 'vitest';
import { adminApiExtensions } from './api-extensions.js';

describe('merchant admin API settings contract', () => {
  it('requires settings entries lists', () => {
    const schema = print(adminApiExtensions);

    expect(schema).toContain('entries: [MerchantPlatformSetting!]!');
    expect(schema).toContain('entries: [MerchantPlatformSettingInput!]!');
  });

  it('exposes read-only Google data-source discovery', () => {
    const schema = print(adminApiExtensions);

    expect(schema).toContain(
      'getGoogleMerchantDataSources(merchantId: String!): [String!]!',
    );
  });
});
