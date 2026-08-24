import { AssetType, assetsSelector } from "@/selectors/AssetsSelector.js";
import { apiClient } from "@/zeus_client/deenruvAPICall.js";
import { LogicalOperator, SortOrder } from "@deenruv/admin-types";
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDebounce } from "use-debounce";
import {
  clampAssetPage,
  RequestGenerationGate,
} from "@/universal_components/AssetsModalInput.helpers.js";

export type ASSETS_PER_PAGE = 12 | 24 | 48 | 96;
export const ASSETS_ITEMS_PER_PAGE: ASSETS_PER_PAGE[] = [
  12, 24, 48, 96,
] as const;

type Config = { skip?: boolean };

export const useAssets = (config?: Config) => {
  const requestGate = useRef(new RequestGenerationGate());
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [searchTags, setSearchTagsState] = useState<string[]>([]);
  const [searchTerm, setSearchTermState] = useState<string>("");
  const [page, setPageState] = useState(1);
  const [perPage, setPerPageState] = useState<ASSETS_PER_PAGE>(
    ASSETS_ITEMS_PER_PAGE[0],
  );
  const [skip, setSkipState] = useState(config?.skip ? config.skip : false);

  const [debouncedSearch] = useDebounce(searchTerm, 500);

  const invalidateListWork = useCallback(() => {
    requestGate.current.invalidate();
    setIsPending(false);
  }, []);
  const setPage = useCallback<Dispatch<SetStateAction<number>>>(
    (value) => {
      invalidateListWork();
      setPageState(value);
    },
    [invalidateListWork],
  );
  const setPerPage = useCallback<Dispatch<SetStateAction<ASSETS_PER_PAGE>>>(
    (value) => {
      invalidateListWork();
      setPerPageState(value);
      setPageState(1);
    },
    [invalidateListWork],
  );
  const setSearchTags = useCallback<Dispatch<SetStateAction<string[]>>>(
    (value) => {
      invalidateListWork();
      setSearchTagsState(value);
      setPageState(1);
    },
    [invalidateListWork],
  );
  const setSearchTerm = useCallback<Dispatch<SetStateAction<string>>>(
    (value) => {
      invalidateListWork();
      setSearchTermState(value);
    },
    [invalidateListWork],
  );
  const setSkip = useCallback<Dispatch<SetStateAction<boolean>>>(
    (value) => {
      invalidateListWork();
      setSkipState(value);
    },
    [invalidateListWork],
  );

  const refetchData = useCallback(async () => {
    const requestGeneration = requestGate.current.begin();
    setIsPending(true);
    try {
      const { assets } = await apiClient("query")({
        assets: [
          {
            options: {
              take: perPage,
              skip: (page - 1) * perPage,
              sort: { createdAt: SortOrder.DESC },
              ...(debouncedSearch !== "" && {
                filter: { name: { contains: debouncedSearch } },
              }),
              ...(searchTags.length && {
                tags: searchTags,
                tagsOperator: LogicalOperator.AND,
              }),
            },
          },
          { totalItems: true, items: assetsSelector },
        ],
      });
      if (!requestGate.current.isCurrent(requestGeneration)) return;
      const nextTotalPages = Math.ceil(assets.totalItems / perPage);
      const nextPage = clampAssetPage(page, nextTotalPages);
      setAssets(nextPage === page ? assets.items : []);
      setTotalItems(assets.totalItems);
      if (nextPage !== page) setPageState(nextPage);
      setError(undefined);
    } catch (error) {
      if (!requestGate.current.isCurrent(requestGeneration)) return;
      setAssets([]);
      setTotalItems(0);
      setError(`${error} Could not Fetch Data `);
    } finally {
      if (requestGate.current.isCurrent(requestGeneration)) {
        setIsPending(false);
      }
    }
  }, [debouncedSearch, page, perPage, searchTags]);

  const totalPages = useMemo(
    () => Math.ceil(totalItems / perPage),
    [totalItems, perPage],
  );

  useEffect(() => {
    setPageState(1);
  }, [debouncedSearch]);

  useEffect(() => {
    if (skip) {
      requestGate.current.invalidate();
      setIsPending(false);
      return;
    }
    void refetchData();
  }, [refetchData, skip]);

  useEffect(
    () => () => {
      requestGate.current.invalidate();
    },
    [],
  );

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
