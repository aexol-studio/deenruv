import { BaseContext } from "@apollo/server";
import { ApolloServerPluginResponseCacheOptions } from "@apollo/server-plugin-response-cache";
import { ApolloServerPluginCacheControlOptions } from "@apollo/server/plugin/cacheControl";
export type ApolloCachePluginOptions = {
  responseCacheOptions: ApolloServerPluginResponseCacheOptions<BaseContext>;
  cacheControlOptions: ApolloServerPluginCacheControlOptions;
};
