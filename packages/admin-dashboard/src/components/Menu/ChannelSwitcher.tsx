import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useServer,
  useSettings,
  DEFAULT_CHANNEL_CODE,
  cn,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { useCallback } from 'react';
import { switchSelectedChannel } from '@/access/channel-selection.js';

export function ChannelSwitcher({ className }: { className?: string }) {
  const channels = useServer((p) => p.channels);
  const setSelectedChannel = useSettings((p) => p.setSelectedChannel);
  const selectedChannel = useSettings((p) => p.selectedChannel);
  const setUserPermissions = useServer((p) => p.setUserPermissions);
  const setSelectedChannelPermissions = useServer((p) => p.setSelectedChannelPermissions);
  const { t } = useTranslation('common');

  const onChannelChange = (id: string) => {
    const channel = channels.find((channel) => channel.id === id);
    if (!channel) return;
    switchSelectedChannel(channel, {
      clearPermissions: () => setUserPermissions([]),
      selectChannel: setSelectedChannel,
      setPermissionsForChannel: setSelectedChannelPermissions,
    });
  };

  const getChannelLabel = useCallback(
    (code: string | undefined) => (code === DEFAULT_CHANNEL_CODE ? t('defaultChannel') : code),
    [t],
  );
  if (!channels || channels.length === 0) {
    return null;
  }
  return (
    <div className={className}>
      <Select defaultValue={selectedChannel?.id} onValueChange={onChannelChange} value={selectedChannel?.id}>
        <SelectTrigger
          className={cn(
            'flex h-9 items-center gap-2 border-border/80 bg-card px-3 text-xs font-medium [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate',
          )}
          aria-label="Select a channel"
        >
          <SelectValue>
            <span className="ml-1">
              {getChannelLabel(channels.find((account) => account.id === selectedChannel?.id)?.code)}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {channels.map((channel) => (
            <SelectItem key={channel.code} value={channel.id}>
              <div className="flex items-center gap-3 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-foreground">
                {getChannelLabel(channel.code)}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
