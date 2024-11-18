import { LanguageCode } from '@deenruv/admin-types';

export const buildDeenruvParams = ({
    adminAPIHost,
    languageCode,
    channel,
}: {
    adminAPIHost: string;
    languageCode: keyof typeof LanguageCode;
    channel: { name: string; value: string };
}): [string, RequestInit] => {
    return [buildURL(adminAPIHost, languageCode), buildOptions({ channel })];
};

const buildURL = (adminAPIHost: string, languageCode: keyof typeof LanguageCode): string => {
    return `${adminAPIHost}/admin-api?languageCode=${languageCode}`;
};

const buildOptions = ({ channel }: { channel: { name: string; value: string } }): RequestInit => {
    return { credentials: 'include', method: 'POST', headers: buildHeaders({ channel }) };
};

const buildHeaders = ({ channel }: { channel: { name: string; value: string } }): Headers => {
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    headers.set(channel.name, channel.value);
    return headers;
};
