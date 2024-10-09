import { Button, Label } from '@/components';
import { ProductDetailType } from '@/graphql/products';
import { Routes } from '@/utils';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  product: ProductDetailType | undefined;
  editMode: boolean;
  onCreate: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ product, editMode, onCreate }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('products');

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(Routes.products)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {product?.name}
          </h1>
        </div>
        {!editMode && (
          <Button variant={'action'} onClick={onCreate} className="ml-auto">
            {t('add')}
          </Button>
        )}
      </div>
      {editMode && product && (
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
          <Label className="text-muted-foreground">{t('baseInfoId', { value: product.id })}</Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoCreated', { value: format(product.createdAt, 'dd.MM.yyyy hh:mm') })}
          </Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoUpdated', { value: format(product.updatedAt, 'dd.MM.yyyy hh:mm') })}
          </Label>
        </div>
      )}
    </>
  );
};
