import { Input } from '@/components/atoms';
import { Search } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';

interface SearchInputProps {
    searchString: string;
    setSearchString: Dispatch<SetStateAction<string>>;
    placeholder: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ placeholder, searchString, setSearchString }) => {
    return (
        <div className="flex gap-3 items-center max-w-[360px] mb-3">
            <Search />
            <Input
                value={searchString}
                onChange={e => setSearchString(e.target.value)}
                placeholder={placeholder}
            />
        </div>
    );
};
