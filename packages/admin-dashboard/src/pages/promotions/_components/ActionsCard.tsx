import {
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Label,
  CardFooter,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  useQuery,
  Separator,
  Checkbox,
  cn,
  ErrorMessage,
  generateInputComponents,
  usePluginStore,
  CustomFieldsProvider,
  useSettings,
  InputFieldComponent,
} from '@deenruv/react-ui-devkit';
import { ModelTypes, typedGql, scalars, $ } from '@deenruv/admin-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@/components';
import { Percent, X } from 'lucide-react';
import { FacetsSelector } from '@/pages/collections/_components/FacetsSelector';
import { VariantsSelector } from '@/pages/collections/_components/VariantsSelector';
import { PromotionConditionAndActionSelector, PromotionConditionAndActionType } from '@/graphql/promotions';

export const ActionsQuery = typedGql('query', { scalars })({
  promotionActions: PromotionConditionAndActionSelector,
});

interface ActionsCardCardProps {
  value: ModelTypes['ConfigurableOperationInput'][] | undefined;
  onChange: (field: 'actions', value: ModelTypes['ConfigurableOperationInput'][]) => void;
  errors?: string[];
}

export const ActionsCard: React.FC<ActionsCardCardProps> = ({ value, onChange, errors }) => {
  const { t } = useTranslation('promotions');
  const { data } = useQuery(ActionsQuery);
  const { getInputComponent } = usePluginStore();
  const { language } = useSettings(({ language }) => ({ language }));

  const availableActions = useMemo(() => {
    return data?.promotionActions.filter((a) => !value?.some((v) => v.code === a.code)) || [];
  }, [data, value]);

  const handleActionsValueChange = useCallback(
    (index: number, code: string, args?: { name: string; value: string }[]) => {
      const correspondingAction = data?.promotionActions.find((h) => h.code === code);

      if (correspondingAction && value) {
        const newFiltersValue = [...value];
        newFiltersValue[index] = {
          code: correspondingAction.code,
          arguments:
            args ||
            correspondingAction.args.map((a) => ({
              name: a.name,
              value: 'false',
            })),
        };

        onChange('actions', newFiltersValue);
      }
    },
    [data, onChange, value],
  );

  const removeAction = useCallback(
    (code: string) => {
      if (value) {
        let newValue = [...value];
        newValue = newValue.filter((v) => v.code !== code);
        onChange('actions', newValue);
      }
    },
    [onChange, value, data],
  );

  const addAction = useCallback(
    (action: PromotionConditionAndActionType) => {
      const newValue = [
        ...(value || []),
        {
          code: action.code,
          arguments: action.args.map((a) => ({ name: a.name, value: a.type === 'boolean' ? 'false' : a.defaultValue })),
        },
      ];
      onChange('actions', newValue);
    },
    [onChange, value, data],
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('actions.header')}</CardTitle>
        <ErrorMessage errors={errors} />
      </CardHeader>
      <CardContent>
        <Stack column className="flex-1 gap-y-4">
          {!value?.length ? (
            <p>{t('actions.emptyState')}</p>
          ) : (
            value?.map((action, index) => {
              return (
                <Stack column className="gap-4" key={index}>
                  <Stack className="items-center gap-3">
                    {action?.code && (
                      <>
                        <Button
                          variant={'destructive'}
                          size={'sm'}
                          className="h-auto p-1"
                          onClick={(e) => {
                            e.preventDefault();
                            removeAction(action.code);
                          }}
                        >
                          <X size={16} />
                        </Button>
                        <h5>{t(`actions.codes.${action.code}`)}</h5>
                      </>
                    )}
                  </Stack>
                  {!!action.arguments.length && (
                    <Stack className={cn('items-end justify-center gap-4', action.arguments.length > 2 && 'flex-wrap')}>
                      {action?.arguments.map((e, i) => {
                        const _action = data?.promotionActions.find((f) => f.code === action.code);
                        const argument = _action?.args.find((a) => a.name === e.name);
                        if (!argument) return null;
                        const label = [{ languageCode: language, value: argument.label || argument.name || '' }];
                        const description = [{ languageCode: language, value: argument.description || '' }];
                        return generateInputComponents([{ ...argument, label, description }], getInputComponent).map(
                          (field) => {
                            let value = '';
                            try {
                              value = JSON.parse(e.value);
                            } catch {}
                            const setValue = (data: unknown) => {
                              try {
                                const value = JSON.stringify(data);
                                action.arguments[i] = { name: field.name, value };
                                handleActionsValueChange(index, action.code, action.arguments);
                              } catch {
                                console.error('Error setting value');
                              }
                            };
                            return (
                              <InputFieldComponent
                                key={field.name}
                                field={field}
                                value={value}
                                setValue={setValue}
                                additionalData={{}}
                                disabled={false}
                              />
                            );
                          },
                        );
                      })}
                    </Stack>
                  )}
                  <Separator className="my-4" />
                </Stack>
              );
            })
          )}
        </Stack>
      </CardContent>
      <CardFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={!availableActions.length}>{t(`actions.add`)}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{t(`actions.header`)}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableActions.map((action) => (
              <DropdownMenuItem key={action.code} onClick={() => addAction(action)}>
                {t(`actions.codes.${action.code}`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};
