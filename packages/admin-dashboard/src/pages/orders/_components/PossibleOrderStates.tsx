import React from 'react';
import {
  ScrollArea,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Timeline,
  TimelineItem,
  TimelineLine,
  TimelineDot,
  TimelineContent,
  TimelineHeading,
  useServer,
  Button,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';

export const PossibleOrderStates: React.FC<{
  orderState: string;
}> = ({ orderState }) => {
  const { t } = useTranslation('orders');
  const orderProcess = useServer((p) => p.serverConfig?.orderProcess || []);
  console.log(orderProcess);
  return (
    <Dialog>
      <DialogTrigger asChild className="pl-2">
        <Button variant="ghost" className="w-full justify-start">
          {t('orderStates.button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[40vw]">
        <DialogHeader>
          <DialogTitle>{t('orderStates.title')}</DialogTitle>
          <DialogDescription>{t('orderStates.description')}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[80vh]">
          <Timeline>
            {orderProcess?.map((state) => {
              const currentIndex = orderProcess?.findIndex((s) => s.name === orderState);
              const done = orderProcess?.findIndex((s) => s.name === state.name) < currentIndex;
              return (
                <TimelineItem key={state.name} status={done ? 'done' : 'default'}>
                  <TimelineLine done={done} />
                  <TimelineDot status={done ? 'done' : 'default'} />
                  <TimelineContent>
                    <TimelineHeading>{state.name}</TimelineHeading>
                    <p>{state.to.join(', ')}</p>
                  </TimelineContent>
                </TimelineItem>
              );
            })}
          </Timeline>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
