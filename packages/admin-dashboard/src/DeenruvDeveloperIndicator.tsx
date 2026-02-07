'use client';

import {
  Button,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  usePluginStore,
  Switch,
  ScrollArea,
  useServer,
  type GraphQLSchemaField,
  type GraphQLSchema,
} from '@deenruv/react-ui-devkit';
import { useState } from 'react';

// const SchemaField = ({ field, depth = 0 }: { field: GraphQLSchemaField; depth?: number }) => {
//   const [expanded, setExpanded] = useState(depth < 2);
//   const hasFields = field.fields && field.fields.length > 0;
//   const indent = Array(depth).fill('  ').join('');

//   return (
//     <div className="font-mono">
//       <div className="flex items-start">
//         <button
//           onClick={() => hasFields && setExpanded(!expanded)}
//           className={`mr-1 ${hasFields ? 'cursor-pointer' : 'cursor-default'} text-xs`}
//         >
//           {hasFields ? (expanded ? '▼' : '►') : '•'}
//         </button>
//         <div>
//           <span className="text-blue-600 dark:text-blue-400">{field.name}</span>
//           <span className="text-gray-600 dark:text-gray-400">: </span>
//           <span className="text-green-600 dark:text-green-400">{field.type}</span>
//           {field.description && (
//             <span className="ml-2 text-xs italic text-gray-500 dark:text-gray-400">// {field.description}</span>
//           )}
//         </div>
//       </div>
//       {expanded && hasFields && (
//         <div className="ml-4">
//           {field.fields.map((subField, index) => (
//             <SchemaField key={`${subField.name}-${index}`} field={subField} depth={depth + 1} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const SchemaViewer = ({ schema }: { schema: GraphQLSchema | undefined }) => {
//   if (!schema || schema.size === 0) {
//     return <div className="text-gray-500">No schema available</div>;
//   }

//   return (
//     <div className="space-y-2">
//       {Array.from(schema.entries()).map(([key, field]) => (
//         <div key={key} className="border-b pb-2 last:border-b-0">
//           <div className="mb-1 text-sm font-semibold">{key}</div>
//           <SchemaField field={field} />
//         </div>
//       ))}
//     </div>
//   );
// };

export const DeenruvDeveloperIndicator = () => {
  const { graphQLSchema } = useServer(({ graphQLSchema }) => ({ graphQLSchema }));
  const { plugins, viewMarkers, setViewMarkers } = usePluginStore();
  const [showSchema, setShowSchema] = useState(false);

  return (
    <div className="fixed right-4 bottom-4">
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            className="flex size-10 items-center justify-center rounded-full border-dashed border-primary text-xs"
          >
            DDP
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-full max-w-5xl place-self-end">
          <div className="w-full">
            <DrawerHeader>
              <DrawerTitle>DDP - Deenruv Developer Panel</DrawerTitle>
            </DrawerHeader>
            <div className="p-4 pb-0">
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="space-y-4 md:w-1/4">
                  <div className="rounded-md border p-3">
                    <h3 className="mb-2 text-sm font-medium">Controls</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Switch id="markers" checked={viewMarkers} onCheckedChange={setViewMarkers} />
                        <label
                          htmlFor="markers"
                          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Show markers (ctrl + x)
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="schema" checked={showSchema} onCheckedChange={setShowSchema} />
                        <label
                          htmlFor="schema"
                          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Show GraphQL Schema
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <div className="size-3 rounded-full bg-green-500"></div>
                      <h3 className="text-sm font-medium">Plugins</h3>
                    </div>
                    <ScrollArea className="mt-2 h-[250px]">
                      <div className="grid gap-2 pr-2">
                        {plugins.map((plugin) => (
                          <div
                            key={plugin.name}
                            className="dark:hover:bg-gray-750 flex items-center rounded-md border border-gray-200 bg-gray-50 p-2 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800"
                          >
                            <div className="flex-1">
                              <div className="text-sm font-medium">{plugin.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">v{plugin.version}</div>
                            </div>
                            <div className="mr-1 size-2 rounded-full bg-green-500" title="Active"></div>
                          </div>
                        ))}
                        {plugins.length === 0 && (
                          <div className="py-4 text-center text-sm text-gray-500 italic dark:text-gray-400">
                            No plugins installed
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>

                <div className="md:w-3/4">
                  {/* {showSchema && graphQLSchema ? (
                    <div className="h-full rounded-md border p-3">
                      <h3 className="mb-2 text-sm font-medium">GraphQL Schema</h3>
                      <ScrollArea className="h-[350px]">
                        <div className="rounded bg-gray-50 p-2 text-xs dark:bg-gray-800">
                          <SchemaViewer schema={graphQLSchema} />
                        </div>
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-md border p-3">
                      <p className="text-center text-gray-500">
                        {showSchema ? 'No schema available' : "Enable 'Show GraphQL Schema' to view the schema here"}
                      </p>
                    </div>
                  )} */}
                </div>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
