import React, { useEffect, useState } from "react";
import {
  PageDetailLayout,
  useLazyQuery,
  useMutation,
  useInjector,
} from "@deenruv/admin-ui/react";
import { NotificationService } from "@deenruv/admin-ui/core";
import {
  removeOrphanItems,
  saveMerchantPlatformSettings,
  sendAllProductsToMerchantPlatform,
} from "../graphql/mutations";
import {
  getGoogleMerchantDiagnostic,
  getGoogleMerchantSyncHistory,
  getMerchantPlatformSettings,
  GoogleMerchantDiagnostic,
  MerchantSyncRunSummary,
} from "../graphql/queries";

export const GooglePage = () => {
  const toast = useInjector(NotificationService);
  const [fetchMerchantPlatformSettings] = useLazyQuery(
    getMerchantPlatformSettings,
  );
  const [fetchMerchantPlatformInfo] = useLazyQuery(
    getGoogleMerchantDiagnostic,
  );
  const [fetchSyncHistory] = useLazyQuery(getGoogleMerchantSyncHistory);
  const [mutate] = useMutation(saveMerchantPlatformSettings);
  const [removeOldItems] = useMutation(removeOrphanItems);
  const [sendAllProducts] = useMutation(sendAllProductsToMerchantPlatform);
  const [diagnostic, setDiagnostic] =
    useState<GoogleMerchantDiagnostic | null>(null);
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
        }
      };
      reader.onerror = (e) => {
        console.error("Error reading file", e);
      };
      if (file) reader.readAsText(file);
    }
  };
  const [isLoading, setIsLoading] = useState(true);
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
        toast.success("Settings saved successfully");
        refetch();
      } else {
        toast.error("Failed to save settings");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        `Failed to save settings: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    }
  };

  return (
    <PageDetailLayout>
      <div style={{ position: "relative" }} className="flex flex-col p-4">
        {isLoading && (
          <div
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
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <div className="flex justify-between gap-4">
            <div className="w-full flex flex-col gap-2">
              <label>Brand</label>
              <input
                className="w-full"
                value={settingsForm.brand}
                onChange={(e) =>
                  setSettingsForm({ ...settingsForm, brand: e.target.value })
                }
              />
            </div>
            <div className="w-full flex flex-col gap-2">
              <label>Merchant ID</label>
              <input
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
            <label>Data source</label>
            <input
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
              <label>Content language</label>
              <input
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
              <label>Feed label</label>
              <input
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
              <label>Google Account Credentials</label>
              <input
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
              <input
                type="checkbox"
                id="google-account-credentials"
                checked={settingsForm.autoUpdate}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    autoUpdate: e.target.checked,
                  })
                }
              />
              <label htmlFor="google-account-credentials">
                Auto update on Product's change
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <label htmlFor="auto-update-on-products-change">
                  Update ALL products with saving
                </label>
                <input
                  type="checkbox"
                  id="auto-update-on-products-change"
                  checked={settingsForm.firstSync}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      firstSync: e.target.checked,
                    })
                  }
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </div>
        </form>
        <div className="flex gap-2">
          <span>Connection status</span>
          <strong>
            {serviceInfo.connectionStatus ? "Connected" : "Disconnected"}
          </strong>
        </div>
        <div className="flex gap-2">
          <span>Products count</span>
          <span>{serviceInfo.productsCount}</span>
        </div>
        <div className="flex flex-col gap-1">
          <span>Diagnostic: {diagnostic?.connectionStatus ?? "UNKNOWN"}</span>
          <span>
            Data source verified:{" "}
            {diagnostic?.dataSourceVerified ? "yes" : "no"}
          </span>
          <span>Latency: {diagnostic?.latencyMs ?? 0} ms</span>
          <span>
            Disapproved products: {diagnostic?.disapprovedProductsCount ?? 0}
          </span>
          <span>Product issues: {diagnostic?.issuesCount ?? 0}</span>
          {diagnostic?.lastError ? (
            <div className="alert alert-danger">
              {diagnostic.lastError.code}: {diagnostic.lastError.message}
            </div>
          ) : null}
          {(diagnostic?.issues ?? []).slice(0, 20).map((issue) => (
            <div
              className="alert alert-warning"
              key={`${issue.offerId}-${issue.code}`}
            >
              {issue.offerId} · {issue.severity} · {issue.code}:{" "}
              {issue.description}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={async () => {
              await refetch();
              toast.success("Connection diagnostic completed");
            }}
          >
            Test connection
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={async () => {
              try {
                await sendAllProducts({ platform: "google" });
                toast.success("Full synchronization queued");
                await refetch();
              } catch (error) {
                console.error(error);
                toast.error("Failed to queue full synchronization");
              }
            }}
          >
            Synchronize all
          </button>
        </div>
        {serviceInfo.connectionStatus ? (
          <div style={{ marginTop: "12px" }}>
            <button
              className="btn btn-secondary"
              onClick={async () => {
                try {
                  await removeOldItems({ platform: "google" });
                  toast.success("Orphan cleanup queued");
                  refetch();
                } catch (error) {
                  console.error(error);
                  toast.error("Failed to queue orphan cleanup");
                }
              }}
            >
              Remove old items
            </button>
          </div>
        ) : null}
        <div className="mt-8 flex flex-col gap-2">
          <h3>Recent synchronizations</h3>
          {syncHistory.length === 0 ? (
            <span>No synchronization history</span>
          ) : (
            syncHistory.map((run) => (
              <div className="border rounded p-2" key={run.id}>
                <div>
                  {run.status} · {run.succeeded}/{run.total} successful ·{" "}
                  {run.failed} failed
                </div>
                <div>{new Date(run.createdAt).toLocaleString()}</div>
                {run.errorSummary ? (
                  <div className="text-danger">{run.errorSummary}</div>
                ) : null}
                {run.items
                  .filter((item) => item.status === "FAILED")
                  .slice(0, 20)
                  .map((item) => (
                    <div
                      className="text-danger"
                      key={`${run.id}-${item.offerId}-${item.operation}`}
                    >
                      {item.offerId} · {item.errorCode ?? "ERROR"} · attempts:{" "}
                      {item.attempts} · {item.errorMessage}
                    </div>
                  ))}
              </div>
            ))
          )}
        </div>
      </div>
    </PageDetailLayout>
  );
};
