import {
  Routes,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SimpleTooltip,
} from '@deenruv/react-ui-devkit';
import { CollectionDetailsType } from '@/graphql/collections';
import { LanguageCode } from '@deenruv/admin-types';
import { format } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Stack } from '@/components';

interface PageHeaderProps {
  collection: CollectionDetailsType | undefined;
  editMode: boolean;
  buttonDisabled: boolean;
  onCreate: () => void;
  onEdit: () => void;
  currentTranslationLng: LanguageCode;
  onCurrentLanguageChange: (e: LanguageCode) => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  collection,
  editMode,
  buttonDisabled,
  onCreate,
  onEdit,
  currentTranslationLng,
  onCurrentLanguageChange,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('collections');

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => navigate(Routes.collections.list, { viewTransition: true })}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {editMode ? collection?.name : t('create')}
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
          <SimpleTooltip
            content={buttonDisabled ? (editMode ? t('noChangesTooltip') : t('buttonDisabledTooltip')) : undefined}
          >
            <Button disabled={buttonDisabled} onClick={editMode ? onEdit : onCreate}>
              {editMode ? t('edit') : t('create')}
            </Button>
          </SimpleTooltip>
        </Stack>
      </div>
      {editMode && collection && (
        <div className="flex flex-row flex-wrap gap-x-4 gap-y-2">
          <Label className="text-muted-foreground">{t('baseInfoId', { value: collection.id })}</Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoCreated', { value: format(new Date(collection.createdAt), 'dd.MM.yyyy hh:mm') })}
          </Label>
          <Label className="text-muted-foreground">|</Label>
          <Label className="text-muted-foreground">
            {t('baseInfoUpdated', { value: format(new Date(collection.updatedAt), 'dd.MM.yyyy hh:mm') })}
          </Label>
        </div>
      )}
    </>
  );
};
