import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@/components';
import { apiCall } from '@/graphql/client';
import { CountryListType } from '@/graphql/settings';
import { cn } from '@/lib/utils';
import { useGFFLP } from '@/lists/useGflp';
import { useSettings } from '@/state';
import { DeletionResult, LanguageCode } from '@deenruv/admin-types';

import React, { useEffect, useMemo } from 'react';
import { toast } from 'sonner';

interface CountryActionModalProps {
  action: 'create' | 'edit' | 'delete' | undefined;
  onClose: () => void;
  onActionSucess: () => void;
  countryToEdit?: CountryListType;
  countriesToDelete: CountryListType[];
}

export const CountryActionModal: React.FC<CountryActionModalProps> = ({
  action,
  onClose,
  countriesToDelete,
  countryToEdit,
  onActionSucess,
}) => {
  // TODO: for now we are not handling possibility to change language
  const { translationsLanguage: languageCode } = useSettings(({ translationsLanguage }) => ({ translationsLanguage }));
  const { state, checkIfAllFieldsAreValid, setField, setState, clearErrors } = useGFFLP(
    action === 'create' ? 'CreateCountryInput' : 'UpdateCountryInput',
  )({
    code: {
      initialValue: '',
      validate: (v) => {
        if (!v || v === '') return ['Kod jest wymagany'];
      },
    },
    translations: {
      validate: (v) => {
        const name = v?.find((v) => v.languageCode === languageCode)?.name;
        if (!name || name === '') return ['Nazwa jest wymagana'];
      },
    },
    enabled: { initialValue: true },
  });

  useEffect(() => {
    if (!countryToEdit) return;
    setState({
      code: countryToEdit.code,
      translations: [{ languageCode, name: countryToEdit?.name ?? '' }],
      enabled: countryToEdit.enabled,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryToEdit]);

  const dialogContent = useMemo(() => {
    switch (action) {
      case 'create':
        return { dialogTitle: 'Dodaj nowy kraj', acceptButtonText: 'Dodaj' };
      case 'edit':
        return { dialogTitle: 'Edytuj kraj', acceptButtonText: 'Zapisz' };
      case 'delete':
        return {
          dialogTitle: 'Jesteś pewnien?',
          dialogDescription: 'Kraj zostanie trwale usunięty',
          acceptButtonText: 'Usuń',
        };
    }
  }, [action]);

  const handleTranslationChange = (languageCode: LanguageCode, name: string) => {
    const translations = state.translations?.value?.map((t) => (t.languageCode === languageCode ? { ...t, name } : t));
    setField('translations', translations);
  };

  const handleAccept = async () => {
    switch (action) {
      case 'create': {
        if (!checkIfAllFieldsAreValid()) {
          return;
        }
        const resp = await apiCall()('mutation')({
          createCountry: [
            {
              input: {
                code: state.code?.value ?? '',
                enabled: state.enabled?.value ?? false,
                translations: state.translations?.value ?? [],
              },
            },
            { id: true },
          ],
        });
        if (!resp.createCountry.id) {
          toast.error('Could not create country');
          return;
        }
        toast('Country created');
        onActionSucess();
        return;
      }
      case 'edit': {
        if (!checkIfAllFieldsAreValid() || !countryToEdit?.id) return;
        const resp = await apiCall()('mutation')({
          updateCountry: [
            {
              input: {
                id: countryToEdit.id,
                code: state.code?.value ?? '',
                enabled: state.enabled?.value ?? false,
                translations: state.translations?.value ?? [],
              },
            },
            { id: true },
          ],
        });
        if (!resp.updateCountry.id) {
          toast.error('Could not update country');
          return;
        }
        toast('Country updated');
        onActionSucess();
        return;
      }
      case 'delete': {
        const resp = await apiCall()('mutation')({
          deleteCountries: [{ ids: countriesToDelete.map((i) => i.id) }, { message: true, result: true }],
        });
        if (resp.deleteCountries.some((i) => i.result === DeletionResult.NOT_DELETED)) {
          toast.error('Could not delete some countries');
          return;
        }
        toast.success('Countries deleted');
        onActionSucess();
        return;
      }
      default: {
        return;
      }
    }
  };

  useEffect(() => {
    if (!action) {
      setState({ code: '', translations: [{ languageCode, name: '' }], enabled: true });
      clearErrors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);
  return (
    <Dialog open={!!action} onOpenChange={(e) => !e && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogContent?.dialogTitle}</DialogTitle>
          {dialogContent?.dialogDescription && <DialogDescription>{dialogContent.dialogDescription}</DialogDescription>}

          {(() => {
            switch (action) {
              case 'create':
              case 'edit':
                return (
                  <div className="flex items-center gap-10 pt-8">
                    <div>
                      <Label>Nazwa</Label>
                      <Input
                        className={cn((state.translations?.errors ?? []).length > 0 && '!border-red-500')}
                        value={state.translations?.value?.find((t) => t.languageCode === languageCode)?.name}
                        onChange={(e) => handleTranslationChange(languageCode, e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Kod</Label>
                      <Input
                        className={cn((state.code?.errors ?? []).length > 0 && '!border-red-500')}
                        value={state.code?.value ?? ''}
                        onChange={(e) => setField('code', e.target.value)}
                      />
                    </div>
                    <div className="flex  items-center gap-4 ">
                      <Checkbox checked={state.enabled?.value} onCheckedChange={(e) => setField('enabled', !!e)} />
                      <Label>Enabled</Label>
                    </div>
                  </div>
                );

              case 'delete':
                return (
                  <div className="flex w-full flex-wrap gap-2">
                    {countriesToDelete.map((i) => (
                      <Badge key={i.id} className="flex w-max gap-2">
                        <div className="flex gap-1">
                          <span>Nazwa:</span>
                          <span className="font-bold uppercase">{i.name}</span>
                        </div>
                        <div className="h-full w-[1px] bg-secondary" />
                        <div className="flex gap-1">
                          <span>Kod:</span>
                          <span className="font-bold uppercase">{i.code}</span>
                        </div>
                      </Badge>
                    ))}{' '}
                  </div>
                );
            }
          })()}
        </DialogHeader>
        <DialogFooter className="pt-8">
          <Button onClick={onClose} variant="ghost">
            Anuluj
          </Button>
          <Button variant={action === 'delete' ? 'destructive' : 'action'} onClick={handleAccept}>
            {dialogContent?.acceptButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
