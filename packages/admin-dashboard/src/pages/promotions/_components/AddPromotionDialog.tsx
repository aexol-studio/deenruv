import React, { useEffect } from 'react';
import { Data } from '../Detail.js';
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
} from '@/components';
import { setInArrayBy, useGFFLP } from '@/lists/useGflp';

export const AddPromotionDialog: React.FC<{
  addPromotionDialog?: (Data['actions'][number] | Data['conditions'][number]) & { type: 'action' | 'condition' };
  closePromotionDialog: () => void;
}> = ({ addPromotionDialog, closePromotionDialog }) => {
  const form = useGFFLP('ConfigurableOperationInput')({
    code: { initialValue: addPromotionDialog?.code },
    arguments: {
      initialValue: addPromotionDialog?.args?.map((arg) => {
        try {
          return { name: arg.name, value: JSON.stringify(arg.defaultValue) };
        } catch {
          return { name: arg.name, value: '' };
        }
      }),
    },
  });

  useEffect(() => {
    if (!addPromotionDialog) return;
    form.setState({
      code: addPromotionDialog.code,
      arguments: addPromotionDialog.args.map((arg) => {
        try {
          return { name: arg.name, value: JSON.stringify(arg.defaultValue) };
        } catch {
          return { name: arg.name, value: '' };
        }
      }),
    });
  }, []);
  console.log(addPromotionDialog, form);
  // function onSubmit() {}

  return (
    <Dialog open={!!addPromotionDialog} onOpenChange={closePromotionDialog}>
      <form className="w-2/3 space-y-6">
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new {addPromotionDialog?.type}</DialogTitle>
            <DialogDescription>{addPromotionDialog?.description}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 items-center gap-4">
            {form.state.arguments?.initialValue?.map((argument) => {
              const arg = addPromotionDialog?.args.find((a) => a.name === argument.name);
              if (!arg) return null;

              if (arg.type === 'string') {
                return (
                  <Input
                    key={argument.name}
                    label={argument.name}
                    value={argument.value}
                    onChange={(e) => {
                      const array = form.state.arguments?.value || [];
                      setInArrayBy(array, (a) => a.name !== argument.name, {
                        name: argument.name,
                        value: e.target.value,
                      });
                    }}
                  />
                );
              } else {
                return <p>Not implemented yet {arg.type}</p>;
              }
            })}
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
    </Dialog>
  );
};
