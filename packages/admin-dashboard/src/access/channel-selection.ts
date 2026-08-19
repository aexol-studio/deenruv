import type { ChannelType } from '@deenruv/react-ui-devkit';

type ChannelSelectionActions = {
  clearPermissions: () => void;
  selectChannel: (channel: ChannelType) => void;
  setPermissionsForChannel: (channelId: string) => void;
};

export const switchSelectedChannel = (channel: ChannelType, actions: ChannelSelectionActions): void => {
  actions.clearPermissions();
  actions.selectChannel(channel);
  actions.setPermissionsForChannel(channel.id);
};

export const selectPreferredChannel = (
  channels: ChannelType[],
  retainedChannel: ChannelType | undefined,
  configuredDefaultCode: string | undefined,
  builtInDefaultCode: string,
  forceConfiguredDefault = false,
): ChannelType | undefined =>
  forceConfiguredDefault
    ? channels.find((channel) => channel.code === configuredDefaultCode)
    : (channels.find((channel) => channel.id === retainedChannel?.id) ??
      channels.find((channel) => channel.code === configuredDefaultCode) ??
      channels.find((channel) => channel.code === builtInDefaultCode) ??
      channels[0]);
