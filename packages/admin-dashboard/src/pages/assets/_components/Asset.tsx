import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
} from '@deenruv/react-ui-devkit';
import { AssetType, assetsSelector } from '@/graphql/base';
import { apiCall } from '@/graphql/client';
import { DeletionResult } from '@deenruv/admin-types';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import { format } from 'date-fns';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { EntityCustomFields, Stack } from '@/components';

interface AssetProps {
  asset: {
    name: string;
    preview: string;
    id: string;
  };
  onAssetChange: () => void;
}

export const Asset: React.FC<AssetProps> = ({ asset, onAssetChange }) => {
  const { t } = useTranslation('assets');
  const [open, setOpen] = useState(false);
  const [assetDetails, setAssetDetails] = useState<AssetType>();
  const [assetName, setAssetName] = useState(asset.name);

  const tableData = [
    {
      header: t('detailsTable.id'),
      render: assetDetails?.id,
    },
    {
      header: t('detailsTable.name'),
      render: <Input value={assetName} onChange={(e) => setAssetName(e.target.value)} />,
    },
    {
      header: t('detailsTable.fileSize'),
      render: assetDetails?.fileSize && assetDetails.fileSize / 1000 + 'kB',
    },
    {
      header: t('detailsTable.createdAt'),
      render: assetDetails?.createdAt && format(assetDetails?.createdAt, 'yyyy-MM-dd, HH:ss'),
    },
    {
      header: t('detailsTable.size'),
      render: assetDetails?.width + 'px x ' + assetDetails?.height + 'px',
    },
    {
      header: t('detailsTable.source'),
      render: assetDetails?.source,
    },
  ];

  const onClose = () => {
    setAssetDetails(undefined);
    setOpen(false);
  };

  const onEditName = useCallback(async () => {
    const { updateAsset } = await apiCall()('mutation')({
      updateAsset: [{ input: { id: asset.id, name: assetName } }, { name: true }],
    });
    if (updateAsset.name) {
      toast.message(t('editSuccess'));
      onAssetChange();
      onClose();
    } else toast.error(t('editFail'));
  }, [assetName, asset.id, onAssetChange, t]);

  const onDelete = useCallback(async () => {
    const { deleteAsset } = await apiCall()('mutation')({
      deleteAsset: [{ input: { assetId: asset.id } }, { message: true, result: true }],
    });
    if (deleteAsset.result === DeletionResult.DELETED) {
      toast.message(t('deleteSuccess'));
      onAssetChange();
      onClose();
    } else toast.error(t('deleteFail') + ': ' + deleteAsset.message);
  }, [asset.id, onAssetChange, t]);

  const getAsset = async () => {
    const response = await apiCall()('query')({
      asset: [
        {
          id: asset.id,
        },
        assetsSelector,
      ],
    });

    if (response.asset) setAssetDetails(response.asset);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => getAsset()}>
        <div className="flex h-fit cursor-pointer flex-col items-center justify-between border border-solid border-gray-300 text-center dark:border-gray-700">
          <div className="relative h-28 w-28">
            <img className="absolute left-0 top-0 h-full w-full" src={asset.preview + '?preset=tiny'} />
          </div>
          <Tooltip>
            <TooltipTrigger className="w-full whitespace-nowrap bg-gray-100 p-1 text-sm dark:bg-gray-800">
              <div className="truncate">{asset.name}</div>
            </TooltipTrigger>
            <TooltipContent className="z-50 m-2 border border-solid border-gray-200 bg-gray-50 px-2 py-1 text-black">
              {asset.name}
            </TooltipContent>
          </Tooltip>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>{asset.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[40vh]">
          <Stack className="h-full">
            <div className="w-1/2 border border-solid border-gray-300 p-2 shadow">
              <img src={assetDetails?.source + '?preset=medium'} />
            </div>
            <Stack column className="w-1/2 gap-4 pl-8 pr-2">
              <div>
                <Table containerClassName="w-full">
                  <TableBody className="w-full text-base">
                    {tableData.map((d, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">{d.header}</TableCell>
                        <TableCell className="break-all">{d.render}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <EntityCustomFields entityName="asset" id={asset?.id} />
            </Stack>
          </Stack>
        </ScrollArea>
        <div className="flex justify-between">
          <Button variant={'destructive'} onClick={() => onDelete()}>
            {t('delete')}
          </Button>
          <div className="flex gap-3">
            <Button variant={'outline'} onClick={() => onEditName()}>
              {t('edit')}
            </Button>
            <Button onClick={() => onClose()}>{t('close')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
