import React from 'react';
import { Data } from '../Detail';
import {
  DialogHeader,
  Input,
  DialogFooter,
  DialogContent,
  Button,
  Dialog,
  DialogClose,
  DialogDescription,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components';
import { useForm } from 'react-hook-form';

export const AddPromotionDialog: React.FC<{
  addPromotionDialog?: (Data['actions'][number] | Data['conditions'][number]) & { type: 'action' | 'condition' };
  closePromotionDialog: () => void;
}> = ({ addPromotionDialog, closePromotionDialog }) => {
  const form = useForm({});
  function onSubmit() {}

  return (
    <Dialog open={!!addPromotionDialog} onOpenChange={closePromotionDialog}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add new {addPromotionDialog?.type}</DialogTitle>
              <DialogDescription>{addPromotionDialog?.description}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-4 items-center gap-4">
              {addPromotionDialog?.args.map((arg) => (
                <FormField
                  control={form.control}
                  name={arg.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{arg.label || arg.name}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>{arg.description}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};
