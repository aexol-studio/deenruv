import { Button, Label } from '@/components';
import { TaxRateListType } from '@/graphql/taxRates';
import { Routes } from '@/utils';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  taxRate: TaxRateListType | undefined;
  editMode: boolean;
  buttonDisabled: boolean;
  onCreate: () => void;
  onEdit: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ taxRate, editMode, buttonDisabled, onCreate, onEdit }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('taxRates');

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => navigate(Routes.taxRates.list)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {editMode ? taxRate?.name : t('create')}
          </h1>
        </div>
        <Button className="ml-auto" variant={'action'} disabled={buttonDisabled} onClick={editMode ? onEdit : onCreate}>
          {editMode ? t('edit') : t('create')}
        </Button>
      </div>
      {editMode && taxRate && (
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
          <Label className="text-muted-foreground">{t('baseInfoId', { value: taxRate.id })}</Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoCreated', { value: format(taxRate.createdAt, 'dd.MM.yyyy hh:mm') })}
          </Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoUpdated', { value: format(taxRate.updatedAt, 'dd.MM.yyyy hh:mm') })}
          </Label>
        </div>
      )}
    </>
  );
};
