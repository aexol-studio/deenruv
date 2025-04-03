import { useState, useEffect, useCallback } from 'react';

export const useCustomSearchParams = ({
    fakeURLParams,
}: {
    fakeURLParams?: boolean;
}): [
    URLSearchParams,
    (newParams: URLSearchParams | Record<string, string>, options?: { replace?: boolean }) => void,
] => {
    const [searchParams, setSearchParamsState] = useState(() =>
        fakeURLParams ? new URLSearchParams() : new URLSearchParams(window.location.search),
    );

    useEffect(() => {
        if (fakeURLParams) return;

        const handlePopState = () => {
            setSearchParamsState(new URLSearchParams(window.location.search));
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [fakeURLParams]);

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

            if (!fakeURLParams) {
                const newUrl = `${window.location.pathname}?${updatedSearchParams.toString()}`;
                if (options?.replace) {
                    window.history.replaceState(null, '', newUrl);
                } else {
                    window.history.pushState(null, '', newUrl);
                }
            }

            setSearchParamsState(updatedSearchParams);
        },
        [fakeURLParams],
    );

    return [searchParams, setSearchParams];
};
