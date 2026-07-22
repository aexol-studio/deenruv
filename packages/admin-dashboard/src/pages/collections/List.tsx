import { ArrowDownSquareIcon, ArrowRight, ArrowUpSquareIcon, CornerDownRight, Folder, FolderOpen } from 'lucide-react';
import { Permission, SortOrder } from '@deenruv/admin-types';
import { CollectionProductVariantsDrawer } from './_components/CollectionProductVariantsDrawer.js';
import {
  Button,
  DrawerTrigger,
  Routes,
  apiClient,
  ListBadge,
  DetailList,
  PaginationInput,
  deepMerge,
  ListLocations,
  EntityChannelManagementBulkAction,
  EntityFacetManagementBulkAction,
  useDetailList,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { useNavigate } from 'react-router';

const tableId = 'collections-list-view';
const { selector } = ListLocations[tableId];
const COLLECTION_TREE_FETCH_LIMIT = 1000;

type CollectionTreeItem = {
  id: string;
  name: string;
  parentId?: string | null;
  children?: CollectionTreeItem[];
  productVariants: { totalItems: number };
  position: number;
  [key: string]: unknown;
};

const hasActiveFilter = (filter: PaginationInput['filter']): boolean => {
  if (!filter) {
    return false;
  }

  return Object.values(filter).some((value) => {
    if (value === null || value === undefined || value === '') {
      return false;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    if (typeof value === 'object') {
      return Object.values(value as Record<string, unknown>).some(
        (operatorValue) => operatorValue !== null && operatorValue !== undefined && operatorValue !== '',
      );
    }

    return true;
  });
};

const buildCollectionTree = (items: CollectionTreeItem[]): CollectionTreeItem[] => {
  const itemsById = new Map<string, CollectionTreeItem>();

  items.forEach((item) => {
    itemsById.set(item.id, { ...item, children: [] });
  });

  const roots: CollectionTreeItem[] = [];
  itemsById.forEach((item) => {
    const parent = item.parentId ? itemsById.get(item.parentId) : undefined;

    if (parent && parent.id !== item.id) {
      parent.children?.push(item);
    } else {
      roots.push(item);
    }
  });

  return roots;
};

const withoutNestedChildren = (items: CollectionTreeItem[]): CollectionTreeItem[] => {
  return items.map((item) => ({ ...item, children: [] }));
};

const CollectionNameHeader = () => {
  const { sortButton } = useDetailList();
  const { t } = useTranslation('table');

  return sortButton('name', t('columns.name'));
};

const fetch = async <T,>({ page, perPage, filter, filterOperator, sort }: PaginationInput, additionalSelector?: T) => {
  const isFiltered = hasActiveFilter(filter);
  const response = await apiClient('query')({
    ['collections']: [
      {
        options: {
          take: isFiltered ? perPage : COLLECTION_TREE_FETCH_LIMIT,
          skip: isFiltered ? (page - 1) * perPage : 0,
          filterOperator: filterOperator,
          sort: sort ? { [sort.key]: sort.sortDir } : { position: SortOrder.ASC },
          ...(filter && { filter }),
          ...(!isFiltered && { topLevelOnly: false }),
        },
      },
      { items: deepMerge(selector, additionalSelector ?? {}), totalItems: true },
    ],
  });
  const collections = response['collections'];
  const items = collections.items as CollectionTreeItem[];

  if (isFiltered) {
    return {
      ...collections,
      items: withoutNestedChildren(items),
    };
  }

  const rootCollections = buildCollectionTree(items);
  const pageStart = (page - 1) * perPage;

  return {
    ...collections,
    items: rootCollections.slice(pageStart, pageStart + perPage),
    totalItems: rootCollections.length,
  };
};

const onRemove = async (items: { id: string }[]): Promise<boolean> => {
  const ids = items.map((item) => item.id);
  const { deleteCollections } = await apiClient('mutation')({
    deleteCollections: [{ ids }, { message: true, result: true }],
  });
  return !!deleteCollections.length;
};

export const CollectionsListPage = () => {
  const navigate = useNavigate();

  return (
    <DetailList
      filterFields={[]}
      detailLinkColumn="id"
      searchFields={['name', 'code']}
      hideColumns={['translations', 'breadcrumbs', 'description', 'children']}
      getSubRows={(row) => row.children}
      additionalColumns={[
        {
          accessorKey: 'name',
          header: () => <CollectionNameHeader />,
          cell: ({ row }) => {
            const isExpanded = row.getIsExpanded();
            const canExpand = row.getCanExpand();

            return (
              <div className="flex items-center gap-2" style={{ paddingLeft: `${row.depth * 1.5}rem` }}>
                {canExpand ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-stone-700 hover:text-stone-950"
                    onClick={row.getToggleExpandedHandler()}
                    aria-expanded={isExpanded}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${row.original.name}`}
                  >
                    {isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />}
                  </Button>
                ) : (
                  <span className="flex size-7 shrink-0 items-center justify-center text-stone-400" aria-hidden="true">
                    {row.depth > 0 && <CornerDownRight size={14} />}
                  </span>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="h-7 min-w-0 justify-start gap-1 px-2 text-left"
                  title={row.original.name}
                  onClick={() => {
                    navigate(Routes.collections.to(row.original.id), {
                      viewTransition: true,
                    });
                  }}
                >
                  <span className="truncate">{row.original.name}</span>
                  <ArrowRight className="shrink-0 pl-1" size={16} />
                </Button>
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
          onClick: async ({ table }) => {
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
          onClick: async () => {
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
      onRemove={onRemove}
      createPermissions={[Permission.CreateCollection]}
      deletePermissions={[Permission.DeleteCollection]}
    />
  );
};
