const SETTINGS_LOCAL_STORAGE_KEY = 'settings';

export type PaginatedCacheables =
    | 'administrators'
    | 'assets'
    | 'channels'
    | 'collections'
    | 'countries-list'
    | 'facets'
    | 'modal-assets-list'
    | 'modal-product-variants-list'
    | 'modal-products-list'
    | 'orders'
    | 'paymentMethods'
    | 'products'
    | 'roles'
    | 'sellers'
    | 'shippingMethods'
    | 'stockLocations'
    | 'taxCategories'
    | 'taxRates'
    | 'zones';

export type DetailCacheables = 'productDetail' | 'orderDetail' | 'collectionDetail' | 'facetDetail';

export const clearAllCache = () => {
    const importantKeys = [SETTINGS_LOCAL_STORAGE_KEY];
    Object.keys(window.localStorage).forEach(key => {
        if (!importantKeys.includes(key)) {
            window.localStorage.removeItem(key);
        }
    });
    window.location.reload();
};

type CacheKey = `${PaginatedCacheables | DetailCacheables}`;

// const CLEAR_ALL_CACHE_FREQUENCY = 60000;

export const cache = <T>(cacheKey: CacheKey) => {
    // setTimeout(() => clearAllCache(), CLEAR_ALL_CACHE_FREQUENCY);

    const getCacheable = (): Record<string, T> => {
        const v = window.localStorage.getItem(cacheKey);
        if (v) return JSON.parse(v);
        return {};
    };

    const set = (key: string, value: T) => {
        // temporarily disabled cache usage
        return;

        const currentCacheable = getCacheable();
        currentCacheable[key] = value;
        window.localStorage.setItem(cacheKey, JSON.stringify(currentCacheable));
    };

    const get = (key: string) => {
        const v = getCacheable()[key];
        if (!v) return;
        return v;
    };

    const resetCache = () => {
        window.localStorage.removeItem(cacheKey);
    };

    const resetKey = (key: string) => {
        const currentCacheable = getCacheable();
        delete currentCacheable[key];
        window.localStorage.setItem(cacheKey, JSON.stringify(currentCacheable));
    };

    return {
        get,
        set,
        resetCache,
        resetKey,
    };
};

export const resetCache = (cacheKey: PaginatedCacheables | DetailCacheables) => {
    window.localStorage.removeItem(cacheKey);
};
