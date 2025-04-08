'use client';
import { JsonExplorer } from '@/pages/status/_components/JsonExplorer.js';
import {
  useTranslation,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from '@deenruv/react-ui-devkit';

interface JsonPopupProps {
  data: Record<string, any>;
}

export function JsonPopup({ data }: JsonPopupProps) {
  const { t } = useTranslation('system');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'sm'} variant="outline" className="h-8">
          {t('jobs.table.jobData')}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t('jobs.table.jobData')}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          <JsonExplorer data={data} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
