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
        <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
      </div>

      <div className="relative">
        <Progress value={progress} className="h-2" />
        {showCheck && (
          <div className="absolute top-1/2 right-0 -translate-x-1 -translate-y-1/2 animate-in text-primary fade-in">
            <CheckCircle2 size={16} />
          </div>
        )}
      </div>
    </div>
  );
};
