import { FromSelectorWithScalars } from '@/graphql/scalars.js';
import { JsonPopup } from '@/pages/status/_components/JsonPopup.js';
import { FilterToolbar } from '@/pages/status/_components/FilterToolbar.js';
import { JobState, Selector } from '@deenruv/admin-types';
import {
  apiClient,
  Badge,
  Button,
  CardIcons,
  ColumnView,
  CustomCard,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  formatDate,
  ListTable,
  TableLabel,
  useDetailListHook,
  useTranslation,
} from '@deenruv/react-ui-devkit';
import { ColumnDef, useReactTable, getCoreRowModel } from '@tanstack/react-table';
import { AlertCircle, CheckCircle, Clock, MoreHorizontal, Play, RefreshCw, XCircle } from 'lucide-react';
import { useMemo, useState } from 'react';
import { JobResultPopover } from '@/pages/status/_components/JobResultPopover.js';

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
  if (!startedAt) return '—';
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
          <Clock className="size-3" /> {t('jobs.states.pending')}
        </Badge>
      );
    case JobState.RUNNING:
      return (
        <Badge variant="secondary" className="gap-1">
          <Play className="size-3" /> {t('jobs.states.running')}
        </Badge>
      );
    case JobState.COMPLETED:
      return (
        <Badge className="gap-1 bg-green-100 text-green-800">
          <CheckCircle className="size-3" /> {t('jobs.states.completed')}
        </Badge>
      );
    case JobState.RETRYING:
      return (
        <Badge className="gap-1 bg-yellow-100 text-yellow-800">
          <RefreshCw className="size-3" /> {t('jobs.states.retrying')}
        </Badge>
      );
    case JobState.FAILED:
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="size-3" /> {t('jobs.states.failed')}
        </Badge>
      );
    case JobState.CANCELLED:
      return (
        <Badge variant="outline" className="gap-1 bg-gray-100 text-gray-800">
          <AlertCircle className="size-3" /> {t('jobs.states.cancelled')}
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
  const { objects, refetch, Paginate, Search } = useDetailListHook({
    searchFields: ['queueName'],
    fetch: async ({ page, perPage, filter, filterOperator }) => {
      const { jobs } = await apiClient('query')({
        jobs: [
          {
            options: {
              take: perPage,
              skip: (page - 1) * perPage,
              filter: { ...filter },
              filterOperator,
            },
          },
          { items: JobSelector, totalItems: true },
        ],
      });
      return jobs;
    },
  });

  //TODO: FIXME (PAGINATION BUG)
  // useEffect(() => {
  //   refetch(filterObj);

  //   if (!liveUpdate) return () => clearInterval(0);

  //   const interval = setInterval(() => {
  //     refetch(filterObj);
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, [filterObj, liveUpdate]);

  const handleRemoveJob = async (jobId: string) => {
    await apiClient('mutation')({ cancelJob: [{ jobId }, {}] });
  };

  const columns = useMemo<ColumnDef<JobType>[]>(
    () => [
      {
        accessorKey: 'id',
        header: () => <TableLabel>{t('jobs.table.id')}</TableLabel>,
        cell: ({ row }) => (
          <div className="max-w-[120px] truncate font-mono text-xs" title={row.original.id}>
            {row.original.id}
          </div>
        ),
      },
      {
        accessorKey: 'queueName',
        header: () => <TableLabel>{t('jobs.table.queueName')}</TableLabel>,
        cell: ({ row }) => <div className="font-medium">{row.original.queueName}</div>,
      },
      {
        accessorKey: 'state',
        header: () => <TableLabel>{t('jobs.table.status')}</TableLabel>,
        cell: ({ row }) => {
          const state = row.original.state;
          return <JobStateBadge state={state} />;
        },
      },
      {
        accessorKey: 'createdAt',
        header: () => <TableLabel>{t('jobs.table.created')}</TableLabel>,
        cell: ({ row }) =>
          formatDate(row.original.createdAt, {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
      },
      {
        accessorKey: 'startedAt',
        header: () => <TableLabel>{t('jobs.table.started')}</TableLabel>,
        cell: ({ row }) =>
          formatDate(row.original.startedAt || '', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
      },
      {
        accessorKey: 'settledAt',
        header: () => <TableLabel>{t('jobs.table.settled')}</TableLabel>,
        cell: ({ row }) =>
          formatDate(row.original.settledAt || '', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
      },
      {
        accessorKey: 'jobData',
        header: () => <TableLabel>{t('jobs.table.jobData')}</TableLabel>,
        cell: ({ row }) => {
          return JsonPopup({
            data: row.original.data,
          });
        },
      },
      {
        accessorKey: 'duration',
        header: () => <TableLabel>{t('jobs.table.duration')}</TableLabel>,
        cell: ({ row }) => {
          const duration = calculateDuration(row.original.startedAt, row.original.settledAt);
          return <div>{duration}</div>;
        },
      },
      {
        accessorKey: 'jobResult',
        header: () => <TableLabel>{t('jobs.table.jobResult')}</TableLabel>,
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
                <Button variant="ghost" className="size-8 p-0">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleRemoveJob(job.id)} className="text-red-600">
                  <XCircle className="mr-2 size-4" />
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
    <CustomCard
      title={t('jobs.title')}
      color="orange"
      icon={<CardIcons.check />}
      upperRight={
        <div className="flex items-center gap-2">
          <FilterToolbar
            {...{ Search, setStateFilter, stateFilter, jobQueueFilter, setJobQueueFilter, liveUpdate, setLiveUpdate }}
          />
          <ColumnView table={table} entityName="Job" />
        </div>
      }
    >
      <ListTable {...{ columns, isFiltered: false, table, Paginate, tableId: 'jobs-list-view' as any }} />
    </CustomCard>
  );
};
