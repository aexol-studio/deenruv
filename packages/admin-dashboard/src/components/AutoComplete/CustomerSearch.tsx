'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  apiClient,
  cn,
  ScrollArea,
  Badge,
} from '@deenruv/react-ui-devkit';

import { useTranslation } from 'react-i18next';
import { LogicalOperator } from '@deenruv/admin-types';
import { type SearchCustomerType, searchCustomerSelector } from '@/graphql/draft_order';
import { Search, User, Mail, Phone, UserCheck, AlertCircle, Loader2 } from 'lucide-react';

interface Props {
  onSelect: (selected: SearchCustomerType) => void;
  selectedCustomer?: SearchCustomerType;
}

export const CustomerSearch: React.FC<Props> = ({ onSelect, selectedCustomer }) => {
  const { t } = useTranslation('orders');
  const ref = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [debouncedValue] = useDebounce(value, 500);
  const [results, setResults] = useState<SearchCustomerType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const search = async () => {
      setIsSearching(true);
      setHasSearched(true);

      try {
        const terms = debouncedValue.split(' ').filter(Boolean);
        const filter =
          terms.length > 1
            ? {
                OR: [
                  { firstName: { contains: terms[0] } },
                  { lastName: { contains: terms[1] } },
                  { emailAddress: { contains: debouncedValue } },
                  { id: { eq: debouncedValue } },
                ],
              }
            : {
                firstName: { contains: debouncedValue },
                lastName: { contains: debouncedValue },
                emailAddress: { contains: debouncedValue },
                id: { eq: debouncedValue },
              };

        const data = await apiClient('query')({
          customers: [
            {
              options: {
                take: 10,
                ...(debouncedValue && {
                  filter,
                  filterOperator: LogicalOperator.OR,
                }),
              },
            },
            { items: searchCustomerSelector },
          ],
        });
        setResults(data.customers.items);
      } catch (error) {
        console.error('Error searching customers:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    search();
  }, [debouncedValue]);

  return (
    <div className="flex h-full flex-col gap-4 py-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="customer-search" className="text-sm font-medium">
          {t('create.selectCustomer.inputLabel', 'Search for customers')}
        </Label>
        <div className="relative">
          <Input
            id="customer-search"
            placeholder={t('create.selectCustomer.placeholder', 'Search by name, email, or ID...')}
            ref={ref}
            value={value}
            className="pl-9"
            onChange={(e) => setValue(e.currentTarget.value)}
          />
          <div className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2">
            {isSearching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          </div>
        </div>
      </div>

      {isSearching ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="size-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500"></div>
          <p className="text-muted-foreground mt-4 text-sm">
            {t('create.selectCustomer.searching', 'Searching for customers...')}
          </p>
        </div>
      ) : results.length > 0 ? (
        <div className="rounded-md border">
          <ScrollArea className="h-[calc(80vh-330px)]">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0">
                <TableRow noHover className="hover:bg-transparent">
                  <TableHead className="py-3 font-semibold">{t('create.selectCustomer.name', 'Name')}</TableHead>
                  <TableHead className="py-3 font-semibold">{t('create.selectCustomer.email', 'Email')}</TableHead>
                  <TableHead className="py-3 font-semibold">
                    {t('create.selectCustomer.phoneNumber', 'Phone')}
                  </TableHead>
                  <TableHead className="py-3 font-semibold">{t('create.selectCustomer.id', 'ID')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((customer) => (
                  <TableRow
                    key={customer.id}
                    className={cn(
                      'cursor-pointer transition-colors',
                      customer.id === selectedCustomer?.id
                        ? 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/30'
                        : 'hover:bg-muted/50',
                    )}
                    onClick={() => onSelect(customer)}
                  >
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        {customer.id === selectedCustomer?.id ? (
                          <UserCheck className="size-4 text-indigo-500" />
                        ) : (
                          <User className="text-muted-foreground size-4" />
                        )}
                        <div className="font-medium">
                          {customer.firstName} {customer.lastName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="text-muted-foreground size-4" />
                        <span>{customer.emailAddress}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-3">
                      {customer.phoneNumber ? (
                        <div className="flex items-center gap-2">
                          <Phone className="text-muted-foreground size-4" />
                          <span>{customer.phoneNumber}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-3 font-mono text-xs">{customer.id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      ) : hasSearched ? (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
            <AlertCircle className="size-6 text-amber-500" />
          </div>
          <div>
            <p className="font-medium">{t('create.selectCustomer.noResults', 'No customers found')}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('create.selectCustomer.tryDifferent', 'Try a different search term or create a new customer')}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
          <div className="rounded-full bg-indigo-100 p-3 dark:bg-indigo-900/30">
            <Search className="size-6 text-indigo-500" />
          </div>
          <div>
            <p className="font-medium">{t('create.selectCustomer.searchPrompt', 'Search for customers')}</p>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('create.selectCustomer.searchHint', 'Enter a name, email, or ID to find customers')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
