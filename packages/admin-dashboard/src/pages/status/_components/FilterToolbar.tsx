import { JobState } from '@deenruv/admin-types';
import { Checkbox, Option, SimpleSelect, useServer } from '@deenruv/react-ui-devkit';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('system');
  const { jobQueues } = useServer();
  const jobStatesOptions = [
    { label: t('jobs.allStates'), value: 'undefined' },
    ...Object.entries(JobState).map(([key, value]) => ({
      label: t('jobs.states.' + key.toLowerCase()),
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
    { label: t('jobs.allNames'), value: 'undefined' },
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
          {t('jobs.live')}
        </label>
      </div>
      <SimpleSelect
        placeholder={t('jobs.allStates')}
        options={jobStatesOptions}
        value={stateFilter}
        onValueChange={setStateFilter}
        wrapperClassName="w-[160px]"
        className="h-8"
      />
      <SimpleSelect
        placeholder={t('jobs.allNames')}
        options={jobQueuesOptions}
        value={jobQueueFilter}
        onValueChange={setJobQueueFilter}
        wrapperClassName="w-[160px]"
        className="h-8"
      />
    </div>
  );
};
