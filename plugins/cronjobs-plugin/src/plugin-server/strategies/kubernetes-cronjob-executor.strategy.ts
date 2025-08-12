import { Injector, Logger, RequestContext } from "@deenruv/core";
import { CronJobsExecutorStrategy, CronJobsPluginOptions } from "../types.js";
import { ModelTypes } from "../zeus/index.js";
import { CRONJOBS_PLUGIN_OPTIONS } from "../constants.js";

export async function importEsmModule<T>(name: string): Promise<T> {
  const module = eval(`(async () => {return await import("${name}")})()`);
  return module as T;
}

export class KubernetesCronJobExecutor implements CronJobsExecutorStrategy {
  private coreApi: Awaited<ReturnType<typeof this.createClientSet>>["coreApi"];
  private batchApi: Awaited<
    ReturnType<typeof this.createClientSet>
  >["batchApi"];
  private context: Awaited<ReturnType<typeof this.createClientSet>>["context"];
  private readonly namespace: string | undefined;
  private readonly log: (message: string) => void;
  private readonly host: string;
  private readonly scheme: "http" | "https";
  private readonly secretName = "deenruv-cronjobs-secret";
  private readonly managedByLabel = "DeenruvCronJobsPlugin";
  private initialized = false;

  private async createClientSet() {
    const client = await importEsmModule<
      //prettier-ignore
      typeof import("@kubernetes/client-node", { with: { "resolution-mode": "import" } })
    >("@kubernetes/client-node");
    const kubeConfig = new client.KubeConfig();
    if (process.env.NODE_ENV === "production") kubeConfig.loadFromCluster();
    else kubeConfig.loadFromDefault();

    const context = kubeConfig.getContextObject(kubeConfig.currentContext);
    const namespace = context?.namespace;
    if (!context || !namespace) {
      throw new Error(
        `Kubernetes context ${kubeConfig.currentContext} not found or namespace not set`,
      );
    }
    this.log(
      `Using Kubernetes context ${kubeConfig.currentContext} in namespace ${namespace}`,
    );
    const coreApi = kubeConfig.makeApiClient(client.CoreV1Api);
    const batchApi = kubeConfig.makeApiClient(client.BatchV1Api);
    return {
      currentContext: kubeConfig.currentContext,
      context: { ...context, namespace },
      coreApi,
      batchApi,
    };
  }

  isInitialized() {
    if (!this.initialized) {
      this.log(
        `KubernetesCronJobExecutor is not initialized. Verify secret implementation.`,
      );
    }
    return this.initialized;
  }

  async init(injector: Injector) {
    const config = injector.get<CronJobsPluginOptions>(CRONJOBS_PLUGIN_OPTIONS);
    const { currentContext, context, coreApi, batchApi } =
      await this.createClientSet();
    this.coreApi = coreApi;
    this.batchApi = batchApi;
    this.context = context;

    try {
      const secret = await this.coreApi.readNamespacedSecret({
        namespace: this.namespace || context.namespace,
        name: this.secretName,
      });

      const isSecretManagedByPlugin =
        secret?.metadata?.labels?.["app.kubernetes.io/managed-by"] ===
        this.managedByLabel;
      const isSecretOwnedByCreator =
        currentContext === secret?.metadata?.labels?.["deenruv.com/owned-by"];

      if (!isSecretManagedByPlugin || !isSecretOwnedByCreator) {
        this.log(
          `Cannot work with secret ${this.secretName} because it is not owned by the plugin. Please delete it manually.`,
        );
        this.initialized = false;
        return;
      }

      if (
        secret?.data?.token &&
        Buffer.from(secret.data.token, "base64").toString("utf-8") !==
          config.controllerAuthToken
      ) {
        this.log(
          `Secret ${this.secretName} already exists, but the token is different. Updating...`,
        );
        await this.coreApi.patchNamespacedSecret({
          namespace: this.namespace || context.namespace,
          name: this.secretName,
          body: [
            {
              op: "replace",
              path: "/data/token",
              value: Buffer.from(config.controllerAuthToken).toString("base64"),
            },
          ],
        });
        this.log(`Secret ${this.secretName} updated`);
      } else {
        this.log(`Secret ${this.secretName} already exists`);
      }
      this.initialized = true;
      //eslint-disable-next-line
    } catch (e: any) {
      console.log(e);
      const body = typeof e.body === "string" ? JSON.parse(e.body) : e.body;
      const isNotFound = e.code === 404 && body?.reason === "NotFound";
      if (isNotFound) {
        this.log(`Secret ${this.secretName} does not exist, creating...`);
        const token = Buffer.from(config.controllerAuthToken).toString(
          "base64",
        );
        await this.coreApi.createNamespacedSecret({
          namespace: this.namespace || context.namespace,
          body: {
            apiVersion: "v1",
            kind: "Secret",
            metadata: {
              name: this.secretName,
              namespace: this.namespace,
              labels: {
                "app.kubernetes.io/managed-by": this.managedByLabel,
                "deenruv.com/owned-by": currentContext,
              },
            },
            type: "Opaque",
            data: { token },
          },
        });
        this.log(`Secret ${this.secretName} created`);
        this.initialized = true;
      }
    }
  }

  constructor(args: {
    namespace?: string;
    scheme: "http" | "https";
    host: string;
    debug?: boolean;
  }) {
    this.namespace = args.namespace;
    this.log = args.debug
      ? (message: string) => new Logger().log(message, "KubernetesCronJob")
      : () => {};
    this.host = args.host;
    this.scheme = args.scheme;
  }

  async listJobs(ctx: RequestContext, args: ModelTypes["CronJobsListInput"]) {
    if (!this.isInitialized()) {
      return { items: [], totalItems: 0 };
    }
    const { take: _take } = args;
    const take = _take || 10;
    const { items } = await this.batchApi.listNamespacedCronJob({
      namespace: this.namespace || this.context.namespace,
      labelSelector: `app.kubernetes.io/managed-by=${this.managedByLabel}`,
      limit: take,
    });
    const result =
      items?.map(({ metadata, spec, status }) => ({
        name: metadata?.name || "",
        schedule: spec?.schedule || "",
        lastScheduleTime: new Date(status?.lastScheduleTime || 0).toISOString(),
        lastSuccessfulTime: new Date(
          status?.lastSuccessfulTime || 0,
        ).toISOString(),
        channelToken: metadata?.labels?.["deenruv.com/channel"] || "",
      })) || [];
    return { items: result, totalItems: result?.length || 0 };
  }

  private generateName(args: ModelTypes["CronJobCreateInput"]) {
    const maxLen = 32;
    const suffix = Math.random().toString(36).substring(2, 10);
    let name = `${args.jobQueueName}-${suffix}`;
    if (name.length > maxLen) {
      const allowedSuffixLen = maxLen - args.jobQueueName.length - 1;
      name = `${args.jobQueueName}-${suffix.substring(0, allowedSuffixLen)}`;
    }
    return name;
  }

  async createJob(
    ctx: RequestContext,
    args: ModelTypes["CronJobCreateInput"] & { controllerPath: string },
  ) {
    if (!this.isInitialized()) return;
    const name = this.generateName(args);
    await this.batchApi.createNamespacedCronJob({
      namespace: this.namespace || this.context.namespace,
      body: {
        apiVersion: "batch/v1",
        kind: "CronJob",
        metadata: {
          name,
          namespace: this.namespace,
          labels: {
            "deenruv.com/queue": args.jobQueueName,
            "deenruv.com/channel": ctx.channel.token,
            "app.kubernetes.io/managed-by": this.managedByLabel,
          },
        },
        spec: {
          schedule: args.schedule,
          jobTemplate: {
            spec: {
              template: {
                spec: {
                  containers: [
                    {
                      name: "curl",
                      image: "curlimages/curl",
                      imagePullPolicy: "IfNotPresent",
                      env: [
                        {
                          name: "TOKEN",
                          valueFrom: {
                            secretKeyRef: {
                              name: this.secretName,
                              key: "token",
                            },
                          },
                        },
                      ],
                      command: [
                        "sh",
                        "-c",
                        `curl --fail "${this.scheme}://${this.host}${args.controllerPath}?token=$TOKEN"`,
                      ],
                    },
                  ],
                  restartPolicy: "OnFailure",
                },
              },
            },
          },
        },
      },
    });
  }

  async updateJob(ctx: RequestContext, job: ModelTypes["CronJob"]) {
    if (!this.isInitialized()) return;
    await this.batchApi.patchNamespacedCronJob({
      name: job.name,
      namespace: this.namespace || this.context.namespace,
      body: [
        {
          op: "replace",
          path: "/spec/schedule",
          value: job.schedule,
        },
      ],
    });
  }

  async removeJobs(ctx: RequestContext, jobs: ModelTypes["CronJob"][]) {
    if (!this.isInitialized()) return;
    for (const job of jobs) {
      await this.batchApi.deleteNamespacedCronJob({
        name: job.name,
        namespace: this.namespace || this.context.namespace,
      });
    }
  }
}
