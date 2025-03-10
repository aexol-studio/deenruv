import { FromSelectorWithScalars } from '@/graphql/scalars.js';
import { JsonPopup } from '@/pages/status/_components/JsonPopup.js';
import { FilterToolbar } from '@/pages/status/_components/FilterToolbar.js';
import { JobState, Selector } from '@deenruv/admin-types';
import {
  apiClient,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ColumnView,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  formatDate,
  ListTable,
  useDetailList,
} from '@deenruv/react-ui-devkit';
import { ColumnDef, useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { AlertCircle, CheckCircle, Clock, MoreHorizontal, Play, RefreshCw, XCircle } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { JobResultPopover } from '@/pages/status/_components/JobResultPopover.js';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('system');
  switch (state) {
    case JobState.PENDING:
      return (
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" /> {t('jobs.states.pending')}
        </Badge>
      );
    case JobState.RUNNING:
      return (
        <Badge variant="secondary" className="gap-1">
          <Play className="h-3 w-3" /> {t('jobs.states.running')}
        </Badge>
      );
    case JobState.COMPLETED:
      return (
        <Badge className="gap-1 bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3" /> {t('jobs.states.completed')}
        </Badge>
      );
    case JobState.RETRYING:
      return (
        <Badge className="gap-1 bg-yellow-100 text-yellow-800">
          <RefreshCw className="h-3 w-3" /> {t('jobs.states.retrying')}
        </Badge>
      );
    case JobState.FAILED:
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="h-3 w-3" /> {t('jobs.states.failed')}
        </Badge>
      );
    case JobState.CANCELLED:
      return (
        <Badge variant="outline" className="gap-1 bg-gray-100 text-gray-800">
          <AlertCircle className="h-3 w-3" /> {t('jobs.states.cancelled')}
        </Badge>
      );
    default:
      return <Badge variant="outline">{state}</Badge>;
  }
};

export const Jobs = () => {
  const { t } = useTranslation('system');
  const [liveUpdate, setLiveUpdate] = useState(true);
  const [stateFilter, setStateFilter] = useState<JobState | undefined>();
  const [jobQueueFilter, setJobQueueFilter] = useState<string>();
  const filterObj = useMemo(
    () => ({
      state: { eq: stateFilter },
      queueName: { eq: jobQueueFilter },
    }),
    [stateFilter, jobQueueFilter],
  );
  const {
    objects,
    refetch,
    Paginate,
    Search,
    filter: filter2,
  } = useDetailList({
    type: 'jobs',
    entityName: 'Job',
    searchFields: ['queueName'],
    fetch: async ({ page, perPage, filter, filterOperator }) => {
      const { jobs } = await apiClient('query')({
        jobs: [
          {
            options: {
              take: perPage,
              skip: (page - 1) * perPage,
              // ONLY THIS WORKS (SO WE CAN FILTER ONLY BY SELECTED FULL QUEUE NAME)
              // filter: { queueName: { eq: '' } },
              filter: {
                ...filter,
              },
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
    refetch(filterObj);

    if (!liveUpdate) return () => clearInterval(0);

    const interval = setInterval(() => {
      refetch(filterObj);
    }, 5000);

    return () => clearInterval(interval);
  }, [filterObj, liveUpdate]);

  const handleRemoveJob = async (jobId: string) => {
    await apiClient('mutation')({ cancelJob: [{ jobId }, {}] });
  };

  const columns = useMemo<ColumnDef<JobType>[]>(
    () => [
      {
        accessorKey: 'id',
        header: t('jobs.table.id'),
        cell: ({ row }) => (
          <div className="max-w-[120px] truncate font-mono text-xs" title={row.original.id}>
            {row.original.id}
          </div>
        ),
      },
      {
        accessorKey: 'queueName',
        header: t('jobs.table.queueName'),
        cell: ({ row }) => <div className="font-medium">{row.original.queueName}</div>,
      },
      {
        accessorKey: 'state',
        header: t('jobs.table.status'),
        cell: ({ row }) => {
          const state = row.original.state;
          return <JobStateBadge state={state} />;
        },
      },
      {
        accessorKey: 'createdAt',
        header: t('jobs.table.created'),
        cell: ({ row }) => formatDate(row.original.createdAt),
      },
      {
        accessorKey: 'startedAt',
        header: t('jobs.table.started'),
        cell: ({ row }) => formatDate(row.original.startedAt || ''),
      },
      {
        accessorKey: 'settledAt',
        header: t('jobs.table.settled'),
        cell: ({ row }) => formatDate(row.original.settledAt || ''),
      },
      {
        accessorKey: 'jobData',
        header: t('jobs.table.jobData'),
        cell: ({ row }) => {
          return JsonPopup({
            data: row.original.data,
          });
        },
      },
      {
        accessorKey: 'duration',
        header: t('jobs.table.duration'),
        cell: ({ row }) => {
          const duration = calculateDuration(row.original.startedAt, row.original.settledAt);
          return <div>{duration}</div>;
        },
      },
      {
        accessorKey: 'jobResult',
        header: t('jobs.table.jobResult'),
        cell: ({ row }) => {
          return JobResultPopover({
            result: row.original.result,
          });
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
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleRemoveJob(job.id)} className="text-red-600">
                  <XCircle className="mr-2 h-4 w-4" />
                  {t('jobs.table.removeJob')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
        size: 28,
        minSize: 28,
        maxSize: 28,
        meta: {
          isFixedWidth: true,
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
          <CardTitle>{t('jobs.title')}</CardTitle>
          <div className="flex items-center gap-2">
            <FilterToolbar
              {...{ Search, setStateFilter, stateFilter, jobQueueFilter, setJobQueueFilter, liveUpdate, setLiveUpdate }}
            />
            <ColumnView {...table} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ListTable {...{ columns, isFiltered: false, table, Paginate }} />
      </CardContent>
    </Card>
  );
};
