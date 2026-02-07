const defaultBaseUrl = "https://deenruv.com";

const normalizedBaseUrl = (
  process.env.NEXT_PUBLIC_DOCS_URL?.trim().replace(/\/$/, "") || defaultBaseUrl
).replace(/deenruv\.io/, "deenruv.com");

export const DOCS_BASE_URL = normalizedBaseUrl;

export function getMetadataBase(): URL {
  return new URL(DOCS_BASE_URL);
}

export function toAbsoluteUrl(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(path, getMetadataBase()).toString();
}
