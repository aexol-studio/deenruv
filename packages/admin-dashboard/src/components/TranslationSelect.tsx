import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components';
import { useSettings } from '@/state';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TranslationSelect = () => {
  const { t } = useTranslation('common');
  const translationsLanguage = useSettings((p) => p.translationsLanguage);
  const setTranslationsLanguage = useSettings((p) => p.setTranslationsLanguage);
  const availableLanguages = useSettings((p) => p.availableLanguages);

  return (
    <Select value={translationsLanguage} onValueChange={setTranslationsLanguage}>
      <SelectTrigger className="w-auto">
        <div className="mr-2 flex items-center gap-2 ">
          <Globe size={16} />
          <SelectValue placeholder={t('languageCodePlaceholder')} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {availableLanguages.map((l) => (
            <SelectItem key={l} value={l}>
              {`${t(`languageCode.${l}`)} ${l.toUpperCase()}`}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
