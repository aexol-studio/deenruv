/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Deenruv server (Admin API). */
  readonly VITE_ADMIN_HOST_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
