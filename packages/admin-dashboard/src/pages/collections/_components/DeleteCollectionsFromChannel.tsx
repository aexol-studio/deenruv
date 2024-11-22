import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  apiClient,
  useSettings,
} from '@deenruv/react-ui-devkit';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface DeleteCollectionsFromChannel {
  collectionsToRemove: { id: string; name: string }[];
  refetchCollections: () => void;
  onClose: () => void;
}

export const DeleteCollectionsFromChannel: React.FC<DeleteCollectionsFromChannel> = ({
  refetchCollections,
  collectionsToRemove,
  onClose,
}) => {
  const { t } = useTranslation('collections');
  const { selectedChannel } = useSettings();
  const removeCollectionsFromChannel = async () => {
    try {
      if (selectedChannel?.id) {
        await apiClient('mutation')({
          removeCollectionsFromChannel: [
            {
              input: {
                collectionIds: collectionsToRemove.map((c) => c.id),
                channelId: selectedChannel.id,
              },
            },
            { __typename: true },
          ],
        });
        toast.success(t('deleteCollectionsFromChannel.removeSuccess'));
        refetchCollections();
        return;
      }
      toast.error(t('deleteCollectionsFromChannel.removeError'));
    } catch (e) {
      console.log(e);
      toast.error(t('deleteCollectionsFromChannel.removeError'));
    } finally {
      onClose();
    }
  };
  return (
    <DialogContent className="">
      <DialogHeader className="pt-6">
        <DialogTitle>{t('deleteCollectionsFromChannel.areYouSure', { channel: selectedChannel?.code })}</DialogTitle>
        <DialogDescription>
          {collectionsToRemove.map((i) => (
            <div key={i.id}>- {i.name}</div>
          ))}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={onClose} variant="ghost">
            {t('deleteCollectionsFromChannel.cancel')}
          </Button>
        </DialogClose>
        <Button onClick={removeCollectionsFromChannel} variant="destructive">
          {t('deleteCollectionsFromChannel.removeCollection')}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
