/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Deenruv server (Admin API). */
  readonly VITE_ADMIN_HOST_URL: string;
  /** Optional storefront base URL used by entity detail links. */
  readonly VITE_STOREFRONT_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
