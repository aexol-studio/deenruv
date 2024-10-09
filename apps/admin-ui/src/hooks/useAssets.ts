import { AssetType, assetsSelector } from '@/graphql/base';
import { apiCall } from '@/graphql/client';
import { LogicalOperator, SortOrder } from '@/zeus';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

export type ASSETS_PER_PAGE = 12 | 24 | 48 | 96;
export const ASSETS_ITEMS_PER_PAGE: ASSETS_PER_PAGE[] = [12, 24, 48, 96] as const;

type Config = { skip?: boolean };

export const useAssets = (config?: Config) => {
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState<ASSETS_PER_PAGE>(ASSETS_ITEMS_PER_PAGE[0]);
  const [skip, setSkip] = useState(config?.skip ? config.skip : false);

  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const refetchData = useCallback(async () => {
    setIsPending(true);
    try {
      const { assets } = await apiCall()('query')({
        assets: [
          {
            options: {
              take: perPage,
              skip: (page - 1) * perPage,
              sort: { createdAt: SortOrder.DESC },
              ...(debouncedSearch !== '' && { filter: { name: { contains: debouncedSearch } } }),
              ...(searchTags.length && {
                tags: searchTags,
                tagsOperator: LogicalOperator.AND,
              }),
            },
          },
          { totalItems: true, items: assetsSelector },
        ],
      });
      setAssets(assets.items);
      setTotalItems(assets.totalItems);
      setError(undefined);
    } catch (error) {
      setAssets([]);
      setTotalItems(0);
      setError(`${error} Could not Fetch Data `);
    } finally {
      setIsPending(false);
    }
  }, [debouncedSearch, page, perPage, searchTags]);

  const totalPages = useMemo(() => Math.ceil(totalItems / perPage), [totalItems, perPage]);

  useEffect(() => {
    !skip && refetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, skip, searchTags, perPage, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [searchTags, perPage, debouncedSearch]);

  return {
    assets,
    isPending,
    error,
    totalItems,
    refetchData,
    page,
    perPage,
    setPage,
    setPerPage,
    searchTags,
    setSearchTags,
    searchTerm,
    setSearchTerm,
    totalPages,
    skip,
    setSkip,
  };
};
