import {
  Button,
  Calendar,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  apiClient,
  cn,
  useSettings,
} from '@deenruv/react-ui-devkit';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';

import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { AddPromotionDialog } from './_components/AddPromotionDialog.js';
import { LanguageCode } from '@deenruv/admin-types';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';
import { SettingsCard } from '../products/_components/SettingsCard.js';

const FormSchema = z.object({
  enabled: z.boolean(),
  startsAt: z.date().optional(),
  endsAt: z.date().optional(),
  couponCode: z.string().optional(),
  perCustomerUsageLimit: z.number().optional(),
  usageLimit: z.number().optional(),
  conditions: z.array(
    z.object({
      code: z.string(),
      arguments: z.array(z.object({ name: z.string(), value: z.string() })),
    }),
  ),
  actions: z.array(
    z.object({
      code: z.string(),
      arguments: z.array(z.object({ name: z.string(), value: z.string() })),
    }),
  ),
  translations: z.array(
    z.object({
      id: z.string().optional(),
      languageCode: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      customFields: z.record(z.unknown()).optional(),
    }),
  ),
  customFields: z.record(z.unknown()).optional(),
});

const getConditionsAndActions = async () => {
  const [{ promotionActions }, { promotionConditions }] = await Promise.all([
    apiClient('query')({
      promotionActions: {
        code: true,
        description: true,
        args: {
          defaultValue: true,
          description: true,
          name: true,
          label: true,
          list: true,
          type: true,
          required: true,
          ui: true,
        },
      },
    }),
    apiClient('query')({
      promotionConditions: {
        code: true,
        description: true,
        args: {
          defaultValue: true,
          description: true,
          name: true,
          label: true,
          list: true,
          type: true,
          required: true,
          ui: true,
        },
      },
    }),
  ]);

  return { actions: promotionActions, conditions: promotionConditions };
};

export type Data = Awaited<ReturnType<typeof getConditionsAndActions>>;

export const PromotionsDetailPage = () => {
  const [addPromotionDialog, setAddPromotionDialog] = useState<
    (Data['actions'][number] | Data['conditions'][number]) & { type: 'action' | 'condition' }
  >();

  const { state, setField } = useGFFLP('CreatePromotionInput')({});
  const contentLng = useSettings((p) => p.translationsLanguage);
  const translations = state?.translations?.value || [];
  const currentTranslationValue = translations.find((v) => v.languageCode === contentLng);
  const setTranslationField = useCallback(
    (field: string, e: string) => {
      setField(
        'translations',
        setInArrayBy(translations, (t) => t.languageCode !== contentLng, {
          [field]: e,
          languageCode: contentLng,
        }),
      );
    },
    [contentLng, translations],
  );
  const [data, setData] = useState<Data>();
  useEffect(() => {
    getConditionsAndActions().then(setData);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const validation = await FormSchema.safeParseAsync({
        ...state,
        translations: [...translations, { ...currentTranslationValue, languageCode: contentLng }],
      });
      if (!validation.success) {
        throw new Error('Validation failed');
      }

      const input = {
        ...validation.data,
        translations: validation.data.translations.map((translation) => ({
          ...translation,
          languageCode: translation.languageCode as LanguageCode,
        })),
      };

      const { createPromotion } = await apiClient('mutation')({
        createPromotion: [
          { input },
          {
            __typename: true,
            '...on Promotion': { id: true },
            '...on MissingConditionsError': { message: true, errorCode: true },
          },
        ],
      });

      if (createPromotion.__typename === 'MissingConditionsError') {
        throw new Error(createPromotion.errorCode);
      }

      console.log(createPromotion.id);
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <div>
      {addPromotionDialog && (
        <AddPromotionDialog
          addPromotionDialog={addPromotionDialog}
          closePromotionDialog={() => setAddPromotionDialog(undefined)}
        />
      )}
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <SettingsCard
          enabledValue={state.enabled?.value}
          onEnabledChange={(e) => {
            setField('enabled', e);
          }}
        />
        <Card className="p-4">
          <Input value={currentTranslationValue?.name} onChange={(e) => setTranslationField('name', e.target.value)} />
          <RichTextEditor
            content={currentTranslationValue?.description}
            onContentChanged={(description) => {
              setTranslationField('description', description);
            }}
          />
          <div className="flex items-center justify-between gap-8">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] pl-3 text-left font-normal',
                    !state.startsAt?.value && 'text-muted-foreground',
                  )}
                >
                  {state.startsAt?.value ? format(state.startsAt.value, 'PPP') : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={state.startsAt?.value}
                  onSelect={(date) => setField('startsAt', date)}
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] pl-3 text-left font-normal',
                    !state.endsAt?.value && 'text-muted-foreground',
                  )}
                >
                  {state.endsAt?.value ? format(state.endsAt.value, 'PPP') : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={state.endsAt?.value}
                  onSelect={(date) => setField('endsAt', date)}
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-4">
            <Input />
            <Input />
            <Input />
          </div>
        </Card>
        <Card className="p-4">
          <p>Conditions</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Add new condition</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Conditions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {data?.conditions.map((condition) => (
                <DropdownMenuItem onClick={() => setAddPromotionDialog({ ...condition, type: 'condition' })}>
                  {condition.code}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {state.conditions?.value.map((condition, index) => (
            <Card key={index} className="p-4">
              <p>{condition.code}</p>
              {condition.arguments.map((argument, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Input />
                  <Input />
                </div>
              ))}
            </Card>
          ))}
        </Card>
        <Card className="p-4">
          <p>Actions</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>Add new action</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {data?.actions.map((condition) => (
                <DropdownMenuItem onClick={() => setAddPromotionDialog({ ...condition, type: 'action' })}>
                  {condition.code}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </Card>
      </form>
    </div>
  );
};
