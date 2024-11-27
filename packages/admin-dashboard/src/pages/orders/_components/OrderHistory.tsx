import { EllipsisVerticalIcon, Pencil, Trash } from 'lucide-react';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Label,
  Textarea,
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
  OrderStateBadge,
  apiClient,
  cn,
} from '@deenruv/react-ui-devkit';
import { OrderHistoryEntryType } from '@/graphql/draft_order';

import { DeletionResult, HistoryEntryType, ModelTypes } from '@deenruv/admin-types';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { useOrder } from '@/state/order';

export const OrderHistory: React.FC = () => {
  const {
    order,
    orderHistory: { data, error, loading },
    fetchOrderHistory,
  } = useOrder();
  const { t } = useTranslation('orders');

  const [newNote, setNewNote] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<OrderHistoryEntryType | undefined>();

  const addMessageToOrder = async () => {
    if (!order) return;

    const { addNoteToOrder } = await apiClient('mutation')({
      addNoteToOrder: [{ input: { id: order.id, isPublic: !isPrivate, note: newNote } }, { id: true }],
    });
    if (addNoteToOrder?.id) {
      await fetchOrderHistory();
      setNewNote('');
    } else {
      toast.error(t('history.addError'), { position: 'top-center' });
    }
  };

  const deleteMessageFromOrder = async (id: string) => {
    const { deleteOrderNote } = await apiClient('mutation')({
      deleteOrderNote: [{ id }, { message: true, result: true }],
    });
    if (deleteOrderNote.result === DeletionResult.DELETED) {
      await fetchOrderHistory();
    } else {
      toast.error(t('history.deleteError', { value: deleteOrderNote.message }), { position: 'top-center' });
    }
  };
  const editMessageInOrder = (input: ModelTypes['UpdateOrderNoteInput']) => {
    apiClient('mutation')({ updateOrderNote: [{ input }, { id: true }] })
      .then(() => fetchOrderHistory())
      .catch(() => toast.error(t('history.editError'), { position: 'top-center' }));
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="customSpinner" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        {t('toasts.orderHistoryLoadingError', { value: order?.id })}
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('history.title')}</CardTitle>
        <CardDescription>{t('history.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Label htmlFor="comment">{t('history.addCommentButton')}</Label>
          <div className="mb-2 flex flex-row gap-4">
            <Textarea
              id="comment"
              onKeyUp={(e) => {
                e.currentTarget.style.height = '1px';
                e.currentTarget.style.height = 12 + e.currentTarget.scrollHeight + 'px';
              }}
              value={newNote}
              onChange={(e) => setNewNote(e.currentTarget.value)}
              className="h-min max-h-[300px] min-h-[36px] w-full resize-none overflow-auto rounded-md p-2"
            />
            <Button disabled={newNote === ''} size="sm" onClick={addMessageToOrder}>
              {t('history.addComment')}
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="isPublic" name="isPublic" checked={isPrivate} onClick={() => setIsPrivate((p) => !p)} />
            <Label htmlFor="isPublic" className="cursor-pointer">
              {t('history.isPrivate')}
              <span className="ml-2 text-gray-500">{t('history.isPrivateDescription')}</span>
            </Label>
            <Label className={cn('ml-auto', isPrivate ? 'text-green-600' : 'text-yellow-600')}>
              {t(isPrivate ? 'history.toAdmins' : 'history.toAdminsAndCustomer')}
            </Label>
          </div>
        </div>

        <Timeline positions="left" className="mt-4 w-full">
          {data.map((history) => (
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
                  {history.type === HistoryEntryType.ORDER_NOTE ? (
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
                    {history.type === HistoryEntryType.ORDER_NOTE ? (
                      <>
                        -{' '}
                        <span className={cn(history.isPublic ? 'text-yellow-600' : 'text-green-600')}>
                          {t(history.isPublic ? 'history.public' : 'history.private')}
                        </span>
                      </>
                    ) : null}
                  </div>
                  {history.type === HistoryEntryType.ORDER_NOTE && (
                    <span className="text-muted-foreground max-h-[250px] overflow-y-auto whitespace-pre border border-red-200">
                      {history.data?.note as string}
                    </span>
                  )}
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
        </Timeline>
      </CardContent>
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('history.deleteNoteHeader')}</AlertDialogTitle>
            <AlertDialogDescription className="max-h-[60vh] overflow-y-auto whitespace-pre">
              {selectedNote?.data?.note as string}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('history.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedNote && deleteMessageFromOrder(selectedNote.id)}>
              {t('history.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <AlertDialogContent className="min-w-min">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('history.editNoteHeader')}</AlertDialogTitle>
          </AlertDialogHeader>
          <Textarea
            onChange={(e) =>
              setSelectedNote((p) => (p ? { ...p, data: { ...p?.data, note: e.currentTarget.value } } : undefined))
            }
            value={(selectedNote?.data.note as string) || ''}
            className="h-[60vh] w-auto min-w-[50vh] resize-none overflow-auto rounded-md p-2"
          />
          <div className="flex items-center gap-2 pb-4">
            <Checkbox
              id="isPublicEdit"
              name="isPublicEdit"
              checked={!selectedNote?.isPublic}
              onClick={() => setSelectedNote((p) => (p ? { ...p, isPublic: !p.isPublic } : undefined))}
            />
            <Label htmlFor="isPublicEdit" className="cursor-pointer">
              {t('history.isPrivate')}
              <span className="ml-2 text-gray-500">{t('history.isPrivateDescription')}</span>
            </Label>
            <Label className={cn('ml-auto', !selectedNote?.isPublic ? 'text-green-600' : 'text-yellow-600')}>
              {t(!selectedNote?.isPublic ? 'history.toAdmins' : 'history.toAdminsAndCustomer')}
            </Label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('history.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              disabled={(selectedNote?.data.note as string) === ''}
              onClick={() =>
                selectedNote &&
                editMessageInOrder({
                  noteId: selectedNote.id,
                  isPublic: selectedNote.isPublic,
                  note: selectedNote.data.note as string,
                })
              }
            >
              {t('history.edit')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

OrderHistory.displayName = 'OrderHistory';
