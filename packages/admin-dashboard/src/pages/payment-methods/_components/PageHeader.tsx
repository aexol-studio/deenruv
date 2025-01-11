import {
  Routes,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@deenruv/react-ui-devkit';
import { PaymentMethodDetailsType } from '@/graphql/paymentMethods';
import { LanguageCode } from '@deenruv/admin-types';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@/components';

interface PageHeaderProps {
  paymentMethod: PaymentMethodDetailsType | undefined;
  editMode: boolean;
  buttonDisabled: boolean;
  onCreate: () => void;
  onEdit: () => void;
  currentTranslationLng: LanguageCode;
  onCurrentLanguageChange: (e: LanguageCode) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  paymentMethod,
  editMode,
  buttonDisabled,
  onCreate,
  onEdit,
  currentTranslationLng,
  onCurrentLanguageChange,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('paymentMethods');

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => navigate(Routes.paymentMethods.list)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {editMode ? paymentMethod?.code : t('create')}
          </h1>
        </div>
        <Stack className="ml-auto gap-3">
          <Select defaultValue={LanguageCode.en} value={currentTranslationLng} onValueChange={onCurrentLanguageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={LanguageCode.en}>{LanguageCode.en}</SelectItem>
              <SelectItem value={LanguageCode.pl}>{LanguageCode.pl}</SelectItem>
            </SelectContent>
          </Select>
          <Button variant={'action'} disabled={buttonDisabled} onClick={editMode ? onEdit : onCreate}>
            {editMode ? t('edit') : t('create')}
          </Button>
        </Stack>
      </div>
      {editMode && paymentMethod && (
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
          <Label className="text-muted-foreground">{t('baseInfoId', { value: paymentMethod.id })}</Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoCreated', { value: format(new Date(paymentMethod.createdAt), 'dd.MM.yyyy hh:mm') })}
          </Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoUpdated', { value: format(new Date(paymentMethod.updatedAt), 'dd.MM.yyyy hh:mm') })}
          </Label>
        </div>
      )}
    </>
  );
};
