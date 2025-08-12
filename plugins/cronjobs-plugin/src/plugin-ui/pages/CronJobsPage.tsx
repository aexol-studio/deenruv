import {
  Button,
  createDialogFromComponent,
  DetailList,
  DialogComponentProps,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  LoadingMask,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useLazyQuery,
  useMutation,
  useQuery,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import React, { useEffect, useMemo, useState } from "react";
import {
  GetCronJobs,
  GetJobQueues,
  GetCronJobsConfig,
} from "../graphql/queries";
import {
  CreateCronJob,
  RemoveCronJob,
  UpdateCronJob,
} from "../graphql/mutations";
import { toast } from "sonner";
import { Permission } from "@deenruv/admin-types";
import { InfoIcon } from "lucide-react";
import { TRANSLATION_NAMESPACE } from "../constants";
import { CronSchedule } from "../components/CronSchedule";

// Simple cron validation regex
const CRON_REGEX =
  /^(\*|([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])|\*\/([0-9]|1[0-9]|2[0-9]|3[0-9]|4[0-9]|5[0-9])) (\*|([0-9]|1[0-9]|2[0-3])|\*\/([0-9]|1[0-9]|2[0-3])) (\*|([1-9]|1[0-9]|2[0-9]|3[0-1])|\*\/([1-9]|1[0-9]|2[0-9]|3[0-1])) (\*|([1-9]|1[0-2])|\*\/([1-9]|1[0-2])) (\*|([0-6])|\*\/([0-6]))$/;

export function CronJobDialog({
  close,
  resolve,
  data: { row },
}: DialogComponentProps<
  { name: string; schedule: string },
  { row?: { name: string; schedule: string } }
>) {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  const { t: tCommon } = useTranslation("common");
  const { data, loading } = useQuery(GetJobQueues);
  const { data: config } = useQuery(GetCronJobsConfig);
  const [selectedQueue, setSelectedQueue] = useState<string>(row?.name || "");
  const [schedule, setSchedule] = useState<string>(row?.schedule || "");
  const [customSchedule, setCustomSchedule] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const CRON_PRESETS = useMemo(() => config?.cronJobsConfig?.presets, [config]);
  const isValidCron = (cron: string) => {
    return CRON_REGEX.test(cron);
  };

  useEffect(() => {
    if (row) {
      const isPreset = CRON_PRESETS?.some(
        (preset) => preset.value === row.schedule,
      );
      const isCustom = !isPreset && row.schedule !== "";
      setCustomSchedule(isCustom);
    }
  }, [row, CRON_PRESETS]);

  const handleSubmit = () => {
    if (!selectedQueue) {
      toast.error(t("Wybierz kolejkę zadań"));
      return;
    }

    if (!schedule) {
      toast.error(t("Wybierz harmonogram"));
      return;
    }

    if (!isValidCron(schedule)) {
      toast.error(t("Nieprawidłowy format harmonogramu"));
      return;
    }

    setIsSubmitting(true);
    resolve({ name: selectedQueue, schedule });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("Utwórz nowe zadanie cron")}</DialogTitle>
        <DialogDescription>
          {t("Skonfiguruj nowe zadanie cron")}
        </DialogDescription>
      </DialogHeader>
      <ScrollArea className="h-full w-full">
        <div className="gap-6 py-4 w-full h-full px-6 flex flex-col">
          <div className="grid gap-2">
            <Label htmlFor="queue">{t("Lista kolejek zadań")}</Label>
            <Select
              value={selectedQueue}
              onValueChange={setSelectedQueue}
              disabled={!!row}
            >
              <SelectTrigger id="queue" className="w-full">
                <SelectValue placeholder={t("Wybierz kolejkę zadań")} />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <SelectItem value="loading" disabled>
                    {t("Ładowanie kolejek zadań...")}
                  </SelectItem>
                ) : (
                  <>
                    {config?.cronJobsConfig?.suggestedJobs &&
                      config.cronJobsConfig?.suggestedJobs?.length > 0 && (
                        <>
                          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                            {t("Sugerowane")}
                          </div>
                          {config.cronJobsConfig.suggestedJobs.map((job) => (
                            <SelectItem key={`suggested-${job}`} value={job}>
                              {job}
                            </SelectItem>
                          ))}
                          <div className="my-1 h-px bg-muted" />
                          <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                            {t("Wszystkie kolejki")}
                          </div>
                        </>
                      )}

                    {data?.jobQueues
                      .filter(
                        (queue) =>
                          !config?.cronJobsConfig?.suggestedJobs?.includes(
                            queue.name,
                          ),
                      )
                      .map((queue) => (
                        <SelectItem key={queue.name} value={queue.name}>
                          {queue.name}
                        </SelectItem>
                      ))}
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="schedule">
                {t("Harmonogram (wyrażenie cron)")}
              </Label>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <InfoIcon className="h-4 w-4" />
                      <span className="sr-only">
                        {t("Informacje odnośnie wyrażenia cronjoba")}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    <p>
                      {t("Standardowy syntax cron")}
                      <br />
                      <code>* * * * *</code>
                      <br />
                      {t("syntaxExample")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {customSchedule ? (
              <div className="space-y-2">
                <Input
                  id="schedule"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="* * * * *"
                  className={
                    schedule && !isValidCron(schedule) ? "border-red-500" : ""
                  }
                />
                {schedule && !isValidCron(schedule) && (
                  <p className="text-sm text-red-500">
                    {t("Nieprawidłowy format harmonogramu")}
                  </p>
                )}
                <Button
                  variant="link"
                  className="px-0"
                  onClick={() => setCustomSchedule(false)}
                >
                  {t("Użyj predefiniowanego harmonogramu")}
                </Button>
                <CronSchedule
                  defaultValue={schedule}
                  onChange={setSchedule}
                  isValid={isValidCron(schedule)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Select value={schedule} onValueChange={setSchedule}>
                  <SelectTrigger id="schedule-preset" className="w-full">
                    <SelectValue
                      placeholder={t("Wybierz predefiniowany harmonogram")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {CRON_PRESETS?.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value}>
                        {preset.default
                          ? t(preset.label)
                          : tCommon(preset.label)}{" "}
                        ({preset.value})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="link"
                  className="px-0"
                  onClick={() => setCustomSchedule(true)}
                >
                  {t("Użyj własnego harmonogramu")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
      <DialogFooter className="flex mt-auto">
        <Button variant="outline" onClick={close}>
          {t("Anuluj")}
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {t("Utwórz zadanie")}
        </Button>
      </DialogFooter>
    </>
  );
}

export const CronJobsPage = () => {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
  const [list] = useLazyQuery(GetCronJobs);
  const [create] = useMutation(CreateCronJob);
  const [edit] = useMutation(UpdateCronJob);
  const [remove] = useMutation(RemoveCronJob);

  return (
    <DetailList
      entityName=""
      tableId="cronjobs-table"
      createPermissions={[Permission.SuperAdmin]}
      deletePermissions={[Permission.SuperAdmin]}
      hideColumns={["id", "createdAt", "updatedAt"]}
      searchFields={[]}
      refetchTimeout={60000}
      fetch={async ({ page, perPage, filter, filterOperator, sort }) => {
        const { cronJobs } = await list({ input: { take: perPage } });
        return cronJobs;
      }}
      onRemove={async (_jobs) => {
        try {
          const jobs = _jobs.map(
            (
              //eslint-disable-next-line @typescript-eslint/no-explicit-any
              job: any,
            ) => ({
              name: job.name,
              schedule: job.schedule,
            }),
          );
          await remove({ jobs });
          return true;
        } catch {
          return false;
        }
      }}
      route={{
        create: async (refetch) => {
          const { name, schedule } = await createDialogFromComponent(
            CronJobDialog,
            {},
            { className: "max-w-[1200px] h-[700px] flex flex-col gap-4" },
          );
          if (!name) {
            toast.error(t("Nie wybrano kolejki zadań"));
            return;
          }
          await create({ input: { jobQueueName: name, schedule } });
          toast.success(t("Utworzono zadanie cron"));
          refetch();
        },
        edit: async (_, row, refetch) => {
          const { name, schedule } = await createDialogFromComponent(
            CronJobDialog,
            { row: row.original },
            { className: "max-w-[1200px] h-[700px] flex flex-col gap-4" },
          );
          if (!name) {
            toast.error(t("Nie wybrano kolejki zadań"));
            return;
          }
          await edit({ job: { name, schedule } });
          toast.success(t("Zaktualizowano zadanie cron"));
          refetch();
        },
      }}
    />
  );
};
