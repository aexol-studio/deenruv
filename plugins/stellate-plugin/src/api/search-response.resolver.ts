import { Info, ResolveField, Resolver } from "@nestjs/graphql";
import { GraphQLResolveInfo } from "graphql/type";

type SearchInputVariableValues = {
  input?: {
    collectionSlug?: unknown;
  };
};

@Resolver("SearchResponse")
export class SearchResponseFieldResolver {
  @ResolveField()
  cacheIdentifier(@Info() info: GraphQLResolveInfo) {
    const variableValues = info.variableValues as SearchInputVariableValues;
    const collectionSlug =
      typeof variableValues.input?.collectionSlug === "string"
        ? variableValues.input.collectionSlug
        : undefined;

    return { collectionSlug };
  }
}
