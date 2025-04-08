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

export function ChannelSwitcher() {
  const channels = useServer((p) => p.channels);
  const setSelectedChannel = useSettings((p) => p.setSelectedChannel);
  const selectedChannel = useSettings((p) => p.selectedChannel);
  const { t } = useTranslation('common');

  const onChannelChange = (id: string) => {
    const channel = channels.find((channel) => channel.id === id);
    if (!channel) return;
    setSelectedChannel(channel);
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
        )}
        aria-label="Select an channel"
      >
        <SelectValue>
          <span className="ml-2">
            {getChannelLabel(channels.find((account) => account.id === selectedChannel?.id)?.code)}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {channels.map((channel) => (
          <SelectItem key={channel.code} value={channel.id}>
            <div className="[&_svg]:text-foreground flex items-center gap-3 [&_svg]:size-4 [&_svg]:shrink-0">
              {getChannelLabel(channel.code)}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
