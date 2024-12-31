import { DEFAULT_CHANNEL_CODE, apiClient, useServer, useSettings } from '..';

export const fetchAndSetChannels = async () => {
    const { setSelectedChannel, selectedChannel } = useSettings.getState();
    const { setChannels } = useServer.getState();

    const {
        channels: { items: allChannels = [] },
    } = await apiClient('query')({
        channels: [
            {},
            {
                items: {
                    id: true,
                    code: true,
                    token: true,
                    currencyCode: true,
                    defaultLanguageCode: true,
                    availableLanguageCodes: true,
                },
            },
        ],
    });

    setChannels(allChannels);

    if (selectedChannel) {
        const foundChannel = allChannels.find(ch => ch.code === selectedChannel.code);
        setSelectedChannel(foundChannel || allChannels[0]);
        return;
    }

    const existingChannel = allChannels.find(
        ch => ch.code === window?.__DEENRUV_SETTINGS__?.ui?.defaultChannelCode,
    );
    if (existingChannel) {
        setSelectedChannel(existingChannel);
        return;
    }

    const defaultChannel = allChannels.find(ch => ch.code === DEFAULT_CHANNEL_CODE) || allChannels[0];
    setSelectedChannel(defaultChannel);
};
