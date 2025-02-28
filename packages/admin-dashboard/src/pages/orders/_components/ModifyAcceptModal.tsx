import {
  useOrder,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@deenruv/react-ui-devkit';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ModifyingCard } from './ModifyingCard.js';
import { ChangesRegister } from './ChangesRegister';

export const ModifyAcceptModal: React.FC = () => {
  const { t } = useTranslation('orders');

  const [open, setOpen] = useState(false);
  const { isOrderModified } = useOrder();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'destructive'} className="w-full justify-start" disabled={!isOrderModified()}>
          {t('applyChanges')}
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90dvh] max-w-[90vw] grid-rows-[auto_1fr_auto]">
        <DialogHeader>
          <DialogTitle className="text-muted-foreground">{t('reviewChanges')}</DialogTitle>
        </DialogHeader>
        <div className="grid grow grid-cols-3 gap-4">
          <div className="col-span-2 flex h-full flex-col">
            <div className="h-0 grow overflow-y-auto pr-2">
              <ChangesRegister />
            </div>
          </div>
          <ModifyingCard onNoteModified={(bool) => setOpen(bool)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
