import { BaseContext } from '@apollo/server';
import { ApolloServerPluginResponseCacheOptions } from '@apollo/server-plugin-response-cache';
export type ApolloCachePluginOptions = ApolloServerPluginResponseCacheOptions<BaseContext>;
