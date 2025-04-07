'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import {
  Button,
  ImageWithPreview,
  Input,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  apiClient,
  cn,
} from '@deenruv/react-ui-devkit';

import { useTranslation } from 'react-i18next';
import {
  type ProductVariantType,
  type SearchProductVariantType,
  productVariantSelector,
  searchProductVariantSelector,
} from '@/graphql/draft_order';
import { priceFormatter } from '@/utils';
import { CircleX, Loader2, Search, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onSelectItem: (selected: ProductVariantType) => void;
}

export const ProductVariantSearch: React.FC<Props> = ({ onSelectItem }) => {
  const { t } = useTranslation('orders');
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState('');
  const [debouncedValue] = useDebounce(value, 500);
  const [results, setResults] = useState<SearchProductVariantType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSelecting, setIsSelecting] = useState<string | null>(null);

  useEffect(() => {
    const search = async () => {
      setIsLoading(true);
      try {
        const data = await apiClient('query')({
          search: [
            { input: { take: 10, groupByProduct: false, term: debouncedValue } },
            { items: searchProductVariantSelector },
          ],
        });
        setResults(data.search.items);
      } catch (error) {
        console.error('Search error:', error);
        toast.error(t('toasts.searchError') || 'Error searching products');
      } finally {
        setIsLoading(false);
      }
    };
    search();
  }, [debouncedValue, t]);

  const handleSelectItem = async (productVariantId: string) => {
    setIsSelecting(productVariantId);
    try {
      const { productVariant } = await apiClient('query')({
        productVariant: [{ id: productVariantId }, productVariantSelector],
      });
      if (productVariant) {
        onSelectItem(productVariant);
        ref.current?.blur();
        setValue('');
      } else {
        toast.error(t('toasts.productVariantLoadingError'));
      }
    } catch (error) {
      console.error('Product variant loading error:', error);
      toast.error(t('toasts.productVariantLoadingError'));
    } finally {
      setIsSelecting(null);
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="text-muted-foreground size-4" />
        </div>
        <Input
          ref={ref}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder={t('searchProduct.placeholder')}
          value={value}
          className={cn('min-w-full max-w-full pl-10 pr-10 transition-all', focused && 'ring-primary/20 ring-2')}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-10 flex items-center pr-3">
            <Loader2 className="text-muted-foreground size-4 animate-spin" />
          </div>
        )}
        {value !== '' && (
          <button
            className="text-muted-foreground hover:text-foreground absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => {
              setValue('');
              ref.current?.focus();
            }}
          >
            <CircleX className="size-4" />
          </button>
        )}
      </div>

      {focused && (
        <div
          onMouseDown={(e) => e.preventDefault()}
          className="border-border bg-card absolute left-0 top-[calc(100%+4px)] z-50 flex h-96 w-full flex-col items-center justify-center rounded-md border shadow-lg"
        >
          <ScrollArea className="h-96 w-full overflow-auto rounded-md">
            {results && results.length > 0 ? (
              <Table>
                <TableHeader className="bg-muted/50 sticky top-0 backdrop-blur-sm">
                  <TableRow noHover className="hover:bg-transparent">
                    <TableHead className="w-16 text-xs font-semibold">{t('searchProduct.id')}</TableHead>
                    <TableHead className="w-20 text-xs font-semibold">{t('searchProduct.image')}</TableHead>
                    <TableHead className="text-xs font-semibold">{t('searchProduct.name')}</TableHead>
                    <TableHead className="w-20 text-xs font-semibold">{t('searchProduct.price')}</TableHead>
                    <TableHead className="w-42 text-xs font-semibold">{t('searchProduct.action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r) => (
                    <TableRow
                      key={r.productVariantId}
                      className="hover:bg-muted/30 cursor-pointer"
                      onClick={() => handleSelectItem(r.productVariantId)}
                    >
                      <TableCell className="text-muted-foreground font-mono text-xs">{r.productVariantId}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          <ImageWithPreview
                            src={r.productAsset?.preview || '/placeholder.svg'}
                            alt={r.productVariantName}
                            imageClassName="h-12 w-12 rounded-md object-cover border border-border"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="line-clamp-1 text-sm font-medium">{r.productVariantName}</p>
                          <p className="text-muted-foreground line-clamp-1 text-xs">{r.productName}</p>
                          <p className="text-muted-foreground font-mono text-xs">{r.sku}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {priceFormatter(
                          r.priceWithTax.__typename === 'SinglePrice'
                            ? r.priceWithTax.value
                            : { from: r.priceWithTax.min, to: r.priceWithTax.max },
                          r.currencyCode,
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="hover:bg-primary hover:text-primary-foreground gap-2 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectItem(r.productVariantId);
                          }}
                          disabled={isSelecting === r.productVariantId}
                        >
                          {isSelecting === r.productVariantId ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <ShoppingCart className="size-3" />
                          )}
                          <span>{t('create.addProduct')}</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex h-96 w-full flex-col items-center justify-center p-8 text-center">
                {debouncedValue.trim() ? (
                  <div className="flex size-full flex-col items-center justify-center">
                    <div className="bg-muted mb-4 rounded-full p-3">
                      <Search className="text-muted-foreground size-5" />
                    </div>
                    <p className="text-foreground text-sm font-medium">{t('create.noItemsFound')}</p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {t('create.tryDifferentSearch') || 'Try a different search term'}
                    </p>
                  </div>
                ) : (
                  <div className="flex size-full flex-col items-center justify-center">
                    <div className="bg-muted mb-4 rounded-full p-3">
                      <Search className="text-muted-foreground size-5" />
                    </div>
                    <p className="text-foreground text-sm font-medium">
                      {t('create.startTyping') || 'Start typing to search products'}
                    </p>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {t('create.searchHint') || 'Search by name, SKU or product ID'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
