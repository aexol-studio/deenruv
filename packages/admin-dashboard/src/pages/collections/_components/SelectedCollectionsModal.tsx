import { Row } from '@tanstack/react-table';
import React from 'react';

import { CollectionListType } from '@/graphql/collections';
import { MoveCollectionsToCollections } from './MoveCollectionsToCollections.js';
import { CollectionAction } from '../consts.js';
import { MoveCollectionsToChannels } from './MoveCollectionsToChannels.js';
import { DeleteCollectionsFromChannel } from './DeleteCollectionsFromChannel.js';

import { ValueTypes } from '@deenruv/admin-types';
import { DialogHeader } from '@/components';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';
import { DuplicateEntity } from '@/components/DuplicateEntry';

interface SelectedCollectionsModalProps {
  selectedCollections: Row<CollectionListType>[];
  allCollections: Row<CollectionListType>[];
  refetchCollections: () => void;
  collectionAction?: keyof typeof CollectionAction;
  onClose: () => void;
}

export const SelectedCollectionsModalContent: React.FC<SelectedCollectionsModalProps> = ({
  collectionAction,
  allCollections,
  selectedCollections,
  refetchCollections,
  onClose,
}) => {
  const { t } = useTranslation('collections');
  switch (collectionAction) {
    case 'MOVE':
      return (
        <MoveCollectionsToCollections
          onClose={onClose}
          {...{ allCollections, selectedCollections, refetchCollections }}
        />
      );

    case 'ASSING_TO_CHANNGEL':
      return <MoveCollectionsToChannels onClose={onClose} {...{ selectedCollections, refetchCollections }} />;
    case 'DELETE_FROM_CHANNEL':
      return (
        <DeleteCollectionsFromChannel
          onClose={onClose}
          collectionsToRemove={selectedCollections.map((c) => ({ name: c.original.name, id: c.original.id }))}
          refetchCollections={refetchCollections}
        />
      );
    case 'COPY': {
      const inputs: ValueTypes['DuplicateEntityInput'][] = selectedCollections.map(({ original }) => ({
        entityId: original.id,
        entityName: 'Collection',
        duplicatorInput: { code: 'collection-duplicator', arguments: [] },
      }));
      return (
        <DuplicateEntity inputs={inputs} onClose={onClose} onSuccess={refetchCollections}>
          <DialogHeader>
            <DialogTitle>{t('duplicateCollection')}</DialogTitle>
            <DialogDescription>
              {selectedCollections.map(({ original }) => (
                <div key={original.id}>- {original.name}</div>
              ))}
            </DialogDescription>
          </DialogHeader>
        </DuplicateEntity>
      );
    }
    default:
      return null;
  }
};
