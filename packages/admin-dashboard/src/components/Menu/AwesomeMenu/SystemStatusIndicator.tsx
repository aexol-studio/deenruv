import { useServer } from '@deenruv/react-ui-devkit';
import React, { useEffect } from 'react';

export const SystemStatusIndicator = () => {
  const { status, pendingJobs, fetchStatus, fetchPendingJobs } = useServer(
    ({ status, pendingJobs, fetchPendingJobs, fetchStatus }) => ({
      fetchPendingJobs,
      fetchStatus,
      status,
      pendingJobs,
    }),
  );

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

  return <div></div>;
};
