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

export const TopbarOverflow = ({ components }: { components: PluginComponent[] }) => {
  const { t } = useTranslation('common');

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
            <div className="flex flex-wrap items-center gap-2 border-b pb-3">
              {components.map(({ component: Component }, index) => (
                <Component key={index} />
              ))}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <LanguagesDropdown />
            <ChannelSwitcher className="min-w-0 flex-1" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
