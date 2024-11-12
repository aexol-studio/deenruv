import { PromisePaginated } from '@/lists/models';
import { Input, useDebounce } from '@deenruv/react-ui-devkit';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

  const placeholder = t('placeholders.search', { entity: entityName, fields: searchFields?.join(', ') }).toLowerCase();
  const onlyFirstLetterCapitalized = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="w-[20rem]">
      <Input
        className="w-full"
        placeholder={onlyFirstLetterCapitalized(placeholder)}
        value={searchQuery}
        onChange={(e) => setSearchQueryState(e.target.value)}
      />
    </div>
  );
};
