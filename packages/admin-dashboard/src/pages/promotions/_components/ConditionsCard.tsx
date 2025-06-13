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

export const ConditionsQuery = typedGql('query', { scalars })({
  promotionConditions: PromotionConditionAndActionSelector,
});

interface ConditionsCardProps {
  value: ModelTypes['ConfigurableOperationInput'][] | undefined;
  onChange: (field: 'conditions', value: ModelTypes['ConfigurableOperationInput'][]) => void;
  errors?: string[];
}

export const ConditionsCard: React.FC<ConditionsCardProps> = ({ value, onChange, errors }) => {
  const { t } = useTranslation('promotions');
  const { data } = useQuery(ConditionsQuery);

  const availableConditions = useMemo(() => {
    return data?.promotionConditions.filter((c) => !value?.some((v) => v.code === c.code)) || [];
  }, [data, value]);

  const handleConditionsValueChange = useCallback(
    (index: number, code: string, args?: { name: string; value: string }[]) => {
      const correspondingCondition = data?.promotionConditions.find((h) => h.code === code);

      if (correspondingCondition && value) {
        const newFiltersValue = [...value];
        newFiltersValue[index] = {
          code: correspondingCondition.code,
          arguments:
            args ||
            correspondingCondition.args.map((a) => ({
              name: a.name,
              value: 'false',
            })),
        };

        onChange('conditions', newFiltersValue);
      }
    },
    [data, onChange, value],
  );

  const removeCondition = useCallback(
    (code: string) => {
      if (value) {
        let newValue = [...value];
        newValue = newValue.filter((v) => v.code !== code);
        onChange('conditions', newValue);
      }
    },
    [onChange, value, data],
  );

  const addCondition = useCallback(
    (condition: PromotionConditionAndActionType) => {
      const newValue = [
        ...(value || []),
        {
          code: condition.code,
          arguments: condition.args.map((a) => ({
            name: a.name,
            value: a.type === 'boolean' ? 'false' : a.defaultValue,
          })),
        },
      ];
      onChange('conditions', newValue);
    },
    [onChange, value, data],
  );

  return (
    <CustomCard
      title={t('conditions.header')}
      color="yellow"
      icon={<CardIcons.check />}
      upperRight={<ErrorMessage errors={errors} />}
      bottomRight={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={!availableConditions.length}>{t(`conditions.add`)}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{t(`conditions.header`)}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableConditions.map((condition) => {
              const translated = t(`conditions.codes.${condition.code}`);
              return (
                <DropdownMenuItem onClick={() => addCondition(condition)} key={condition.code}>
                  {translated !== `conditions.codes.${condition.code}` ? translated : condition.description}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      <div className="flex flex-1 flex-col gap-y-4">
        {!value?.length ? (
          <p>{t('conditions.emptyState')}</p>
        ) : (
          value?.map((condition, index) => {
            const translated = t(`conditions.codes.${condition.code}`);
            const available = availableConditions.find((c) => c.code === condition.code);
            return (
              <div className="flex flex-col gap-4" key={index}>
                <div className="flex items-center gap-3">
                  {condition?.code && (
                    <>
                      <Button
                        variant={'destructive'}
                        size={'sm'}
                        className="h-auto p-1"
                        onClick={(e) => {
                          e.preventDefault();
                          removeCondition(condition.code);
                        }}
                      >
                        <X size={16} />
                      </Button>
                      <h5>
                        {translated !== `conditions.codes.${condition.code}`
                          ? translated
                          : available?.description || condition.code}
                      </h5>
                    </>
                  )}
                </div>
                <ArgumentFieldsComponent
                  actions={data?.promotionConditions}
                  args={condition.arguments}
                  setArg={(argument, data) => {
                    const newArgs = condition.arguments.map((arg) => {
                      if (arg.name === argument.name) return { ...arg, value: data.value };
                      return arg;
                    });
                    handleConditionsValueChange(index, condition.code, newArgs);
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
