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
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { Check } from 'lucide-react';
import { US, PL, CZ, DE, EU } from 'country-flag-icons/react/3x2';
const uiLanguages = [LanguageCode.en, LanguageCode.pl];

const langFlagDict: Partial<Record<LanguageCode, React.ComponentType>> = {
  [LanguageCode.en]: US,
  [LanguageCode.pl]: PL,
  [LanguageCode.cs]: CZ,
  [LanguageCode.de]: DE,
  [LanguageCode.af]: EU,
};

export const LanguagesDropdown = () => {
  const { t } = useTranslation('common');
  const { contentLng, setContentLng, setUiLng, uiLng, selectedChannel } = useSettings((p) => ({
    uiLng: p.language,
    setUiLng: p.setLanguage,
    contentLng: p.translationsLanguage,
    setContentLng: p.setTranslationsLanguage,
    selectedChannel: p.selectedChannel,
  }));

  const Flag = langFlagDict[contentLng] || EU;

  const contentLanguages = selectedChannel?.availableLanguageCodes || [];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {t('language')}
          <Badge variant="outline" className="ml-2">
            <Flag className="size-4" />
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
                  {lng === contentLng && <Check className="ml-auto size-4" />}
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
                  {lng === uiLng && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
