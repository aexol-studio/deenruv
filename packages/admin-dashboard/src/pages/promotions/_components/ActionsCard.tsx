import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
  useQuery,
  Separator,
  ErrorMessage,
  ArgumentFieldsComponent,
  CustomCard,
  CardIcons,
} from '@deenruv/react-ui-devkit';
import { ModelTypes, typedGql, scalars } from '@deenruv/admin-types';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@/components';
import { X } from 'lucide-react';

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
    <CustomCard
      title={t('actions.header')}
      color="red"
      icon={<CardIcons.action />}
      upperRight={<ErrorMessage errors={errors} />}
      bottomRight={
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
      }
    >
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
                <ArgumentFieldsComponent
                  actions={data?.promotionActions}
                  args={action.arguments}
                  setArg={(argument, data) => {
                    const newArgs = action.arguments.map((arg) => {
                      if (arg.name === argument.name) return { ...arg, value: data.value };
                      return arg;
                    });
                    handleActionsValueChange(index, action.code, newArgs);
                  }}
                />
                <Separator className="my-4" />
              </Stack>
            );
          })
        )}
      </Stack>
    </CustomCard>
  );
};
