import type { GraphQLTypes } from "@deenruv/admin-types";

export type DefaultProps<T> = {
  field: GraphQLTypes["CustomFieldConfig"];
  value: T;
  onChange: (e: T) => void;
};
