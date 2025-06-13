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
  useTranslation,
  PromotionConditionAndActionSelector,
  PromotionConditionAndActionType,
} from '@deenruv/react-ui-devkit';
import { ModelTypes, typedGql, scalars } from '@deenruv/admin-types';
import React, { useCallback, useMemo } from 'react';
import { X } from 'lucide-react';

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
            {availableActions.map((action) => {
              const translated = t(`actions.codes.${action.code}`);
              return (
                <DropdownMenuItem key={action.code} onClick={() => addAction(action)}>
                  {translated !== `actions.codes.${action.code}` ? translated : action.description}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      <div className="flex flex-1 flex-col gap-y-4">
        {!value?.length ? (
          <p>{t('actions.emptyState')}</p>
        ) : (
          value?.map((action, index) => {
            const translated = t(`actions.codes.${action.code}`);
            const available = availableActions.find((a) => a.code === action.code);
            return (
              <div className="flex flex-col gap-4" key={index}>
                <div className="flex items-center gap-3">
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
                      <h5>
                        {translated !== `actions.codes.${action.code}`
                          ? translated
                          : available?.description || action.code}
                      </h5>
                    </>
                  )}
                </div>
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
              </div>
            );
          })
        )}
      </div>
    </CustomCard>
  );
};
