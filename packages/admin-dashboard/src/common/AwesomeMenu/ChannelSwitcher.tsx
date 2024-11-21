import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useServer,
  useSettings,
} from '@deenruv/react-ui-devkit';
import { US, PL, CZ, DE } from 'country-flag-icons/react/3x2';
import { clearAllCache } from '@/lists/cache';
import { DEFAULT_CHANNEL_CODE } from '@/consts';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

function FlagIcon({ langCode }: { langCode?: string }) {
  switch (langCode) {
    case 'en':
      return <US />;
    case 'pl':
      return <PL />;
    case 'cs':
      return <CZ />;
    case 'de':
      return <DE />;
    default:
      return null;
  }
}

interface ChannelSwitcherProps {
  isCollapsed: boolean;
}

export function ChannelSwitcher({ isCollapsed }: ChannelSwitcherProps) {
  const channels = useServer((p) => p.channels);
  const setSelectedChannel = useSettings((p) => p.setSelectedChannel);
  const selectedChannel = useSettings((p) => p.selectedChannel);
  const { t } = useTranslation('common');

  const onChannelChange = (id: string) => {
    const channel = channels.find((channel) => channel.id === id);
    if (!channel) return;
    setSelectedChannel(channel);
    clearAllCache();
  };

  const getChannelLabel = useCallback(
    (code: string | undefined) => (code === DEFAULT_CHANNEL_CODE ? t('defaultChannel') : code),
    [t],
  );

  return (
    <Select defaultValue={selectedChannel?.id} onValueChange={onChannelChange} value={selectedChannel?.id}>
      <SelectTrigger
        className={cn(
          'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
          isCollapsed && 'flex h-9 w-9 shrink-0 items-center justify-center p-0 [&>span]:w-auto [&>svg]:hidden',
        )}
        aria-label="Select an channel"
      >
        <SelectValue>
          <FlagIcon langCode={channels.find((account) => account.id === selectedChannel?.id)?.defaultLanguageCode} />
          <span className={cn('ml-2', isCollapsed && 'hidden')}>
            {getChannelLabel(channels.find((account) => account.id === selectedChannel?.id)?.code)}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {channels.map((channel) => (
          <SelectItem key={channel.code} value={channel.id}>
            <div className="[&_svg]:text-foreground flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0">
              <FlagIcon langCode={channel.defaultLanguageCode} />
              {getChannelLabel(channel.code)}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
