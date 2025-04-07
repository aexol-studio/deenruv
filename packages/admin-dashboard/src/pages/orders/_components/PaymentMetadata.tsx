import {
  Button,
  TableCell,
  DialogHeader,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@deenruv/react-ui-devkit';
import { FileText } from 'lucide-react';

export const MetadataDisplay = ({ metadata }: { metadata: any }) => {
  return metadata && Object.keys(metadata).length > 0 ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <FileText className="size-4" />
          <span>View</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5 text-teal-500" />
            Payment Metadata
          </DialogTitle>
          <DialogDescription>Additional information associated with this payment</DialogDescription>
        </DialogHeader>
        <div className="bg-muted/50 mt-4 rounded-md border p-4">
          <div className="max-h-[300px] overflow-auto">
            {Object.entries(metadata).map(([key, value]) => (
              <div key={key} className="border-border mb-3 border-b pb-2 last:border-0">
                <div className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">{key}</div>
                <div className="break-all font-mono text-sm">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  ) : null;
};
