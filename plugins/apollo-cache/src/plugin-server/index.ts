import { PluginCommonModule, DeenruvPlugin } from '@deenruv/core';
import { APOLLO_CACHE_PLUGIN_OPTIONS } from './options.js';
import { type ApolloCachePluginOptions } from './types.js';
import responseCachePlugin from '@apollo/server-plugin-response-cache';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import { parseCookie } from './utils.js';

@DeenruvPlugin({
    compatibility: '^0.0.1',
    imports: [PluginCommonModule],
    providers: [{ provide: APOLLO_CACHE_PLUGIN_OPTIONS, useFactory: () => ApolloCachePlugin.options }],

    configuration: config => {
        const {
            sessionId = async req => {
                const cookies = parseCookie(req.request.http?.headers.get('cookie') ?? '');
                if (cookies.session && cookies['session.sig'])
                    return `${cookies.session}.${cookies['session.sig']}`;
                return null;
            },
        } = ApolloCachePlugin.options.responseCacheOptions;
        config.apiOptions.apolloServerPlugins.push(
            ApolloServerPluginCacheControl({ ...ApolloCachePlugin.options.cacheControlOptions }),
        );
        config.apiOptions.apolloServerPlugins.push(
            responseCachePlugin({ ...ApolloCachePlugin.options.responseCacheOptions, sessionId }),
        );
        return config;
    },
})
export class ApolloCachePlugin {
    static options: ApolloCachePluginOptions = { cacheControlOptions: {}, responseCacheOptions: {} };
    static init(options: ApolloCachePluginOptions = { cacheControlOptions: {}, responseCacheOptions: {} }) {
        this.options = options;
        return ApolloCachePlugin;
    }
}
