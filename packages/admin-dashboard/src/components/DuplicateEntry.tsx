import { Button, DialogClose, DialogContent, DialogFooter } from '@deenruv/react-ui-devkit';
import { apiCall } from '@/graphql/client';
import { useSettings } from '@/state';
import { ValueTypes } from '@deenruv/admin-types';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface DeleteCollectionsFromChannel extends PropsWithChildren {
  inputs: ValueTypes['DuplicateEntityInput'][];
  onClose: () => void;
  onSuccess?: () => void;
  processNewEntities?: (input: string[]) => void;
}

export const DuplicateEntity: React.FC<DeleteCollectionsFromChannel> = ({
  inputs,
  onClose,
  onSuccess,
  processNewEntities,
  children,
}) => {
  const { t } = useTranslation('collections');
  const { selectedChannel } = useSettings();
  const removeCollectionsFromChannel = async () => {
    try {
      if (selectedChannel?.id) {
        const res = await Promise.all(
          inputs.map(async (input) => {
            const singleRes = await apiCall()('mutation')({
              duplicateEntity: [
                { input },
                {
                  __typename: true,
                  '...on DuplicateEntityError': { message: true, __typename: true },
                  '...on DuplicateEntitySuccess': { newEntityId: true, __typename: true },
                },
              ],
            });
            return singleRes.duplicateEntity;
          }),
        );
        const withError = res.filter((singleRes) => singleRes.__typename === 'DuplicateEntityError') as {
          message: string;
        }[];

        const withSuccess = res.filter((singleRes) => singleRes.__typename === 'DuplicateEntitySuccess') as {
          newEntityId: string;
        }[];

        if (withError.length) {
          withError.forEach((error) => toast.error(error.message));
          return;
        }

        if (withSuccess.length) {
          processNewEntities && processNewEntities(withSuccess.map((entity) => entity.newEntityId));
          toast.success('Duplikacja zakończona sukcesem');
          onSuccess && onSuccess();
          return;
        }
      }
    } catch (e) {
      console.log(e);
      toast.error('Nie udało się dokonać duplikacji');
    } finally {
      onClose();
    }
  };
  return (
    <DialogContent>
      {children}
      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={onClose} variant="ghost">
            {t('deleteCollectionDialog.cancel')}
          </Button>
        </DialogClose>
        <Button onClick={removeCollectionsFromChannel} variant="action">
          Duplikuj
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};
