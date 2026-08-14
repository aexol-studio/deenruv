type SearchFilter = Record<string, unknown>;

export function normalizeSearchTokens(searchTerm: string | null | undefined): string[] {
    return (searchTerm ?? '').trim().split(/\s+/).filter(Boolean);
}

export function buildTokenizedSearchFilter<T extends object = SearchFilter>(
    searchTerm: string | null | undefined,
    fields: readonly string[],
    baseFilter?: T | null,
): T {
    const tokenFilters = normalizeSearchTokens(searchTerm).map(token => ({
        _or: fields.map(field => ({ [field]: { contains: token } })),
    }));

    if (tokenFilters.length === 0) {
        return baseFilter ?? ({} as T);
    }

    const hasBaseFilter = baseFilter != null && Object.keys(baseFilter).length > 0;
    return {
        _and: [...(hasBaseFilter ? [baseFilter] : []), ...tokenFilters],
    } as T;
}

export function matchesTokenizedSearch<T>(
    item: T,
    searchTerm: string | null | undefined,
    fields: ReadonlyArray<keyof T>,
): boolean {
    const tokens = normalizeSearchTokens(searchTerm).map(token => token.toLocaleLowerCase());
    return tokens.every(token =>
        fields.some(field =>
            String(item[field] ?? '')
                .toLocaleLowerCase()
                .includes(token),
        ),
    );
}
