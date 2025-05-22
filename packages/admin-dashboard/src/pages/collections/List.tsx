import { ArrowDownSquareIcon, ArrowUpSquareIcon, Folder, FolderOpen, XSquareIcon } from 'lucide-react';
import { Permission, SortOrder } from '@deenruv/admin-types';
import { CollectionProductVariantsDrawer } from './_components/CollectionProductVariantsDrawer.js';
import {
  DrawerTrigger,
  Routes,
  apiClient,
  ListBadge,
  DetailList,
  PaginationInput,
  deepMerge,
  EntityChannelManagementRowAction,
  ListLocations,
  EntityChannelManagementBulkAction,
  EntityFacetManagementBulkAction,
} from '@deenruv/react-ui-devkit';
import { ArrowRight } from 'lucide-react';

const tableId = 'collections-list-view';
const { selector } = ListLocations[tableId];

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const response = await apiClient('query')({
    ['collections']: [
      {
        options: {
          take: perPage,
          skip: (page - 1) * perPage,
          filterOperator: filterOperator,
          sort: sort ? { [sort.key]: sort.sortDir } : { createdAt: SortOrder.DESC },
          ...(filter && { filter }),
          topLevelOnly: true,
        },
      },
      { items: deepMerge(selector, additionalSelector ?? {}), totalItems: true },
    ],
  });
  return response['collections'];
};

export const CollectionsListPage = () => {
  return (
    <DetailList
      filterFields={[]}
      detailLinkColumn="id"
      searchFields={['name', 'code']}
      hideColumns={['translations', 'breadcrumbs', 'description']}
      getSubRows={(row) => row.children}
      additionalColumns={[
        {
          accessorKey: 'children',
          header: 'Children',
          cell: ({ row, getValue }) => {
            const value = getValue<Array<{ id: number }>>();
            const isExpanded = row.getIsExpanded();
            return (
              <div style={{ paddingLeft: `${row.depth * 2}rem` }}>
                <ListBadge
                  {...{
                    paddingLeft: `${row.depth * 2}rem`,
                    onClick: row.getToggleExpandedHandler(),
                    style: { cursor: 'pointer' },
                  }}
                >
                  {isExpanded ? (
                    <FolderOpen size={16} />
                  ) : value?.length > 0 ? (
                    <Folder size={16} />
                  ) : (
                    <XSquareIcon size={16} />
                  )}
                </ListBadge>
              </div>
            );
          },
        },
        {
          accessorKey: 'productVariants',
          header: 'Products',
          cell: ({ row, getValue }) => {
            const value = getValue<{ totalItems: number }>();
            return value?.totalItems > 0 ? (
              <CollectionProductVariantsDrawer
                collectionId={row.original.id}
                collectionName={row.original.name}
                count={row.original.productVariants.totalItems}
              >
                <DrawerTrigger className="w-full">
                  <ListBadge>
                    {value.totalItems}
                    <ArrowRight className="pl-1" size={16} />
                  </ListBadge>
                </DrawerTrigger>
              </CollectionProductVariantsDrawer>
            ) : (
              <ListBadge>{value?.totalItems || 0}</ListBadge>
            );
          },
        },
      ]}
      additionalBulkActions={[
        ...EntityChannelManagementBulkAction(tableId),
        EntityFacetManagementBulkAction(tableId),
        {
          icon: <FolderOpen size={16} />,
          label: 'Przenieś zaznaczone kolekcje',
          onClick: async ({ table, data, refetch }) => {
            const selectedRows = table.getSelectedRowModel().flatRows.map((row) => row);
            if (selectedRows.length === 0) {
              return { error: 'Nie zaznaczono żadnej kolekcji' };
            }
            try {
              // const result = await createDialogFromComponent(MoveCollectionsToCollections, selectedRows);
            } catch (e) {
              console.log(e);
            }
            return { success: '' };
          },
        },
      ]}
      additionalRowActions={[
        {
          icon: <ArrowUpSquareIcon size={16} />,
          label: 'Przenieś kolekcje',
          onClick: async ({ row, refetch }) => {
            try {
              await apiClient('mutation')({
                moveCollection: [
                  {
                    input: {
                      collectionId: row.original.id,
                      index: row.original.position - 1,
                      parentId: row.original.parentId,
                    },
                  },
                  { id: true },
                ],
              });
              refetch();
              return { success: '' };
            } catch {
              return { error: '' };
            }
          },
        },
        {
          icon: <ArrowDownSquareIcon size={16} />,
          label: 'Przenieś kolekcje',
          onClick: async ({ row, refetch }) => {
            try {
              await apiClient('mutation')({
                moveCollection: [
                  {
                    input: {
                      collectionId: row.original.id,
                      index: row.original.position + 1,
                      parentId: row.original.parentId,
                    },
                  },
                  { id: true },
                ],
              });
              refetch();
              return { success: '' };
            } catch {
              return { error: '' };
            }
          },
        },
        {
          icon: <FolderOpen size={16} />,
          label: 'Przenieś kolekcje',
          onClick: async ({ row, refetch }) => {
            try {
              // const result = await createDialogFromComponent(MoveCollectionsToCollections, [row]);
            } catch (e) {
              console.log(e);
            }
            return { success: '' };
          },
        },
      ]}
      entityName={'Collection'}
      route={Routes['collections']}
      tableId={tableId}
      fetch={fetch}
      onRemove={async () => {
        return true;
      }}
      createPermissions={[Permission.CreateCollection]}
      deletePermissions={[Permission.DeleteCollection]}
    />
  );
};
