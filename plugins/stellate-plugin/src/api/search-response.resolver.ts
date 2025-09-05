import { Info, ResolveField, Resolver } from "@nestjs/graphql";
import { type GraphQLResolveInfo } from "graphql/type";

@Resolver("SearchResponse")
export class SearchResponseFieldResolver {
  @ResolveField()
  cacheIdentifier(@Info() info: GraphQLResolveInfo) {
    const collectionSlug = (info.variableValues.input as any)?.collectionSlug;
    return { collectionSlug };
  }
}
