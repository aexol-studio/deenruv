import resources from '@/@types/resources';

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: typeof resources;
  }
}
