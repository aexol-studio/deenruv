import { useState, useEffect, useCallback } from 'react';

export const useCustomSearchParams = (): [
    URLSearchParams,
    (newParams: URLSearchParams | Record<string, string>, options?: { replace?: boolean }) => void,
] => {
    const [searchParams, setSearchParamsState] = useState(() => new URLSearchParams(window.location.search));

    useEffect(() => {
        const handlePopState = () => {
            setSearchParamsState(new URLSearchParams(window.location.search));
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    const setSearchParams = useCallback(
        (newParams: URLSearchParams | Record<string, string>, options?: { replace?: boolean }) => {
            let updatedSearchParams: URLSearchParams;

            if (newParams instanceof URLSearchParams) {
                updatedSearchParams = new URLSearchParams(newParams);
            } else {
                updatedSearchParams = new URLSearchParams();
                Object.entries(newParams).forEach(([key, value]) => {
                    updatedSearchParams.set(key, value);
                });
            }

            const newUrl = `${window.location.pathname}?${updatedSearchParams.toString()}`;
            if (options?.replace) {
                window.history.replaceState(null, '', newUrl);
            } else {
                window.history.pushState(null, '', newUrl);
            }
            setSearchParamsState(updatedSearchParams);
        },
        [],
    );

    return [searchParams, setSearchParams];
};
