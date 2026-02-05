import {
  typedGql,
  scalars,
  $,
  GraphQLTypes,
  ValueTypes,
} from "@deenruv/admin-types";

const genericResponseObj = { id: true };
const genericDeleteObj = { message: true };

export const getMutation = (
  mutationName: keyof GraphQLTypes["Mutation"],
  customResponseObj?: Record<string, Record<string, boolean>>,
) => {
  const isDeleteMutation = mutationName.startsWith("delete");
  const responseObj = customResponseObj
    ? customResponseObj
    : isDeleteMutation
      ? genericDeleteObj
      : genericResponseObj;

  // Dynamic mutation builder: mutation name and input type are computed at runtime,
  // so we need targeted type overrides for the Zeus type system
  const inputType =
    `${mutationName.charAt(0).toUpperCase() + mutationName.slice(1)}Input!` as const;
  const mutationObj = {
    [mutationName]: [
      {
        // @ts-expect-error - Dynamic input type string can't satisfy GraphQLVariableType union
        input: $("input", inputType),
      },
      responseObj,
    ],
  } as ValueTypes["Mutation"];

  // @ts-expect-error - Dynamic mutation object causes deep type instantiation with Zeus
  return typedGql("mutation", { scalars })(mutationObj);
};
