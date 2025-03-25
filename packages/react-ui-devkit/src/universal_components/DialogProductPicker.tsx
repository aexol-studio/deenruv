import React from 'react';
import { DialogProductPickerSelector } from '@/selectors/DialogProductPickerSelector.js';
import { useList } from '@/useList.js';
import { apiClient } from '@/zeus_client/deenruvAPICall.js';
import { useEffect, useState } from 'react';
import type { DialogProductPickerType } from '../selectors/DialogProductPickerSelector.js';
import { useDebounce } from '@/hooks/useDebounce.js';
import { Search, X } from 'lucide-react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    Input,
    RadioGroup,
    RadioGroupItem,
} from '@/components/index.js';
import { DialogTitle } from '@radix-ui/react-dialog';
import { priceFormatter } from '@/utils/price-formatter.js';

type DialogProductPickerProps = {
    mode: 'product' | 'variant';
} & (
    | {
          multiple: true;
          initialValue: string[];
          onSubmit: (value: DialogProductPickerType[]) => void;
          onCancel?: () => void;
      }
    | {
          multiple?: false;
          initialValue: string;
          onSubmit: (value: DialogProductPickerType) => void;
          onCancel?: () => void;
      }
);

/**
 * Dialog component for selecting products or product variants.
 *
 * @param {'product' | 'variant'} mode - Specifies whether the picker is for products or product variants.
 * @param {boolean} [multiple=false] - Determines if multiple selections are allowed. Defaults to false.
 * @param {string | string[]} initialValue - Initial selected value(s). Array of IDs if `multiple` is true; single ID otherwise.
 * @param {(value: DialogProductPickerType | DialogProductPickerType[]) => void} onSubmit - Callback triggered on selection confirmation.
 * @param {() => void} [onCancel] - Optional callback triggered when the selection is canceled.
 */
export const DialogProductPicker = ({
    mode,
    multiple,
    initialValue,
    onSubmit,
    onCancel,
}: DialogProductPickerProps) => {
    const [open, isOpen] = useState(false);
    const [searchString, setSearchString] = useState<string>('');
    const debouncedSearch = useDebounce(searchString, 500);
    const [selectedItems, setSelectedItems] = useState<DialogProductPickerType[]>([]);

    const { objects, Paginate, refetch, setFilterField } = useList({
        route: async ({ page, perPage, filter }) => {
            const { search } = await apiClient('query')({
                search: [
                    {
                        input: {
                            skip: (page - 1) * perPage,
                            take: perPage,
                            ...(filter && { filter }),
                            groupByProduct: mode === 'product',
                            term: debouncedSearch || undefined,
                        },
                    },
                    { items: DialogProductPickerSelector, totalItems: true },
                ],
            });
            return { items: search.items, totalItems: search.totalItems };
        },
        listType: `modal-products-list`,
        options: { skip: !open, noSearchParams: true },
    });

    useEffect(() => {
        if (debouncedSearch !== searchString) {
            refetch();
        }
    }, [debouncedSearch, refetch]);

    useEffect(() => {
        if (open && initialValue) {
            if (multiple && Array.isArray(initialValue)) {
                const initialIds = new Set(initialValue);
                const initialItems = objects?.filter(item =>
                    initialIds.has(mode === 'product' ? item.productId : item.productVariantId),
                );
                setSelectedItems(initialItems || []);
            } else if (!multiple && typeof initialValue === 'string') {
                const initialItem = objects?.find(
                    item => (mode === 'product' ? item.productId : item.productVariantId) === initialValue,
                );
                setSelectedItems(initialItem ? [initialItem] : []);
            }
        }
    }, [open, initialValue, objects, mode, multiple]);

    const onOpenChange = (open: boolean) => {
        isOpen(open);
        if (!open) {
            setSearchString('');
            setSelectedItems([]);
            onCancel && onCancel();
        }
    };

    const handleSelect = (item: DialogProductPickerType) => {
        if (multiple) {
            const itemId = mode === 'product' ? item.productId : item.productVariantId;
            const isSelected = selectedItems.some(
                selected => (mode === 'product' ? selected.productId : selected.productVariantId) === itemId,
            );

            if (isSelected) {
                setSelectedItems(
                    selectedItems.filter(
                        selected =>
                            (mode === 'product' ? selected.productId : selected.productVariantId) !== itemId,
                    ),
                );
            } else {
                setSelectedItems([...selectedItems, item]);
            }
        } else {
            setSelectedItems([item]);
        }
    };

    const handleConfirm = () => {
        if (multiple) {
            onSubmit(selectedItems);
        } else {
            onSubmit(selectedItems[0]);
        }
        onOpenChange(false);
    };

    const isItemSelected = (item: DialogProductPickerType) => {
        const itemId = mode === 'product' ? item.productId : item.productVariantId;
        return selectedItems.some(
            selected => (mode === 'product' ? selected.productId : selected.productVariantId) === itemId,
        );
    };

    const getItemPrice = (item: DialogProductPickerType) => {
        if (item.price.__typename === 'SinglePrice') {
            return priceFormatter(item.price.value, item.currencyCode);
        } else if (item.price.__typename === 'PriceRange') {
            return `${priceFormatter(item.price.min, item.currencyCode)} - ${priceFormatter(item.price.max, item.currencyCode)}`;
        }
        return '';
    };

    return (
        <div>
            <Button onClick={() => isOpen(true)}>
                {mode === 'product' ? 'Select Product' : 'Select Variant'}
            </Button>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] w-full">
                    <DialogHeader>
                        <DialogTitle>
                            {mode === 'product' ? 'Select Product' : 'Select Product Variant'}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                value={searchString}
                                onChange={e => setSearchString(e.target.value)}
                                className="pl-8"
                            />
                            {searchString && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-1 top-1.5 h-7 w-7 p-0"
                                    onClick={() => setSearchString('')}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto border rounded-md">
                            {objects?.length === 0 ? (
                                <div className="p-4 text-center">No products found</div>
                            ) : (
                                <div className="divide-y">
                                    {objects?.map(item => (
                                        <div
                                            key={mode === 'product' ? item.productId : item.productVariantId}
                                            className="p-3 flex items-center hover:bg-muted cursor-pointer"
                                            onClick={() => handleSelect(item)}
                                        >
                                            <div className="mr-3 flex-shrink-0">
                                                {multiple ? (
                                                    <Checkbox
                                                        checked={isItemSelected(item)}
                                                        onCheckedChange={() => handleSelect(item)}
                                                    />
                                                ) : (
                                                    <RadioGroup
                                                        value={isItemSelected(item) ? 'selected' : ''}
                                                    >
                                                        <RadioGroupItem
                                                            value="selected"
                                                            checked={isItemSelected(item)}
                                                        />
                                                    </RadioGroup>
                                                )}
                                            </div>

                                            <div className="flex-shrink-0 mr-3">
                                                <img
                                                    src={
                                                        item.productAsset?.preview ||
                                                        '/placeholder.svg?height=40&width=40' ||
                                                        '/placeholder.svg'
                                                    }
                                                    alt={item.productName}
                                                    className="w-10 h-10 object-cover rounded"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium truncate">{item.productName}</div>
                                                {mode === 'variant' && (
                                                    <div className="text-sm text-muted-foreground truncate">
                                                        {item.productVariantName}
                                                    </div>
                                                )}
                                                <div className="text-sm">{getItemPrice(item)}</div>
                                            </div>

                                            <div className="text-sm text-muted-foreground ml-2 flex-shrink-0">
                                                {item.sku}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center">{Paginate}</div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                        <div>
                            {selectedItems.length > 0 && (
                                <span className="text-sm">
                                    {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'}{' '}
                                    selected
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="flex-1 sm:flex-none"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={
                                    selectedItems.length === 0 ||
                                    (multiple === false && selectedItems.length !== 1)
                                }
                                className="flex-1 sm:flex-none"
                            >
                                Confirm
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
