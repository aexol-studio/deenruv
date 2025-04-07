import type React from 'react';
import { useMemo } from 'react';
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
  Badge,
} from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, CircleDot } from 'lucide-react';

export const PossibleOrderStates: React.FC<{
  orderState: string;
}> = ({ orderState }) => {
  const { t } = useTranslation('orders');
  const { t: tCommon } = useTranslation('common');
  const orderProcess = useServer((p) => p.serverConfig?.orderProcess || []);
  const statesAfterCancelled = useMemo(() => {
    const cancelledIndex = orderProcess.findIndex((s) => s.name === 'Cancelled');
    if (cancelledIndex === -1) return null;
    return orderProcess.slice(cancelledIndex + 1);
  }, [orderProcess]);
  const sortedOrderProcess = useMemo(() => {
    if (!statesAfterCancelled) return orderProcess;
    const sorted = [];
    let i = 0;
    while (i < orderProcess.length) {
      const state = orderProcess[i];
      const firstPossibleNextState = state.to.length > 0 ? state.to[0] : null;
      if (firstPossibleNextState) {
        const stateAfterCancelled = statesAfterCancelled.find((s) => s.name === firstPossibleNextState);
        if (stateAfterCancelled) {
          sorted.push(state);
          sorted.push(stateAfterCancelled);
          i++;
        } else {
          sorted.push(state);
        }
      } else {
        sorted.push(state);
      }
      i++;
    }
    const cancelledIndex = sorted.findIndex((s) => s.name === 'Cancelled');
    if (cancelledIndex !== -1) {
      return sorted.slice(0, cancelledIndex + 1);
    }
    return sorted;
  }, [orderProcess, statesAfterCancelled]);

  const currentStateIndex = useMemo(
    () => sortedOrderProcess.findIndex((s) => s.name === orderState),
    [sortedOrderProcess, orderState],
  );
  const currentStateObj = useMemo(
    () => sortedOrderProcess.find((s) => s.name === orderState),
    [sortedOrderProcess, orderState],
  );
  const possibleNextStates = useMemo(() => currentStateObj?.to || [], [currentStateObj]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full cursor-pointer justify-start px-4 py-2 focus-visible:ring-transparent dark:focus-visible:ring-transparent"
        >
          {t('orderStates.button')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[40vw]">
        <DialogHeader>
          <DialogTitle>{t('orderStates.title')}</DialogTitle>
          <DialogDescription>{t('orderStates.description')}</DialogDescription>
        </DialogHeader>

        {/* Current state summary */}
        <div className="bg-muted/50 mb-4 rounded-md border p-4">
          <h3 className="mb-2 text-sm font-medium">{t('orderStates.currentState')}</h3>
          <div className="mb-3 flex items-center gap-2">
            <CircleDot className="text-primary size-5" />
            <span className="font-semibold">{orderState}</span>
          </div>

          {possibleNextStates.length > 0 ? (
            <>
              <h4 className="mb-2 text-sm font-medium">{t('orderStates.possibleNextStates')}</h4>
              <div className="flex flex-wrap gap-2">
                {possibleNextStates.map((nextState) => (
                  <Badge key={nextState} variant="outline" className="flex items-center gap-1">
                    {tCommon('search.inOperator.' + nextState)}
                    <ArrowRight className="ml-1 size-3" />
                  </Badge>
                ))}
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">{t('orderStates.finalState')}</p>
          )}
        </div>

        <ScrollArea className="h-[60vh]">
          <Timeline>
            {sortedOrderProcess.map((state, index) => {
              const isPast = index < currentStateIndex;
              const isCurrent = index === currentStateIndex;
              const isPossibleNext = possibleNextStates.includes(state.name);

              return (
                <TimelineItem key={state.name} status={isPast ? 'done' : isCurrent ? null : 'default'}>
                  <TimelineLine done={isPast} />
                  <TimelineDot
                    status={isPast ? 'done' : isCurrent ? 'current' : 'default'}
                    className={isPossibleNext ? 'ring-primary ring-1 ring-offset-1' : ''}
                  >
                    {isPast && <Check className="size-4" />}
                  </TimelineDot>
                  <TimelineContent>
                    <TimelineHeading className={isCurrent ? 'text-primary font-bold' : ''}>
                      {tCommon('search.inOperator.' + state.name)}
                      {isCurrent && (
                        <Badge className="ml-2" variant="default">
                          {t('orderStates.current')}
                        </Badge>
                      )}
                      {isPossibleNext && (
                        <Badge className="ml-2" variant="outline">
                          {t('orderStates.possible')}
                        </Badge>
                      )}
                    </TimelineHeading>
                    {state.to.length > 0 && (
                      <div className="mt-1">
                        <p className="text-muted-foreground mb-1 text-sm">{t('orderStates.canTransitionTo')}:</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {state.to.map((nextState) => (
                            <Badge
                              key={nextState}
                              variant="outline"
                              className={`text-xs ${orderState === nextState ? 'bg-primary/10 border-primary' : ''}`}
                            >
                              {tCommon('search.inOperator.' + nextState)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {state.to.length === 0 && (
                      <p className="text-muted-foreground mt-1 text-sm">{t('orderStates.finalState')}</p>
                    )}
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
