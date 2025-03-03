import { FromSelectorWithScalars } from '@/graphql/scalars.js';
import { JobState, scalars, Selector } from '@deenruv/admin-types';
import {
  apiClient,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  formatDate,
  ListTable,
  useDetailList,
} from '@deenruv/react-ui-devkit';
import { ColumnDef, useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { AlertCircle, CheckCircle, CheckCircle2, Clock, MoreHorizontal, Play, RefreshCw, XCircle } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';

const JobSelector = Selector('Job')({
  id: true,
  data: true,
  attempts: true,
  createdAt: true,
  duration: true,
  error: true,
  isSettled: true,
  progress: true,
  queueName: true,
  result: true,
  retries: true,
  settledAt: true,
  startedAt: true,
  state: true,
});
type JobType = FromSelectorWithScalars<typeof JobSelector, 'Job'>;
const calculateDuration = (startedAt: string | null | undefined, settledAt: string | null | undefined) => {
  if (!startedAt) return '-';
  const start = new Date(startedAt);
  const end = settledAt ? new Date(settledAt) : new Date();
  const durationMs = end.getTime() - start.getTime();

  if (durationMs < 1000) return `${durationMs}ms`;
  if (durationMs < 60000) return `${Math.floor(durationMs / 1000)}s`;
  return `${Math.floor(durationMs / 60000)}m ${Math.floor((durationMs % 60000) / 1000)}s`;
};

const JobStateBadge = ({ state }: { state: JobState }) => {
  switch (state) {
    case JobState.PENDING:
      return (
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" /> Pending
        </Badge>
      );
    case JobState.RUNNING:
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Play className="h-3 w-3" /> Running
        </Badge>
      );
    case JobState.COMPLETED:
      return (
        <Badge className="flex items-center gap-1 bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3" /> Completed
        </Badge>
      );
    case JobState.RETRYING:
      return (
        <Badge className="flex items-center gap-1 bg-yellow-100 text-yellow-800">
          <RefreshCw className="h-3 w-3" /> Retrying
        </Badge>
      );
    case JobState.FAILED:
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="h-3 w-3" /> Failed
        </Badge>
      );
    case JobState.CANCELLED:
      return (
        <Badge variant="outline" className="flex items-center gap-1 bg-gray-100 text-gray-800">
          <AlertCircle className="h-3 w-3" /> Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{state}</Badge>;
  }
};

export const Jobs = () => {
  const { objects, refetch, Paginate, Search, SortButton } = useDetailList({
    type: 'jobs',
    entityName: 'Job',
    searchFields: ['type'],
    fetch: async ({ page, perPage, filter, filterOperator, sort }) => {
      const { jobs } = await apiClient('query')({
        jobs: [
          {
            options: {
              take: perPage,
              skip: (page - 1) * perPage,
              // ONLY THIS WORKS (SO WE CAN FILTER ONLY BY SELECTED FULL QUEUE NAME)
              // filter: { queueName: { eq: '' } },
              filterOperator,
            },
          },
          { items: JobSelector, totalItems: true },
        ],
      });
      return jobs;
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRemoveJob = async (jobId: string) => {
    await apiClient('mutation')({ cancelJob: [{ jobId }, {}] });
  };

  const columns = useMemo<ColumnDef<JobType>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <div className="max-w-[120px] truncate font-mono text-xs" title={row.original.id}>
            {row.original.id}
          </div>
        ),
      },
      {
        accessorKey: 'queueName',
        header: 'Queue',
        cell: ({ row }) => <div className="font-medium">{row.original.queueName}</div>,
      },
      {
        accessorKey: 'state',
        header: 'Status',
        cell: ({ row }) => {
          const state = row.original.state;
          return <JobStateBadge state={state} />;
        },
      },
      {
        accessorKey: 'progress',
        header: 'Progress',
        cell: ({ row }) => {
          const progress = row.original.progress || 0;
          return (
            <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-2.5 rounded-full bg-blue-600"
                style={{ width: `${progress}%` }}
                title={`${progress}%`}
              ></div>
            </div>
          );
        },
      },
      {
        accessorKey: 'attempts',
        header: 'Attempts',
        cell: ({ row }) => (
          <div className="text-center">
            {row.original.attempts}/{row.original.retries + 1}
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Created',
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        accessorKey: 'startedAt',
        header: 'Started',
        cell: ({ row }) => formatDate(row.original.startedAt || ''),
      },
      {
        accessorKey: 'settledAt',
        header: 'Completed',
        cell: ({ row }) => formatDate(row.original.settledAt || ''),
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
        cell: ({ row }) => {
          const duration = calculateDuration(row.original.startedAt, row.original.settledAt);
          return <div className="text-center">{duration}</div>;
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const job = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleRemoveJob(job.id)} className="text-red-600">
                  <XCircle className="mr-2 h-4 w-4" />
                  Remove Job
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    columns,
    data: objects || [],
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Jobs</CardTitle>
          {Search}
        </div>
      </CardHeader>
      <CardContent>
        <ListTable {...{ columns, isFiltered: false, table, Paginate }} />
      </CardContent>
    </Card>
  );
};
