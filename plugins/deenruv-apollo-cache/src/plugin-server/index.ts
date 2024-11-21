import { PluginCommonModule, DeenruvPlugin } from '@deenruv/core';
import { APOLLO_CACHE_PLUGIN_OPTIONS } from './options.js';
import { type ApolloCachePluginOptions } from './types.js';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { parseCookie } from './utils.js';
import gql from 'graphql-tag';

const sharedCacheExtension = gql`
    enum CacheControlScope {
        PUBLIC
        PRIVATE
    }

    directive @cacheControl(
        maxAge: Int
        scope: CacheControlScope
        inheritMaxAge: Boolean
    ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
`;

@DeenruvPlugin({
    compatibility: '^0.0.1',
    imports: [PluginCommonModule],
    providers: [{ provide: APOLLO_CACHE_PLUGIN_OPTIONS, useFactory: () => ApolloCachePlugin.options }],
    adminApiExtensions: { schema: sharedCacheExtension },
    shopApiExtensions: { schema: sharedCacheExtension },
    configuration: config => {
        const {
            sessionId = async req => {
                const cookies = parseCookie(req.request.http?.headers.get('cookie') ?? '');
                if (cookies.session && cookies['session.sig'])
                    return `${cookies.session}.${cookies['session.sig']}`;
                return null;
            },
        } = ApolloCachePlugin.options;
        config.apiOptions.apolloServerPlugins.push(
            responseCachePlugin({ ...ApolloCachePlugin.options, sessionId }),
        );
        return config;
    },
})
export class ApolloCachePlugin {
    static options: ApolloCachePluginOptions = {};
    static init(options: ApolloCachePluginOptions) {
        this.options = options;
        return ApolloCachePlugin;
    }
}
