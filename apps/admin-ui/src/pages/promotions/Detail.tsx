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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components';
import RichTextEditor from '@/components/RichTextEditor/RichTextEditor';
import { apiCall } from '@/graphql/client';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AddPromotionDialog } from './_components/AddPromotionDialog';

const FormSchema = z.object({
  startsAt: z.date({}),
  endsAt: z.date({}),
});

type FormType = z.infer<typeof FormSchema>;

const getConditionsAndActions = async () => {
  const [{ promotionActions }, { promotionConditions }] = await Promise.all([
    apiCall()('query')({
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
    apiCall()('query')({
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

  const form = useForm<FormType>({});

  const [data, setData] = useState<Data>();
  useEffect(() => {
    getConditionsAndActions().then(setData);
  }, []);

  function onSubmit(data: FormType) {}

  return (
    <div>
      <AddPromotionDialog
        addPromotionDialog={addPromotionDialog}
        closePromotionDialog={() => setAddPromotionDialog(undefined)}
      />
      <Form {...form}>
        <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="p-4">
            <Input />
            <RichTextEditor content="" onContentChanged={() => {}} />
            <div className="flex items-center justify-between gap-8">
              <FormField
                control={form.control}
                name="startsAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Starts at</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endsAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ends at</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground',
                            )}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>Your date of birth is used to calculate your age.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <DropdownMenuTrigger>Add new condition</DropdownMenuTrigger>
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
          </Card>
          <Card className="p-4">
            <p>Actions</p>
            <DropdownMenu>
              <DropdownMenuTrigger>Add new action</DropdownMenuTrigger>
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
      </Form>
    </div>
  );
};
