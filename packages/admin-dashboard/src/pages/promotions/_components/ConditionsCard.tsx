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
} from '@deenruv/react-ui-devkit';
import { ModelTypes, typedGql, scalars, $ } from '@deenruv/admin-types';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Stack } from '@/components';
import { X } from 'lucide-react';
import { FacetsSelector } from '@/pages/collections/_components/FacetsSelector';
import { VariantsSelector } from '@/pages/collections/_components/VariantsSelector';
import { CustomerGroupsSelector } from '@/pages/promotions/_components/CustomerGroupsSelector';
import { PromotionConditionAndActionSelector, PromotionConditionAndActionType } from '@/graphql/promotions';

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
  const { getInputComponent } = usePluginStore();

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
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row justify-between text-base">{t('conditions.header')}</CardTitle>
        <ErrorMessage errors={errors} />
      </CardHeader>
      <CardContent>
        <Stack column className="flex-1 gap-y-4">
          {!value?.length ? (
            <p>{t('conditions.emptyState')}</p>
          ) : (
            value?.map((condition, index) => {
              return (
                <Stack column className="gap-4" key={index}>
                  <Stack className="items-center gap-3">
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
                        <h5>{t(`conditions.codes.${condition.code}`)}</h5>
                      </>
                    )}
                  </Stack>
                  <Stack
                    className={cn('items-end justify-center gap-4', condition?.arguments.length > 2 && 'flex-wrap')}
                  >
                    {condition?.arguments.map((e, i) => {
                      const _condition = data?.promotionConditions.find((f) => f.code === condition.code);
                      const argument = _condition?.args.find((a) => a.name === e.name);
                      if (!argument) return null;
                      return generateInputComponents(
                        [
                          {
                            ...argument,
                            label: [{ languageCode: 'en', value: argument.label || argument.name }],
                            description: [{ languageCode: 'en', value: argument.description || '' }],
                          },
                        ],
                        getInputComponent,
                      ).map((field) => {
                        return (
                          <div key={field.name}>
                            <div>
                              <Label>{field.name}</Label>
                            </div>
                            {field.component}
                          </div>
                        );
                      });
                    })}
                  </Stack>
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
            <Button disabled={!availableConditions.length}>{t(`conditions.add`)}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{t(`conditions.header`)}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableConditions.map((condition) => (
              <DropdownMenuItem onClick={() => addCondition(condition)} key={condition.code}>
                {t(`conditions.codes.${condition.code}`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};
