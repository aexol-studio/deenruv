import { cn, SimpleTooltip, useServer } from '@deenruv/react-ui-devkit';
import React, { useEffect, useMemo } from 'react';

export const SystemStatusIndicator = () => {
  const { status, jobQueues, fetchStatus, fetchPendingJobs } = useServer(
    ({ status, jobQueues, fetchPendingJobs, fetchStatus }) => ({
      fetchPendingJobs,
      fetchStatus,
      status,
      jobQueues,
    }),
  );

  const runningJobQueues = useMemo(() => jobQueues.filter((jQ) => jQ.running), [jobQueues]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchPendingJobs();
    const interval = setInterval(fetchPendingJobs, 5000); // Auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  const colorClass = useMemo(() => {
    switch (status.data.status) {
      case 'ok':
        return 'bg-green-600';
      default:
        return 'bg-red-500';
    }
  }, [status]);

  return (
    <div className="flex">
      <SimpleTooltip content={`Status: ${status.data.status}`}>
        <div className={cn('ml-2 size-2 rounded-full', colorClass)}></div>
      </SimpleTooltip>
      {runningJobQueues.length > 0 && (
        <SimpleTooltip content={`Job Queues: ${runningJobQueues.length}`}>
          <div className={cn('ml-2 size-2 animate-pulse rounded-full bg-blue-500')}></div>
        </SimpleTooltip>
      )}
    </div>
  );
};
