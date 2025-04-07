import {
  DeenruvUIPlugin,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@deenruv/react-ui-devkit";
import React from "react";
import { CircleOff, CheckCircle, XCircle, ImageOff } from "lucide-react";
import { ScalarsType } from "@deenruv/admin-types";
import { FromSelector, GraphQLTypes } from "./zeus/index.js";

export type FromSelectorWithScalars<
  SELECTOR,
  NAME extends keyof GraphQLTypes,
> = FromSelector<SELECTOR, NAME, ScalarsType>;

// declare module '@deenruv/react-ui-devkit' {
//     interface ExternalListLocationSelector {
//         'products-list-view': FromSelectorWithScalars<GraphQLTypes['Product'], 'Product'>;
//         'products-list-views': FromSelectorWithScalars<GraphQLTypes['Product'], 'Product'>;
//     }
// }

export const tables: DeenruvUIPlugin["tables"] = [
  {
    id: "facet-values-list",
    columns: [
      {
        accessorKey: "customFields.hexColor",
        header: () => "Color",
        cell: ({ row }) => {
          const color =
            // @ts-ignore
            row.original.customFields.hexColor;

          return !color || color === "---" ? (
            <CircleOff size={18} />
          ) : (
            <div
              className="border-gray size-5 rounded-full border-2 border-solid"
              style={{
                backgroundColor: color,
              }}
            ></div>
          );
        },
      },
      {
        accessorKey: "customFields.isNew",
        header: () => "New",
        cell: ({ row }) =>
          // @ts-ignore
          row.original.customFields.isNew ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          ),
      },
      {
        accessorKey: "customFields.isHidden",
        header: () => "Hidden",
        cell: ({ row }) =>
          // @ts-ignore
          row.original.customFields.isNew ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          ),
      },
      {
        accessorKey: "customFields.image",
        header: () => "Image",
        cell: ({ row }) => {
          // @ts-ignore
          const value = row.original.customFields?.image?.preview;
          return value ? (
            <Tooltip>
              <TooltipTrigger>
                <img
                  className="border-gray rounded-sm"
                  width={24}
                  src={value + "?preset=tiny"}
                />
              </TooltipTrigger>
              <TooltipContent className="my-2" side="left">
                <img width={300} src={value + "?preset=medium"} />
              </TooltipContent>
            </Tooltip>
          ) : (
            <ImageOff size={20} />
          );
        },
      },
    ],
  },
];
