'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  apiClient,
} from '@deenruv/react-ui-devkit';
import { DeletionResult } from '@deenruv/admin-types';
import type React from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Copy, ExternalLink, MoreHorizontal, Pencil, Trash } from 'lucide-react';

interface AssetListViewProps {
  assets: Array<{
    name: string;
    preview: string;
    id: string;
  }>;
  onAssetChange: () => void;
}

export const AssetListView: React.FC<AssetListViewProps> = ({ assets, onAssetChange }) => {
  const { t } = useTranslation(['common', 'assets']);

  const copyAssetUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success(t('assets:urlCopied', 'Asset URL copied to clipboard'));
  };

  const onDelete = useCallback(
    async (assetId: string) => {
      const { deleteAsset } = await apiClient('mutation')({
        deleteAsset: [{ input: { assetId } }, { message: true, result: true }],
      });
      if (deleteAsset.result === DeletionResult.DELETED) {
        toast.success(t('assets:deleteSuccess', 'Asset deleted successfully'));
        onAssetChange();
      } else toast.error(t('assets:deleteFail', 'Failed to delete asset') + ': ' + deleteAsset.message);
    },
    [onAssetChange, t],
  );

  if (assets.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border p-8 text-center">
        <div className="bg-muted/50 mb-4 rounded-full p-6">
          <Pencil size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No assets found</h3>
        <p className="text-muted-foreground mt-2 text-sm">Upload some assets or try a different filter</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="bg-muted/30 grid grid-cols-[auto_1fr_auto] gap-4 p-3 text-sm font-medium">
        <div className="w-16 text-center">{t('assets:preview')}</div>
        <div>{t('assets:name')}</div>
        <div className="w-24 text-center">{t('assets:actions')}</div>
      </div>

      <div className="divide-y">
        {assets.map((asset) => (
          <div
            key={asset.id}
            className="hover:bg-muted/10 grid grid-cols-[auto_1fr_auto] items-center gap-4 p-3 transition-colors"
          >
            <div className="bg-muted/20 h-16 w-16 overflow-hidden rounded">
              <img src={`${asset.preview}?preset=tile`} alt={asset.name} className="h-full w-full object-cover" />
            </div>

            <div className="truncate font-medium" title={asset.name}>
              {asset.name}
            </div>

            <div className="flex items-center gap-1">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => copyAssetUrl(asset.preview)}>
                <Copy size={16} />
                <span className="sr-only">{t('assets:copyURL')}</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={() => window.open(asset.preview, '_blank')}
              >
                <ExternalLink size={16} />
                <span className="sr-only">{t('assets:open')}</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal size={16} />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                  <DropdownMenuItem onClick={() => copyAssetUrl(asset.preview)} className="gap-2">
                    <Copy size={14} />
                    <span>{t('assets:copyURL', 'Copy URL')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.open(asset.preview, '_blank')} className="gap-2">
                    <ExternalLink size={14} />
                    <span>{t('assets:open', 'Open')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(asset.id)} className="text-destructive gap-2">
                    <Trash size={14} />
                    <span>{t('assets:delete', 'Delete')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
