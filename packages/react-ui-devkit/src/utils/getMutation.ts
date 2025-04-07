// @ts-nocheck
import { typedGql, scalars, $, GraphQLTypes } from "@deenruv/admin-types";
import { capitalizeFirstLetter } from "./capitalizeFirstLetter.js";

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

  return typedGql("mutation", { scalars })({
    [mutationName]: [
      {
        input: $(
          "input",
          `${mutationName.charAt(0).toUpperCase() + mutationName.slice(1)}Input!`,
        ),
      },
      responseObj,
    ],
  });
};
