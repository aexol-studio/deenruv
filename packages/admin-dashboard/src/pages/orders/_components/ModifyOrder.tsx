import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  cn,
} from '@deenruv/react-ui-devkit';
import { ImageWithPreview, ProductVariantSearch } from '@/components';
import { DraftOrderType, ProductVariantType } from '@/graphql/draft_order';
// import { CustomComponent } from '@/pages/orders/_components';
import { ModifyingCard } from '@/pages/orders/_components/ModifyingCard';
import { PromotionsList } from '@/pages/orders/_components/PromotionsList';
// import { useOrder } from '@/state/order';
import { priceFormatter } from '@/utils';
import { Check, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ProductVariantCustomFieldsType = { attributes?: string; discountBy?: number; selectedImageId?: string };
type NewLineType = {
  productVariant: ProductVariantType;
  quantity: number;
  customFields: ProductVariantCustomFieldsType;
};
type CurrentLineType = DraftOrderType['lines'][number];

interface Props {
  currentOrder: DraftOrderType;
}
export const ModifyOrder: React.FC<Props> = ({ currentOrder }) => {
  const { t } = useTranslation('orders');
  // const modifyOrder = useOrder((p) => p.modifyOrder);
  // const modifyOrderInput = useOrder((p) => p.modifyOrderInput);
  // const setModifyOrderInput = useOrder((p) => p.setModifyOrderInput);
  // const checkModifyOrder = useOrder((p) => p.checkModifyOrder);

  const [currentLinesChanged, setCurrentLinesChanged] = useState<CurrentLineType[]>([]);
  const [newLines, setNewLines] = useState<NewLineType[]>([]);
  const [variantToAdd, setVariantToAdd] = useState<NewLineType | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const openAddVariantDialog = (variant: ProductVariantType) => {
    setOpen(true);
    setVariantToAdd({ productVariant: variant, quantity: 1, customFields: {} });
  };

  const closeAddVariantDialog = () => {
    setOpen(false);
    setVariantToAdd(undefined);
  };
  const currentProductQuantityChange = useMemo(
    () => currentLinesChanged.some((i) => currentOrder.lines.some((a) => a.id === i.id)),
    [currentOrder.lines, currentLinesChanged],
  );

  return (
    <div className="mx-auto flex  w-full max-w-[1440px] flex-col gap-4 2xl:px-8">
      <div className="flex items-center gap-4 ">
        <Label>{t('modify.title', { value: currentOrder.id })}</Label>
      </div>
      <div className={`h-full overflow-auto rounded-md border`}>
        <Table className="w-full">
          <TableHeader className="bg-primary-foreground sticky top-0">
            <TableRow>
              <TableHead>{t('modify.productTable.headImage')}</TableHead>
              <TableHead>{t('modify.productTable.headName')}</TableHead>
              <TableHead>{t('modify.productTable.headSku')}</TableHead>
              <TableHead>{t('modify.productTable.headUnitPrice')}</TableHead>
              <TableHead>{t('modify.productTable.headQuantity')}</TableHead>
              <TableHead>{t('modify.productTable.headTotal')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrder.lines.map((line) => {
              const isChanged = currentLinesChanged.find((i) => i.id === line.id);
              return (
                <TableRow key={line.id}>
                  <TableCell>
                    <ImageWithPreview src={line.productVariant.featuredAsset?.preview} alt={line.productVariant.name} />
                  </TableCell>
                  <TableCell>{line.productVariant.name}</TableCell>
                  <TableCell>{line.productVariant.sku}</TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center">
                      <div>{priceFormatter(line.discountedLinePriceWithTax, line.productVariant.currencyCode)}</div>
                      <div className="text-xs">
                        {priceFormatter(line.discountedLinePrice, line.productVariant.currencyCode)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="relative">
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      className={cn(isChanged && 'border-orange-500 focus-visible:border-orange-500')}
                      value={
                        isChanged ? currentLinesChanged.find((i) => i.id === line.id)?.quantity || 0 : line.quantity
                      }
                      onChange={(e) => {
                        const newValue = parseInt(e.currentTarget.value);
                        if (line.quantity === newValue) {
                          setCurrentLinesChanged((p) => p.filter((i) => i.id !== line.id));
                        } else {
                          const newLines = [...currentLinesChanged];
                          const lineIndex = newLines.findIndex((i) => i.id === line.id);
                          if (lineIndex === -1) {
                            newLines.push({ ...line, quantity: newValue });
                          } else {
                            newLines[lineIndex].quantity = newValue;
                          }
                          setCurrentLinesChanged(newLines);
                        }
                      }}
                    />
                    {isChanged && (
                      <RotateCcw
                        size={20}
                        className="absolute right-11 top-[26px] cursor-pointer"
                        onClick={() => setCurrentLinesChanged((p) => p.filter((i) => i.id !== line.id))}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{line.discountedLinePriceWithTax}</div>
                      <div>{line.discountedLinePrice}</div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {newLines.map(({ productVariant, quantity }) => (
              <TableRow key={productVariant.id}>
                <TableCell>
                  <ImageWithPreview src={productVariant.featuredAsset?.preview} alt={productVariant.name} />
                </TableCell>
                <TableCell>{productVariant.name}</TableCell>
                <TableCell>{productVariant.sku}</TableCell>
                <TableCell>
                  <div className="flex flex-col items-center">
                    <div>{priceFormatter(productVariant.priceWithTax, productVariant.currencyCode)}</div>
                    <div className="text-xs">{priceFormatter(productVariant.price, productVariant.currencyCode)}</div>
                  </div>
                </TableCell>
                <TableCell className="relative">
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    className="border-green-500 focus-visible:border-green-500"
                    value={quantity}
                    onChange={(e) => {
                      const linesCopy = [...newLines];
                      const lineIndex = linesCopy.findIndex((i) => i.productVariant.id === productVariant.id);
                      linesCopy[lineIndex].quantity = parseInt(e.currentTarget.value);
                      setNewLines(linesCopy);
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div>
                    <div>{productVariant.priceWithTax}</div>
                    <div>{productVariant.price}</div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div>AAA zmiana: {currentProductQuantityChange ? 'tak' : 'nie'}</div>
      <Card>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  {t('modify.addItemTitle')}
                  {newLines.length && <Check className="text-green-600" />}
                </div>
              </AccordionTrigger>
              <AccordionContent wrapperClassName="overflow-visible">
                <div className="relative  h-[300px] overflow-visible">
                  <Label htmlFor="product">{t('create.searchPlaceholder')}</Label>
                  <ProductVariantSearch onSelectItem={(i) => openAddVariantDialog(i)} />
                </div>
                <Dialog open={open} onOpenChange={(e) => (!e ? closeAddVariantDialog() : setOpen(true))}>
                  <DialogContent className="max-w-[50vw]">
                    {variantToAdd ? (
                      <div className="flex h-full w-full flex-col justify-between">
                        <div>
                          <div className="mb-8 flex w-full items-center gap-4 ">
                            <ImageWithPreview
                              src={variantToAdd.productVariant.featuredAsset?.preview}
                              alt={variantToAdd.productVariant.name}
                            />

                            <div>{variantToAdd.productVariant.product.slug}</div>
                            <div>{variantToAdd.productVariant.name}</div>

                            <div>
                              {priceFormatter(
                                variantToAdd.productVariant.priceWithTax,
                                variantToAdd.productVariant.currencyCode,
                              )}
                            </div>
                            <div className="text-xs">
                              {priceFormatter(
                                variantToAdd.productVariant.price,
                                variantToAdd.productVariant.currencyCode,
                              )}
                            </div>
                          </div>

                          <Input
                            label={t('modify.quantity')}
                            type="number"
                            min="0"
                            step="1"
                            className="max-w-[20rem]"
                            value={variantToAdd.quantity}
                            onChange={(e) =>
                              setVariantToAdd((p) =>
                                p ? { ...p, quantity: parseInt(e.currentTarget.value) } : undefined,
                              )
                            }
                          />
                          {/* commented for now bcs we are not using this ModifyOrder component, and CustomComponent pros has been changed in ProductsCard component */}
                          {/* <CustomComponent
                            productId={variantToAdd.productVariant.product.id}
                            value={variantToAdd.customFields.attributes || ''}
                            setValue={(data) =>
                              setVariantToAdd((p) =>
                                p ? { ...p, customFields: { ...p?.customFields, attributes: data } } : undefined,
                              )
                            }
                          /> */}
                          <div className="w-full max-w-[20rem]">
                            <Input
                              type="number"
                              value={
                                variantToAdd.customFields?.discountBy
                                  ? variantToAdd.customFields.discountBy / 100
                                  : undefined
                              }
                              onChange={(e) =>
                                setVariantToAdd((p) =>
                                  p
                                    ? {
                                        ...p,
                                        customFields: {
                                          ...p?.customFields,
                                          discountBy: parseFloat(e.target.value) * 100,
                                        },
                                      }
                                    : undefined,
                                )
                              }
                              label={t('create.addModal.discount', { value: currentOrder.currencyCode })}
                              placeholder={t('create.addModal.discountAmount')}
                            />
                          </div>
                        </div>
                        <div className="float-end flex flex-row justify-end gap-4">
                          <Button
                            onClick={() => {
                              setNewLines((p) => [...p, variantToAdd]);
                              closeAddVariantDialog();
                            }}
                          >
                            {t('create.add')}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>{t('create.somethingWrong')}</div>
                    )}
                  </DialogContent>
                </Dialog>
              </AccordionContent>
            </AccordionItem>

            {/* <AccordionItem value="item-2">
              <AccordionTrigger>Is it animated?</AccordionTrigger>
              <AccordionContent>
                Yes. It&apos;s animated by default, but you can disable it if you prefer.
              </AccordionContent>
            </AccordionItem> */}
          </Accordion>
          <div className="my-8 flex flex-col gap-4">
            <ModifyingCard />
            <PromotionsList />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
