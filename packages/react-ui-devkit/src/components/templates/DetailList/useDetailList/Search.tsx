import { Input } from '@/components';
import { useDebounce } from '@/hooks';
import { PromisePaginated } from '@/types/models';
import React from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon } from 'lucide-react';

export const Search = ({
    initialSearchQuery,
    setSearchQuery,
    searchFields,
    entityName,
}: {
    initialSearchQuery?: string | null;
    setSearchQuery: (query: string | null) => void;
    searchFields?: (keyof Awaited<ReturnType<PromisePaginated>>['items'][number])[];
    entityName: string;
}) => {
    const { t } = useTranslation('table');
    const [searchQuery, setSearchQueryState] = useState(initialSearchQuery ?? '');
    const debouncedSearch = useDebounce(searchQuery, 500);
    useEffect(() => {
        if (debouncedSearch.length > 0) setSearchQuery(debouncedSearch);
        else setSearchQuery(null);
    }, [debouncedSearch]);

    const placeholder = t('placeholders.search', {
        entity: entityName,
        fields: searchFields?.join(', '),
    }).toLowerCase();
    const onlyFirstLetterCapitalized = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

    return (
        <div className="w-[20rem] flex items-center justify-center gap-3">
            <Input
                className="w-full h-8 pl-4"
                placeholder={onlyFirstLetterCapitalized(placeholder)}
                value={searchQuery}
                onChange={e => setSearchQueryState(e.target.value)}
                startAdornment={<SearchIcon size={20} />}
                adornmentPlain
            />
        </div>
    );
};
