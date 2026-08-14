import { describe, expect, it } from 'vitest';
import type { ChannelType } from '@deenruv/react-ui-devkit';
import { selectPreferredChannel, switchSelectedChannel } from './channel-selection.js';

const channel = (id: string, code: string) => ({ id, code }) as ChannelType;
const channels = [
  channel('first', 'first'),
  channel('built-in', '__default_channel__'),
  channel('configured', 'configured'),
];

describe('selectPreferredChannel', () => {
  it('retains a still-valid selected channel before defaults', () => {
    expect(selectPreferredChannel(channels, channels[0], 'configured', '__default_channel__')).toBe(channels[0]);
  });

  it('uses configured, built-in, then first fallback priority', () => {
    expect(selectPreferredChannel(channels, channel('missing', 'missing'), 'configured', '__default_channel__')).toBe(
      channels[2],
    );
    expect(selectPreferredChannel(channels, undefined, 'missing', '__default_channel__')).toBe(channels[1]);
    expect(selectPreferredChannel([channels[0]], undefined, 'missing', '__default_channel__')).toBe(channels[0]);
  });

  it('suppresses permissions until they belong to the newly selected channel', () => {
    const snapshots: Array<{ channelId: string; permissions: string[] }> = [];
    let selectedChannelId = 'first';
    let permissions = ['CreateProduct'];
    const record = () => snapshots.push({ channelId: selectedChannelId, permissions });

    switchSelectedChannel(channels[2], {
      clearPermissions: () => {
        permissions = [];
        record();
      },
      selectChannel: (channel) => {
        selectedChannelId = channel.id;
        record();
      },
      setPermissionsForChannel: (channelId) => {
        permissions = channelId === 'configured' ? ['ReadProduct'] : [];
        record();
      },
    });

    expect(snapshots).toEqual([
      { channelId: 'first', permissions: [] },
      { channelId: 'configured', permissions: [] },
      { channelId: 'configured', permissions: ['ReadProduct'] },
    ]);
  });
});
