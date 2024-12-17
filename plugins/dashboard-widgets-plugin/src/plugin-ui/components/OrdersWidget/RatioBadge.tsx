import { cn } from '@deenruv/react-ui-devkit';
import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

interface RatioBadgeProps {
  ratio?: number;
}
export const RatioBadge: React.FC<RatioBadgeProps> = ({ ratio }) => {
  if (ratio === 0 || !ratio) return null;
  return (
    <div
      className={cn(
        'text-[0.75rem] w-max flex gap-1 items-center p-1 rounded-sm text-white dark:text-foreground',
        {
          'bg-[#006600] dark:bg-[#032513]': ratio > 0,
          'bg-[#990000] dark:bg-[#250303]': ratio < 0,
        },
      )}
    >
      <span>{`${ratio}%`}</span>
      {ratio > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
    </div>
  );
};
