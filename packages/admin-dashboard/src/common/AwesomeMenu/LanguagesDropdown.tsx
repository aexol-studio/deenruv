import { LanguageCode } from '@deenruv/admin-types';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  getLanguageName,
  useSettings,
} from '@deenruv/react-ui-devkit';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const uiLanguages = [LanguageCode.en, LanguageCode.pl];

export const LanguagesDropdown = () => {
  const { t } = useTranslation('common');
  const { contentLng, setContentLng, setUiLng, uiLng, contentLanguages } = useSettings((p) => ({
    uiLng: p.language,
    setUiLng: p.setLanguage,
    contentLng: p.translationsLanguage,
    setContentLng: p.setTranslationsLanguage,
    contentLanguages: p.availableLanguages,
  }));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{t('language')}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[150]">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>{t('content')}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="z-[150]">
              {contentLanguages.map((lng) => (
                <DropdownMenuItem key={lng} onClick={() => lng !== contentLng && setContentLng(lng)}>
                  <span>{getLanguageName(lng, uiLng)}</span>
                  {lng === contentLng && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>UI</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="z-[150]">
              {uiLanguages.map((lng) => (
                <DropdownMenuItem key={lng} onClick={() => lng !== uiLng && setUiLng(lng)}>
                  <span>{getLanguageName(lng)}</span>
                  {lng === uiLng && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
