import { Button, Label } from '@/components';
import { TaxCategoryListType } from '@/graphql/taxCategories';
import { Routes } from '@/utils';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  taxCategory: TaxCategoryListType | undefined;
  editMode: boolean;
  buttonDisabled: boolean;
  onCreate: () => void;
  onEdit: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ taxCategory, editMode, buttonDisabled, onCreate, onEdit }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('taxCategories');

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(Routes.taxCategories.list)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {editMode ? taxCategory?.name : t('create')}
          </h1>
        </div>
        <Button className="ml-auto" variant={'action'} disabled={buttonDisabled} onClick={editMode ? onEdit : onCreate}>
          {editMode ? t('edit') : t('create')}
        </Button>
      </div>
      {editMode && taxCategory && (
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
          <Label className="text-muted-foreground">{t('baseInfoId', { value: taxCategory.id })}</Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoCreated', { value: format(taxCategory.createdAt, 'dd.MM.yyyy hh:mm') })}
          </Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoUpdated', { value: format(taxCategory.updatedAt, 'dd.MM.yyyy hh:mm') })}
          </Label>
        </div>
      )}
    </>
  );
};
