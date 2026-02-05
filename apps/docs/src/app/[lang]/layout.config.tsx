import { i18n } from '@/lib/i18n';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: (
        <>
          <img src="/logo.webp" alt="Deenruv" className="h-6 w-auto" />
          <span className="font-semibold">Deenruv</span>
        </>
      ),
    },
    links: [
      {
        text: locale === 'pl' ? 'Dokumentacja' : 'Documentation',
        url: `/${locale}/docs`,
        active: 'nested-url',
      },
      {
        text: 'GitHub',
        url: 'https://github.com/aexol-studio/deenruv',
      },
    ],
  };
}
