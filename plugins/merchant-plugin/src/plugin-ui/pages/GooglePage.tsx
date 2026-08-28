import React, { useEffect, useState } from "react";
import {
  Label,
  Input,
  PageBlock,
  useLazyQuery,
  useMutation,
  Checkbox,
  Button,
  useTranslation,
} from "@deenruv/react-ui-devkit";
import {
  getGoogleMerchantDiagnostic,
  getGoogleMerchantSyncHistory,
  getMerchantPlatformSettings,
  GoogleMerchantDiagnostic,
  MerchantSyncRunSummary,
} from "../graphql/queries";
import {
  removeOrphanItems,
  saveMerchantPlatformSettings,
  sendAllProductsToMerchantPlatform,
} from "../graphql/mutations";
import { toast } from "sonner";
import { translationNS } from "../translation-ns.js";

export const GooglePage = () => {
  const { t, i18n } = useTranslation(translationNS);
  const [fetchMerchantPlatformSettings] = useLazyQuery(
    getMerchantPlatformSettings,
  );
  const [fetchMerchantPlatformInfo] = useLazyQuery(getGoogleMerchantDiagnostic);
  const [fetchSyncHistory] = useLazyQuery(getGoogleMerchantSyncHistory);
  const [mutate] = useMutation(saveMerchantPlatformSettings);
  const [removeOldItems] = useMutation(removeOrphanItems);
  const [sendAllProducts] = useMutation(sendAllProductsToMerchantPlatform);
  const [diagnostic, setDiagnostic] = useState<GoogleMerchantDiagnostic | null>(
    null,
  );
  const [syncHistory, setSyncHistory] = useState<MerchantSyncRunSummary[]>([]);
  const [serviceInfo, setServiceInfo] = useState({
    productsCount: 0,
    connectionStatus: false,
  });

  const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        try {
          const jsonObject = JSON.parse(result);
          setSettingsForm({
            ...settingsForm,
            credentials: JSON.stringify(jsonObject),
          });
        } catch (error) {
          console.error("Invalid JSON file:", error);
          toast.error(t("google.invalidCredentialsFile"));
        }
      };
      reader.onerror = (e) => {
        console.error("Error reading file", e);
        toast.error(t("google.credentialsReadFailed"));
      };
      if (file) reader.readAsText(file);
    }
  };
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    brand: "",
    merchantId: "",
    dataSource: "",
    contentLanguage: "pl",
    feedLabel: "PL",
    credentials: "",
    autoUpdate: true,
    firstSync: true,
  });

  const refetch = async () => {
    try {
      setIsLoading(true);
      setLoadError(false);
      const [settingsData, infoData, historyData] = await Promise.all([
        fetchMerchantPlatformSettings({ platform: "google" }),
        fetchMerchantPlatformInfo(),
        fetchSyncHistory({ take: 10 }),
      ]);
      const settings =
        settingsData?.getMerchantPlatformSettings?.entries?.reduce(
          (acc, { key, value }) => {
            if (key === "brand") {
              acc.brand = value;
            }
            if (key === "merchantId") {
              acc.merchantId = value;
            }
            if (key === "dataSource") {
              acc.dataSource = value;
            }
            if (key === "contentLanguage") {
              acc.contentLanguage = value;
            }
            if (key === "feedLabel") {
              acc.feedLabel = value;
            }
            if (key === "credentials") {
              acc.credentials = value;
            }
            if (key === "autoUpdate") {
              acc.autoUpdate = value === "true";
            }
            if (key === "firstSync") {
              acc.firstSync = value === "true";
            }
            return acc;
          },
          {} as {
            brand: string;
            merchantId: string;
            dataSource: string;
            contentLanguage: string;
            feedLabel: string;
            credentials: string;
            autoUpdate: boolean;
            firstSync: boolean;
          },
        );
      setSettingsForm((prev) => ({ ...prev, ...settings }));
      const currentDiagnostic = infoData?.getMerchantPlatformInfo?.[0];
      setDiagnostic(currentDiagnostic ?? null);
      setSyncHistory(historyData?.getMerchantSyncHistory ?? []);
      setServiceInfo({
        productsCount: currentDiagnostic?.productsCount || 0,
        connectionStatus: currentDiagnostic?.isValidConnection || false,
      });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setLoadError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { saveMerchantPlatformSettings } = await mutate({
        input: {
          platform: "google",
          entries: Object.entries(settingsForm).map(([key, value]) => ({
            key,
            value: (value as string).toString(),
          })),
        },
      });
      if (saveMerchantPlatformSettings) {
        toast.success(t("common.settingsSaved"));
        refetch();
      } else {
        toast.error(t("common.settingsSaveFailed"));
      }
    } catch (error) {
      console.error(error);
      toast.error(
        t("common.settingsSaveFailedWithError", {
          message:
            error instanceof Error ? error.message : t("common.unknownError"),
        }),
      );
    }
  };

  return (
    <PageBlock>
      <div
        style={{ position: "relative" }}
        className="flex flex-col p-4 relative max-w-[800px] mx-auto"
      >
        {isLoading && (
          <div
            role="status"
            aria-label={t("common.loading")}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 10,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderBottomRightRadius: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "42px",
                height: "42px",
              }}
              className="spinner"
            />
          </div>
        )}
        <h2 className="mb-4 text-xl font-semibold">{t("google.title")}</h2>
        {loadError ? (
          <div
            className="mb-4 rounded border border-red-400 p-3 text-red-700"
            role="alert"
          >
            {t("common.settingsLoadFailed")}
          </div>
        ) : null}
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex justify-between gap-4">
            <div className="w-full flex flex-col gap-2">
              <Label>{t("common.brand")}</Label>
              <Input
                className="w-full"
                value={settingsForm.brand}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, brand: e.target.value })
                }
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label>{t("google.merchantId")}</Label>
              <Input
                className="w-full"
                required
                value={settingsForm.merchantId}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    merchantId: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <Label>{t("google.dataSource")}</Label>
            <Input
              className="w-full"
              placeholder="accounts/{merchantId}/dataSources/{id}"
              required
              value={settingsForm.dataSource}
              onChange={(e) =>
                setSettingsForm({
                  ...settingsForm,
                  dataSource: e.target.value,
                })
              }
            />
          </div>
          <div className="flex justify-between gap-4">
            <div className="w-full flex flex-col gap-2">
              <Label>{t("google.contentLanguage")}</Label>
              <Input
                required
                value={settingsForm.contentLanguage}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    contentLanguage: e.target.value,
                  })
                }
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <Label>{t("google.feedLabel")}</Label>
              <Input
                required
                value={settingsForm.feedLabel}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    feedLabel: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <Label>{t("google.credentials")}</Label>
              <Input
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  background: "none",
                }}
                type="file"
                accept=".json"
                onChange={handleSelectedFile}
              />
            </div>
            <div className="flex gap-2 items-center">
              <Checkbox
                id="google-account-credentials"
                checked={settingsForm.autoUpdate}
                onCheckedChange={(checked) =>
                  setSettingsForm({
                    ...settingsForm,
                    autoUpdate: typeof checked === "boolean" ? checked : false,
                  })
                }
              />
              <Label htmlFor="google-account-credentials">
                {t("common.autoUpdate")}
              </Label>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Label htmlFor="auto-update-on-products-change">
                  {t("common.updateAllOnSave")}
                </Label>
                <Checkbox
                  id="auto-update-on-products-change"
                  checked={settingsForm.firstSync}
                  onCheckedChange={(checked) =>
                    setSettingsForm({
                      ...settingsForm,
                      firstSync: typeof checked === "boolean" ? checked : false,
                    })
                  }
                />
              </div>
              <Button>{t("common.save")}</Button>
            </div>
          </div>
        </form>
        <div className="flex gap-2">
          <span>{t("common.connectionStatus")}</span>
          <strong>
            {serviceInfo.connectionStatus
              ? t("common.connected")
              : t("common.disconnected")}
          </strong>
        </div>
        <div className="flex gap-2">
          <span>{t("common.productsCount")}</span>
          <span>{serviceInfo.productsCount}</span>
        </div>
        <div className="flex flex-col gap-1 text-sm">
          <h3 className="font-semibold">{t("google.diagnostics.title")}</h3>
          <span>
            {t("google.diagnostics.status")}:{" "}
            {diagnostic?.connectionStatus ?? t("google.diagnostics.unknown")}
          </span>
          <span>
            {t("google.diagnostics.dataSourceVerified")}:{" "}
            {diagnostic?.dataSourceVerified
              ? t("google.diagnostics.yes")
              : t("google.diagnostics.no")}
          </span>
          <span>
            {t("google.diagnostics.latency")}: {diagnostic?.latencyMs ?? 0} ms
          </span>
          <span>
            {t("google.diagnostics.disapprovedProducts")}:{" "}
            {diagnostic?.disapprovedProductsCount ?? 0}
          </span>
          <span>
            {t("google.diagnostics.productIssues")}:{" "}
            {diagnostic?.issuesCount ?? 0}
          </span>
          {diagnostic?.lastError ? (
            <div className="rounded border border-red-400 p-2 text-red-700">
              {diagnostic.lastError.code}: {diagnostic.lastError.message}
            </div>
          ) : null}
          {(diagnostic?.issues ?? []).slice(0, 20).map((issue) => (
            <div
              className="rounded border border-amber-400 p-2"
              key={`${issue.offerId}-${issue.code}`}
            >
              {issue.offerId} · {issue.severity} · {issue.code}:{" "}
              {issue.description}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            type="button"
            onClick={async () => {
              await refetch();
              toast.success(t("google.diagnostics.completed"));
            }}
          >
            {t("google.diagnostics.test")}
          </Button>
          <Button
            type="button"
            onClick={async () => {
              try {
                await sendAllProducts({ platform: "google" });
                toast.success(t("google.sync.queued"));
                await refetch();
              } catch (error) {
                console.error(error);
                toast.error(t("google.sync.queueFailed"));
              }
            }}
          >
            {t("google.sync.all")}
          </Button>
        </div>
        {serviceInfo.connectionStatus ? (
          <div className="mt-8">
            <Button
              onClick={async () => {
                try {
                  await removeOldItems({ platform: "google" });
                  toast.success(t("google.sync.cleanupQueued"));
                  refetch();
                } catch (error) {
                  console.error(error);
                  toast.error(t("google.sync.cleanupQueueFailed"));
                }
              }}
            >
              {t("common.removeOldItems")}
            </Button>
          </div>
        ) : null}
        <div className="mt-8 flex flex-col gap-2">
          <h3 className="font-semibold">{t("google.sync.recent")}</h3>
          {syncHistory.length === 0 ? (
            <span>{t("google.sync.empty")}</span>
          ) : (
            syncHistory.map((run) => (
              <div className="rounded border p-2 text-sm" key={run.id}>
                <div>
                  {run.status} · {run.succeeded}/{run.total}{" "}
                  {t("google.sync.successful")} · {run.failed}{" "}
                  {t("google.sync.failed")}
                </div>
                <div>
                  {new Date(run.createdAt).toLocaleString(i18n.language)}
                </div>
                {run.errorSummary ? (
                  <div className="text-red-700">{run.errorSummary}</div>
                ) : null}
                {run.items
                  .filter((item) => item.status === "FAILED")
                  .slice(0, 20)
                  .map((item) => (
                    <div
                      className="mt-1 text-red-700"
                      key={`${run.id}-${item.offerId}-${item.operation}`}
                    >
                      {item.offerId} · {item.errorCode ?? "ERROR"} ·{" "}
                      {t("google.sync.attempts")}: {item.attempts} ·{" "}
                      {item.errorMessage}
                    </div>
                  ))}
              </div>
            ))
          )}
        </div>
      </div>
    </PageBlock>
  );
};
