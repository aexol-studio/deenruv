'use client';

import type React from 'react';

import type { OrderHistoryEntryType } from '@/graphql/draft_order';
import type { Dispatch, SetStateAction } from 'react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Timeline as TimelineWrapper,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
  OrderStateBadge,
  cn,
  Badge,
  useTranslation,
  useOrder,
  OrderLineType,
} from '@deenruv/react-ui-devkit';
import { format } from 'date-fns';
import { HistoryEntryType } from '@deenruv/admin-types';
import {
  EllipsisVerticalIcon,
  Pencil,
  Trash,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  Clock,
  ArrowRightLeft,
  CreditCard,
  Package,
  User,
} from 'lucide-react';
import { ModifyHistoryInfo } from './ModifyHistoryInfo.js';

interface DeleteEntryDialogProps {
  data: OrderHistoryEntryType[] | undefined;
  setIsEditOpen: Dispatch<SetStateAction<boolean>>;
  setIsDeleteOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedNote: Dispatch<SetStateAction<OrderHistoryEntryType | undefined>>;
}

// Helper function to get icon based on history entry type
const getEntryTypeIcon = (type: HistoryEntryType, isPublic: boolean) => {
  switch (type) {
    case HistoryEntryType.ORDER_STATE_TRANSITION:
      return <ArrowRightLeft className="size-4 text-blue-500" />;
    case HistoryEntryType.ORDER_PAYMENT_TRANSITION:
      return <CreditCard className="size-4 text-purple-500" />;
    case HistoryEntryType.ORDER_FULFILLMENT:
      return <Package className="size-4 text-green-500" />;
    case HistoryEntryType.ORDER_NOTE:
      return isPublic ? (
        <MessageCircle className="size-4 text-amber-500" />
      ) : (
        <ShieldAlert className="size-4 text-emerald-500" />
      );
    case HistoryEntryType.CUSTOMER_NOTE:
      return <User className="size-4 text-indigo-500" />;
    default:
      return <Clock className="size-4 text-gray-500" />;
  }
};

export const Timeline: React.FC<DeleteEntryDialogProps> = ({
  data,
  setIsEditOpen,
  setIsDeleteOpen,
  setSelectedNote,
}) => {
  const { t } = useTranslation('common');
  const { order } = useOrder();

  return (
    <div className="rounded-md border bg-card p-4">
      <h3 className="mb-4 font-medium">{t('history.timeline')}</h3>
      <TimelineWrapper positions="left" className="w-full">
        {data?.map((history) => {
          const entryIcon = getEntryTypeIcon(history.type, history.isPublic);
          const isNote =
            history.type === HistoryEntryType.ORDER_NOTE || history.type === HistoryEntryType.CUSTOMER_NOTE;
          const modificationNote =
            history.type === HistoryEntryType.ORDER_MODIFIED
              ? order?.modifications.find((m) => m.id === history.data.modificationId)?.note
              : '';

          return (
            <TimelineItem key={history.id} status="done" className="w-full pb-6">
              <TimelineHeading side="right" className="w-full">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    {history.administrator ? (
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                          <span className="text-xs font-medium">
                            {history.administrator.firstName?.[0]}
                            {history.administrator.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">
                            {history.administrator?.firstName} {history.administrator?.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(history.createdAt), 'MMM d, yyyy • h:mm a')}
                            {Math.floor(new Date(history.createdAt).getTime() / 1000) !==
                              Math.floor(new Date(history.updatedAt).getTime() / 1000) && (
                              <span className="ml-1 italic">{t('history.edited')}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(history.createdAt), 'MMM d, yyyy • h:mm a')}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isNote && (
                      <Badge
                        variant={history.isPublic ? 'secondary' : 'outline'}
                        className={cn(
                          'gap-1',
                          history.isPublic
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                            : 'border-emerald-200 text-emerald-800 dark:border-emerald-800 dark:text-emerald-300',
                        )}
                      >
                        {history.isPublic ? (
                          <>
                            <MessageCircle className="size-3" />
                            {t('history.public', 'Public')}
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="size-3" />
                            {t('history.private', 'Private')}
                          </>
                        )}
                      </Badge>
                    )}

                    {isNote ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <EllipsisVerticalIcon className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setIsEditOpen(true);
                              setSelectedNote(history);
                            }}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <Pencil className="size-4" /> {t('history.edit', 'Edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setIsDeleteOpen(true);
                              setSelectedNote(history);
                            }}
                            className="flex cursor-pointer items-center gap-2 text-red-600"
                          >
                            <Trash className="size-4" /> {t('history.delete', 'Delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : 'modificationId' in history.data ? (
                      <ModifyHistoryInfo modificationId={history.data.modificationId} />
                    ) : (
                      'from' in history.data &&
                      'to' in history.data && (
                        <div className="flex items-center gap-2">
                          <OrderStateBadge state={history.data.from as string} />
                          <ArrowRightLeft className="size-4 text-muted-foreground" />
                          <OrderStateBadge state={history.data.to as string} />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </TimelineHeading>

              <TimelineDot status="done" className="bg-primary" />
              <TimelineLine done className="bg-muted" />

              <TimelineContent className="relative mt-2">
                <div className="rounded-md border bg-muted/30 p-3">
                  <div className="mb-1 flex items-center gap-2">
                    {entryIcon}
                    <span className="font-medium">
                      {t(`history.entryType.${history.type}`, history.type.replace(/_/g, ' '))}
                    </span>
                  </div>

                  {isNote && history.data?.note && (
                    <div className="mt-2 rounded-md bg-background p-3 text-sm whitespace-pre-wrap">
                      {history.data.note as string}
                    </div>
                  )}

                  {'paymentId' in history.data && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <CreditCard className="size-4 text-purple-500" />
                      <span className="font-medium">Payment ID:</span>
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        {history.data.paymentId as string}
                      </code>
                    </div>
                  )}

                  {'fulfillmentId' in history.data && (
                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <Package className="size-4 text-green-500" />
                      <span className="font-medium">Fulfillment ID:</span>
                      <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                        {history.data.fulfillmentId as string}
                      </code>
                    </div>
                  )}

                  {'modificationId' in history.data && (
                    <div className="mt-2 rounded-md bg-background p-3 text-sm whitespace-pre-wrap">
                      {modificationNote}
                    </div>
                  )}

                  {'reason' in history.data && (
                    <div>
                      <div className="mt-2 rounded-md bg-background p-3 text-sm whitespace-pre-wrap">
                        {history.data.reason}
                      </div>
                      {'lines' in history.data && (
                        <ul className="mt-2 list-disc pl-5">
                          {history.data.lines
                            .map((l: { orderLineId: string; quantity: number }) => {
                              const line = order?.lines.find((line) => line.id === l.orderLineId);
                              if (!line) return null;
                              return { line, newQuantity: l.quantity };
                            })
                            .map(({ line, newQuantity }: { line: OrderLineType; newQuantity: number }) => (
                              <li className="list-item list-disc flex-col pl-3">
                                <p key={line.id} className="text-sm">
                                  {line.productVariant.name}
                                </p>
                                <p className="flex gap-4">
                                  <span>
                                    {t('history.quantityOld')}: {line.quantity}
                                  </span>
                                  <span>
                                    {t('history.quantityNew')}: {newQuantity}
                                  </span>
                                </p>
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </TimelineWrapper>
    </div>
  );
};
