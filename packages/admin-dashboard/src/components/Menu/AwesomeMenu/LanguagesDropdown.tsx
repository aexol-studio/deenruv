import { LanguageCode } from '@deenruv/admin-types';
import {
  Badge,
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
import { US, PL, CZ, DE } from 'country-flag-icons/react/3x2';
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
        <Button variant="outline">
          {t('language')}
          {/* TODO: Change to better handling */}
          <Badge variant="outline" className="ml-2">
            {contentLng === LanguageCode.en ? (
              <US className="h-4 w-4" />
            ) : contentLng === LanguageCode.pl ? (
              <PL className="h-4 w-4" />
            ) : contentLng === LanguageCode.cs ? (
              <CZ className="h-4 w-4" />
            ) : contentLng === LanguageCode.de ? (
              <DE className="h-4 w-4" />
            ) : null}
          </Badge>
        </Button>
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
