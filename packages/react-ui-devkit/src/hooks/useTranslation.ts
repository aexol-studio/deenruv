import { useTranslation as BasicUseTranslation } from 'react-i18next';

export function useTranslation(ns?: string, options?: any) {
    return BasicUseTranslation(ns, options);
}
