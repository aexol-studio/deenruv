import { OrderHistoryEntryType } from '@/graphql/draft_order';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Label,
  Timeline as TimelineWrapper,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
  OrderStateBadge,
  cn,
} from '@deenruv/react-ui-devkit';
import { format } from 'date-fns';
import { HistoryEntryType } from '@deenruv/admin-types';
import { EllipsisVerticalIcon, Pencil, Trash } from 'lucide-react';

interface DeleteEntryDialogProps {
  data: OrderHistoryEntryType[] | undefined;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedNote: Dispatch<SetStateAction<OrderHistoryEntryType | undefined>>;
}

export const Timeline: React.FC<DeleteEntryDialogProps> = ({
  data,
  setIsEditOpen,
  setIsDeleteOpen,
  setSelectedNote,
}) => {
  const { t } = useTranslation('common');

  return (
    <TimelineWrapper positions="left" className="mt-4 w-full">
      {data?.map((history) => (
        <TimelineItem key={history.id} status="done" className="w-full">
          <TimelineHeading side="right" className="w-full">
            <div className="flex w-full items-center justify-between">
              <div>
                {history.administrator?.firstName} {history.administrator?.lastName}{' '}
                <span className="text-muted-foreground text-sm">
                  {t(`history.createdAt`, { value: format(new Date(history.createdAt), 'dd.MM.yyyy hh:mm') })}{' '}
                  {history.createdAt !== history.updatedAt &&
                    t(`history.updatedAt`, { value: format(new Date(history.updatedAt), 'dd.MM.yyyy hh:mm') })}
                </span>
              </div>
              {history.type === HistoryEntryType.ORDER_NOTE || history.type === HistoryEntryType.CUSTOMER_NOTE ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <EllipsisVerticalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIsEditOpen(true);
                          setSelectedNote(history);
                        }}
                        className="flex w-full justify-start gap-2"
                      >
                        <Pencil className="h-4 w-4" /> {t('history.edit')}
                      </Button>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setIsDeleteOpen(true);
                          setSelectedNote(history);
                        }}
                        className="flex w-full justify-start gap-2"
                      >
                        <Trash className="h-4 w-4" /> {t('history.delete')}
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  {'from' in history.data && 'to' in history.data && (
                    <>
                      <div>{t('history.from')}</div>
                      <OrderStateBadge state={history.data.from as string} />
                      <div>{t('history.to')}</div>
                      <OrderStateBadge state={history.data.to as string} />
                    </>
                  )}
                </div>
              )}
            </div>
          </TimelineHeading>
          <TimelineDot status="done" />
          <TimelineLine done />
          <TimelineContent className="relative">
            <div className="flex flex-col">
              <div>
                {t(`history.entryType.${history.type}`)}{' '}
                {history.type === HistoryEntryType.ORDER_NOTE || history.type === HistoryEntryType.CUSTOMER_NOTE ? (
                  <>
                    -{' '}
                    <span className={cn(history.isPublic ? 'text-yellow-600' : 'text-green-600')}>
                      {t(history.isPublic ? 'history.public' : 'history.private')}
                    </span>
                  </>
                ) : null}
              </div>
              {history.type === HistoryEntryType.ORDER_NOTE ||
                (history.type === HistoryEntryType.CUSTOMER_NOTE && (
                  <span className="text-muted-foreground max-h-[250px] overflow-y-auto whitespace-pre border border-red-200">
                    {history.data?.note as string}
                  </span>
                ))}
              {'paymentId' in history.data ? (
                <div className="flex flex-col gap-2">
                  <Label>{t('history.paymentId', { value: history.data.paymentId as string })}</Label>
                </div>
              ) : null}
              {'fulfillmentId' in history.data ? (
                <div className="flex flex-col gap-2">
                  <Label>{t('history.fulfillmentId', { value: history.data.fulfillmentId as string })}</Label>
                </div>
              ) : null}
            </div>
          </TimelineContent>
        </TimelineItem>
      ))}
    </TimelineWrapper>
  );
};
