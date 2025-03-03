import { JobState } from '@deenruv/admin-types';
import { capitalizeFirstLetter, Checkbox, JobQueue, Option, SimpleSelect, useServer } from '@deenruv/react-ui-devkit';
import React, { ReactNode } from 'react';

interface FilterToolbarProps {
  Search: ReactNode;
  stateFilter: JobState | undefined;
  setStateFilter: (state: JobState) => void;
  jobQueueFilter: string | undefined;
  setJobQueueFilter: (jobQueue: string) => void;
  liveUpdate: boolean;
  setLiveUpdate: (liveUpdate: boolean) => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  Search,
  stateFilter,
  setStateFilter,
  jobQueueFilter,
  setJobQueueFilter,
  liveUpdate,
  setLiveUpdate,
}) => {
  const { jobQueues } = useServer();
  const jobStatesOptions = [
    { label: 'All states', value: 'undefined' },
    ...Object.entries(JobState).map(([key, value]) => ({
      label: capitalizeFirstLetter(key),
      value,
      color:
        value === JobState.COMPLETED
          ? 'green'
          : value === JobState.RETRYING
            ? 'goldenrod'
            : value === JobState.FAILED
              ? 'firebrick'
              : undefined,
    })),
  ];
  const jobQueuesOptions: Option[] = [
    { label: 'All names', value: 'undefined' },
    ...jobQueues.map((q) => ({
      label: q.name,
      value: q.name,
    })),
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center space-x-2">
        <Checkbox id="live-update" checked={liveUpdate} onCheckedChange={setLiveUpdate} />
        <label
          htmlFor="live-update"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Live update
        </label>
      </div>
      <SimpleSelect
        placeholder="All states"
        options={jobStatesOptions}
        value={stateFilter}
        onValueChange={setStateFilter}
        wrapperClassName="w-[160px]"
        className="h-8"
      />
      <SimpleSelect
        placeholder="All names"
        options={jobQueuesOptions}
        value={jobQueueFilter}
        onValueChange={setJobQueueFilter}
        wrapperClassName="w-[160px]"
        className="h-8"
      />
      {/* {Search} */}
    </div>
  );
};
