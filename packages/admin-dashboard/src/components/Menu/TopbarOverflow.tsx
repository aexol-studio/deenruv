import {
  Button,
  type PluginComponent,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { SlidersHorizontal } from 'lucide-react';
import React from 'react';

import { ChannelSwitcher } from './ChannelSwitcher.js';
import { LanguagesDropdown } from './LanguagesDropdown.js';

type TopbarOverflowProps = {
  components: PluginComponent[];
  showChannelPicker: boolean;
  showLanguagePicker: boolean;
};

export const TopbarOverflow = ({ components, showChannelPicker, showLanguagePicker }: TopbarOverflowProps) => {
  const { t } = useTranslation('common');

  if (components.length === 0 && !showChannelPicker && !showLanguagePicker) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-9 shrink-0 lg:hidden"
          aria-label={t('openTopbarControls')}
          title={t('openTopbarControls')}
        >
          <SlidersHorizontal className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="z-[2138] w-[min(20rem,calc(100vw-2rem))] p-3 lg:hidden">
        <div className="flex flex-col gap-3">
          {components.length > 0 && (
            <div
              className={`flex flex-wrap items-center gap-2 ${showChannelPicker || showLanguagePicker ? 'border-b pb-3' : ''}`}
            >
              {components.map(({ component: Component }, index) => (
                <Component key={index} />
              ))}
            </div>
          )}
          {showChannelPicker || showLanguagePicker ? (
            <div className="flex flex-wrap items-center gap-2">
              {showLanguagePicker ? <LanguagesDropdown /> : null}
              {showChannelPicker ? <ChannelSwitcher className="min-w-0 flex-1" /> : null}
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
};
