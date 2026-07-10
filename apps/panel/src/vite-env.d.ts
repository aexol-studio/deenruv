/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ADMIN_ACCESS_PROFILE?: string;
  readonly VITE_ADMIN_UI_PLUGINS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
