// @ts-nocheck
import { typedGql, scalars, $, GraphQLTypes } from "@deenruv/admin-types";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
export const getMutation = (mutationName: keyof GraphQLTypes['Mutation']) => typedGql('mutation', { scalars })({
    [mutationName]: [
      {
        input: $('input', `${capitalize(mutationName)}Input!`),
      },
      { id: true },
    ],
  });