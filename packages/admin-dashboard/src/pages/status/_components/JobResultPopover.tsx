'use client';
import { FileText } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger, Button } from '@deenruv/react-ui-devkit';
import { useTranslation } from 'react-i18next';

interface JobResultProps {
  result:
    | {
        success: boolean;
        indexedItemCount: number;
        timeTaken: number;
      }
    | undefined;
}

export function JobResultPopover({ result }: JobResultProps) {
  const { t } = useTranslation('system');
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size={'sm'} className="bg-muted/50 flex h-8 items-center gap-2 rounded-full">
          <FileText className="size-4" />
          <span>{t('jobs.table.jobResult')}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-4">
        <div className="space-y-2 text-sm">
          <div className="flex items-start">
            <span className="mr-1">success:</span>
            <span className={result?.success ? 'font-medium text-green-600' : 'font-medium text-red-600'}>
              {result?.success?.toString()}
            </span>
          </div>
          <div>
            <span className="mr-1">indexedItemCount:</span>
            <span className="font-medium">{result?.indexedItemCount}</span>
          </div>
          <div>
            <span className="mr-1">timeTaken:</span>
            <span className="font-medium">{result?.timeTaken}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
