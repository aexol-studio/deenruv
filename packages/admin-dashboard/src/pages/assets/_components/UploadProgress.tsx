'use client';

import type React from 'react';

import { Progress } from '@deenruv/react-ui-devkit';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UploadProgressProps {
  progress: number;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (progress >= 100) {
      const timer = setTimeout(() => {
        setShowCheck(true);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setShowCheck(false);
    }
  }, [progress]);

  return (
    <div className="my-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">{progress < 100 ? 'Uploading...' : 'Upload complete'}</span>
        <span className="text-muted-foreground text-sm">{progress.toFixed(0)}%</span>
      </div>

      <div className="relative">
        <Progress value={progress} className="h-2" />
        {showCheck && (
          <div className="text-primary animate-in fade-in absolute right-0 top-1/2 -translate-x-1 -translate-y-1/2">
            <CheckCircle2 size={16} />
          </div>
        )}
      </div>
    </div>
  );
};
