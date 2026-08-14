type DetailListFilter = Record<string, unknown>;

export type DetailListSearchTransport = "filter" | "searchTerm";

export const normalizeSearchTerm = (
  search: string | null,
): string | undefined => {
  const normalized = search?.trim().replace(/\s+/g, " ");
  return normalized || undefined;
};

const tokenizeSearch = (search: string | null): string[] =>
  search?.trim().split(/\s+/).filter(Boolean) ?? [];

export const buildSearchFilter = (
  search: string | null,
  searchFields: string[] | undefined,
  existingFilter?: DetailListFilter,
): DetailListFilter => {
  const tokens = tokenizeSearch(search);

  if (!tokens.length || !searchFields?.length) {
    return existingFilter ?? {};
  }

  const existingAnd = Array.isArray(existingFilter?._and)
    ? existingFilter._and
    : [];

  return {
    ...existingFilter,
    _and: [
      ...existingAnd,
      ...tokens.map((token) => ({
        _or: searchFields.map((field) => ({
          [field]: { contains: token },
        })),
      })),
    ],
  };
};

export const buildDetailListSearchParams = (
  search: string | null,
  searchFields: string[] | undefined,
  existingFilter: DetailListFilter | undefined,
  transport: DetailListSearchTransport = "filter",
): { filter: DetailListFilter; searchTerm?: string } => {
  if (transport === "searchTerm") {
    return {
      filter: existingFilter ?? {},
      searchTerm: normalizeSearchTerm(search),
    };
  }

  return {
    filter: buildSearchFilter(search, searchFields, existingFilter),
  };
};
