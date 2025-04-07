import { DeenruvUIPlugin } from "@deenruv/react-ui-devkit";
import { FromSelector, GraphQLTypes } from "./zeus";
import { ScalarsType } from "@deenruv/admin-types";

export type FromSelectorWithScalars<
  SELECTOR,
  NAME extends keyof GraphQLTypes,
> = FromSelector<SELECTOR, NAME, ScalarsType>;

//TODO: Add your custom types so it will infer the types in the plugin
// declare module '@deenruv/react-ui-devkit' {
//     interface ExternalListLocationSelector {
//         'products-list-view': FromSelectorWithScalars<GraphQLTypes['Product'], 'Product'>;
//     }
// }

export const tables: DeenruvUIPlugin["tables"] = [];
