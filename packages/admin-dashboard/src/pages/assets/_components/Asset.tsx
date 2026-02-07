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
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  apiClient,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useServer,
  EntityCustomFields,
  useTranslation,
  TableLabel,
} from '@deenruv/react-ui-devkit';
import { type AssetType, assetsSelector } from '@/graphql/base';
import { DeletionResult } from '@deenruv/admin-types';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip';
import { format } from 'date-fns';
import type React from 'react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Copy, ExternalLink, MoreHorizontal, Pencil, Trash } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('preview');
  const hasEntityCustomFields = !!useServer((p) =>
    p.serverConfig?.entityCustomFields?.find(
      (el) => el.entityName.charAt(0).toLowerCase() + el.entityName.slice(1) === 'asset',
    ),
  )?.customFields.length;

  const tableData = [
    {
      header: <TableLabel>{t('assets:detailsTable.id', 'ID')}</TableLabel>,
      render: assetDetails?.id,
    },
    {
      header: <TableLabel>{t('assets:detailsTable.name', 'Name')}</TableLabel>,
      render: <Input value={assetName} onChange={(e) => setAssetName(e.target.value)} />,
    },
    {
      header: <TableLabel>{t('assets:detailsTable.fileSize', 'File Size')}</TableLabel>,
      render: assetDetails?.fileSize && assetDetails.fileSize / 1000 + 'kB',
    },
    {
      header: <TableLabel>{t('assets:detailsTable.createdAt', 'Created At')}</TableLabel>,
      render: assetDetails?.createdAt && format(new Date(assetDetails.createdAt), 'yyyy-MM-dd, HH:ss'),
    },
    {
      header: <TableLabel>{t('assets:detailsTable.size', 'Dimensions')}</TableLabel>,
      render: assetDetails?.width && assetDetails?.height ? `${assetDetails.width}px x ${assetDetails.height}px` : '-',
    },
    {
      header: <TableLabel>{t('assets:detailsTable.source', 'Source')}</TableLabel>,
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
          className="group relative h-52 w-40 overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md"
          onClick={() => getAsset()}
        >
          <div className="absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/5" />

          <div className="absolute top-2 right-2 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  size="sm"
                  variant="ghost"
                  className="size-8 rounded-full bg-background/80 p-0 opacity-0 shadow-sm backdrop-blur-sm group-hover:opacity-100"
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
                  <span>{t('common:copyURL', 'Copy URL')}</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(asset.preview, '_blank');
                  }}
                  className="gap-2"
                >
                  <ExternalLink size={14} />
                  <span>{t('common:open', 'Open')}</span>
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
                  className="gap-2 text-destructive"
                >
                  <Trash size={14} />
                  <span>{t('common:delete', 'Delete')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="aspect-square bg-muted/30">
            {isLoading && <Skeleton className="size-full" />}
            <img
              src={`${asset.preview}?preset=tile`}
              alt={asset.name}
              className="size-full object-cover transition-all duration-300"
              style={{ opacity: isLoading ? 0 : 1 }}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />
          </div>

          <Tooltip>
            <TooltipTrigger className="block w-full truncate p-3 text-left text-sm font-medium" title={asset.name}>
              {asset.name}
            </TooltipTrigger>
            <TooltipContent className="z-50 rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md">
              {asset.name}
            </TooltipContent>
          </Tooltip>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{asset.name}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="preview">{t('common:preview')}</TabsTrigger>
            <TabsTrigger value="details">{t('common:details')}</TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4">
            <div className="relative flex h-[500px] items-center justify-center overflow-hidden rounded-lg p-4">
              <div
                className="absolute inset-0 bg-[#f0f0f0]"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
                    linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
                    linear-gradient(-45deg, transparent 75%, #e0e0e0 75%)
                  `,
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                }}
              />

              <div className="pointer-events-none absolute inset-0 rounded-lg border border-border" />

              <img
                src={assetDetails?.source ? `${assetDetails.source}?preset=medium` : asset.preview}
                alt={asset.name}
                className="relative z-10 max-h-full max-w-full rounded object-contain shadow-md"
              />
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <div className="grid h-[492px] gap-6 md:grid-cols-2">
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableBody>
                    {tableData.map((d, i) => (
                      <TableRow key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                        <TableCell className="w-1/3 font-medium">{d.header}</TableCell>
                        <TableCell className="break-all">{d.render}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {hasEntityCustomFields && (
                <div>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-medium">
                    <Pencil size={16} />
                    {t('common:customFields')}
                  </h3>
                  <div className="rounded-lg border p-4">
                    <EntityCustomFields entityName="asset" id={asset?.id} />
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex justify-between">
          <Button variant="destructive" onClick={() => onDelete()}>
            {t('assets:delete', 'Delete')}
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onClose()}>
              {t('common:cancel', 'Cancel')}
            </Button>
            <Button onClick={() => onEditName()}>{t('common:save', 'Save')}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
