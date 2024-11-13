import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@deenruv/react-ui-devkit';
import { FilterIcon } from 'lucide-react';
import { useMemo } from 'react';
import { ListType, ListTypeKeys } from './types';
import { ModelTypes } from '@deenruv/admin-types';
import { FilterInputType } from '../_components/types';
import { useTranslation } from 'react-i18next';

type FilterKey<T extends keyof ListType> = keyof ModelTypes[(typeof ListTypeKeys)[T]];

export const FiltersButton = <T extends keyof ListType, K extends (string | number | symbol)[]>({
  type,
  filter,
  setFilterField,
  removeFilterField,
}: {
  type: T;
  filter: ModelTypes[(typeof ListTypeKeys)[T]] | undefined;
  setFilterField: any;
  removeFilterField: any;
}) => {
  const { t } = useTranslation('table');
  const labels = t('filterLabels', { returnObjects: true });

  const allFilterFields = useMemo(() => {
    return [
      {
        name: 'id',
        type: 'IDOperators',
        value: filter && filter['id'],
      },
      {
        name: 'createdAt',
        type: 'DateOperators',
        value: filter && filter['createdAt'],
      },
      {
        name: 'updatedAt',
        type: 'DateOperators',
        value: filter && filter['updatedAt'],
      },
      {
        name: 'name',
        type: 'StringOperators',
        value: filter && 'name' in filter && filter['name'],
      },
      {
        name: 'enabled',
        type: 'BooleanOperators',
        value: filter && 'enabled' in filter && filter['enabled'],
      },
    ] as {
      name: keyof ModelTypes[(typeof ListTypeKeys)[T]];
      type: keyof FilterInputType;
      value: ModelTypes[(typeof ListTypeKeys)[T]];
    }[];
  }, [filter, type]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <FilterIcon size={20} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-[400px] overflow-y-auto">
        {allFilterFields.map((i, index) => (
          <DropdownMenuCheckboxItem
            key={index}
            checked={filter && filter[i.name] ? true : false}
            onCheckedChange={(value) => {
              if (value) setFilterField(i.name, {});
              else removeFilterField(i.name);
            }}
          >
            {typeof i.name === 'string' ? labels[i.name as keyof typeof labels] : String(i.name)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
