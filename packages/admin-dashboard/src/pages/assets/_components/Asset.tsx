'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  ScrollArea,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  apiClient,
} from '@deenruv/react-ui-devkit';
import { type AssetType, assetsSelector } from '@/graphql/base';
import { DeletionResult } from '@deenruv/admin-types';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import { format } from 'date-fns';
import type React from 'react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { EntityCustomFields, Stack } from '@/components';
import { Copy, MoreHorizontal, Pencil, Trash } from 'lucide-react';

interface AssetProps {
  asset: {
    name: string;
    preview: string;
    id: string;
  };
  onAssetChange: () => void;
}

export const Asset: React.FC<AssetProps> = ({ asset, onAssetChange }) => {
  const { t } = useTranslation(['common', 'assets']);
  const [open, setOpen] = useState(false);
  const [assetDetails, setAssetDetails] = useState<AssetType>();
  const [assetName, setAssetName] = useState(asset.name);
  const [isLoading, setIsLoading] = useState(true);

  const tableData = [
    {
      header: t('assets:detailsTable.id', 'ID'),
      render: assetDetails?.id,
    },
    {
      header: t('assets:detailsTable.name', 'Name'),
      render: <Input value={assetName} onChange={(e) => setAssetName(e.target.value)} />,
    },
    {
      header: t('assets:detailsTable.fileSize', 'File Size'),
      render: assetDetails?.fileSize && assetDetails.fileSize / 1000 + 'kB',
    },
    {
      header: t('assets:detailsTable.createdAt', 'Created At'),
      render: assetDetails?.createdAt && format(new Date(assetDetails.createdAt), 'yyyy-MM-dd, HH:ss'),
    },
    {
      header: t('assets:detailsTable.size', 'Dimensions'),
      render: assetDetails?.width && assetDetails?.height ? `${assetDetails.width}px x ${assetDetails.height}px` : '-',
    },
    {
      header: t('assets:detailsTable.source', 'Source'),
      render: assetDetails?.source,
    },
  ];

  const onClose = () => {
    setAssetDetails(undefined);
    setOpen(false);
  };

  const onEditName = useCallback(async () => {
    const { updateAsset } = await apiClient('mutation')({
      updateAsset: [{ input: { id: asset.id, name: assetName } }, { name: true }],
    });
    if (updateAsset.name) {
      toast.success(t('assets:editSuccess', 'Asset updated successfully'));
      onAssetChange();
      onClose();
    } else toast.error(t('assets:editFail', 'Failed to update asset'));
  }, [assetName, asset.id, onAssetChange, onClose, t]);

  const onDelete = useCallback(async () => {
    const { deleteAsset } = await apiClient('mutation')({
      deleteAsset: [{ input: { assetId: asset.id } }, { message: true, result: true }],
    });
    if (deleteAsset.result === DeletionResult.DELETED) {
      toast.success(t('assets:deleteSuccess', 'Asset deleted successfully'));
      onAssetChange();
      onClose();
    } else toast.error(t('assets:deleteFail', 'Failed to delete asset') + ': ' + deleteAsset.message);
  }, [asset.id, onAssetChange, onClose, t]);

  const getAsset = async () => {
    const response = await apiClient('query')({
      asset: [
        {
          id: asset.id,
        },
        assetsSelector,
      ],
    });

    if (response.asset) setAssetDetails(response.asset);
  };

  const copyAssetUrl = () => {
    navigator.clipboard.writeText(asset.preview);
    toast.success(t('assets:urlCopied', 'Asset URL copied to clipboard'));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="bg-background group relative overflow-hidden rounded-lg border transition-all hover:shadow-md"
          onClick={() => getAsset()}
        >
          <div className="absolute right-2 top-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="bg-background/80 h-8 w-8 rounded-full p-0 opacity-0 shadow-sm backdrop-blur-sm group-hover:opacity-100"
                >
                  <MoreHorizontal size={16} />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[160px]">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    copyAssetUrl();
                  }}
                  className="gap-2"
                >
                  <Copy size={14} />
                  <span>{t('common:copy', 'Copy URL')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    getAsset();
                    setOpen(true);
                  }}
                  className="gap-2"
                >
                  <Pencil size={14} />
                  <span>{t('common:edit', 'Edit')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    getAsset();
                    onDelete();
                  }}
                  className="text-destructive gap-2"
                >
                  <Trash size={14} />
                  <span>{t('common:delete', 'Delete')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="bg-muted/50 aspect-square">
            {isLoading && <Skeleton className="h-full w-full" />}
            <img
              src={`${asset.preview}?preset=tile`}
              alt={asset.name}
              className="h-full w-full object-cover transition-opacity"
              style={{ opacity: isLoading ? 0 : 1 }}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>

          <Tooltip>
            <TooltipTrigger className="block w-full truncate p-2 text-left text-xs font-medium" title={asset.name}>
              {asset.name}
            </TooltipTrigger>
            <TooltipContent className="bg-popover text-popover-foreground z-50 rounded-md border px-3 py-1.5 text-sm shadow-md">
              {asset.name}
            </TooltipContent>
          </Tooltip>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>{asset.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh]">
          <Stack className="h-full">
            <div className="w-1/2 overflow-hidden rounded-md border p-2 shadow">
              <img
                src={assetDetails?.source ? `${assetDetails.source}?preset=medium` : asset.preview}
                alt={asset.name}
                className="h-full w-full object-contain"
              />
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
            {t('assets:delete', 'Delete')}
          </Button>
          <div className="flex gap-3">
            <Button variant={'outline'} onClick={() => onEditName()}>
              {t('assets:edit', 'Edit')}
            </Button>
            <Button onClick={() => onClose()}>{t('assets:close', 'Close')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
