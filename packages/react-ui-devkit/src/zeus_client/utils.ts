import { LanguageCode } from '@deenruv/admin-types';

type ParamChannel = { name: string; value?: string };

export const buildDeenruvParams = ({
    adminAPIHost,
    languageCode,
    channel,
}: {
    adminAPIHost: string;
    languageCode: keyof typeof LanguageCode;
    channel: ParamChannel;
}): [string, RequestInit] => {
    return [buildURL(adminAPIHost, languageCode), buildOptions({ channel })];
};

const buildURL = (adminAPIHost: string, languageCode: keyof typeof LanguageCode): string => {
    return `${adminAPIHost}/admin-api?languageCode=${languageCode}`;
};

const buildOptions = ({ channel }: { channel: ParamChannel }): RequestInit => {
    return { credentials: 'include', method: 'POST', headers: buildHeaders({ channel }) };
};

const buildHeaders = ({ channel }: { channel: ParamChannel }): Headers => {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    if (channel.value) headers.set(channel.name, channel.value);
    return headers;
};
