import type { StorefrontEntityUrlContext, StorefrontEntityUrlResolver } from '@deenruv/react-ui-devkit';

export type StorefrontEntityUrlDisabledReason =
  | 'resolverFailed'
  | 'resolverEmpty'
  | 'urlNotAbsolute'
  | 'unsupportedProtocol';

export type StorefrontEntityUrlState =
  | { kind: 'hidden' }
  | { kind: 'disabled'; reason: StorefrontEntityUrlDisabledReason }
  | { kind: 'ready'; url: string };

export const getStorefrontEntityUrlState = (
  context: StorefrontEntityUrlContext,
  resolver: StorefrontEntityUrlResolver,
): StorefrontEntityUrlState => {
  let resolvedUrl: ReturnType<StorefrontEntityUrlResolver>;
  try {
    resolvedUrl = resolver(context);
  } catch {
    return { kind: 'disabled', reason: 'resolverFailed' };
  }

  if (resolvedUrl === undefined) return { kind: 'hidden' };
  if (resolvedUrl === null) return { kind: 'disabled', reason: 'resolverEmpty' };

  let urlString: string;
  let protocol: string;
  try {
    const url = new globalThis.URL(resolvedUrl);
    urlString = url.href;
    protocol = url.protocol;
  } catch {
    return { kind: 'disabled', reason: 'urlNotAbsolute' };
  }

  if (protocol !== 'http:' && protocol !== 'https:') {
    return { kind: 'disabled', reason: 'unsupportedProtocol' };
  }

  return { kind: 'ready', url: urlString };
};
