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
  getMerchantPlatformInfo,
  getMerchantPlatformSettings,
} from "../graphql/queries";
import {
  saveMerchantPlatformSettings,
  removeOrphanItems,
} from "../graphql/mutations";
import { toast } from "sonner";
import { translationNS } from "../translation-ns.js";

export const FacebookPage = () => {
  const { t } = useTranslation(translationNS);
  const [fetchMerchantPlatformSettings] = useLazyQuery(
    getMerchantPlatformSettings,
  );
  const [fetchMerchantPlatformInfo] = useLazyQuery(getMerchantPlatformInfo);
  const [mutate] = useMutation(saveMerchantPlatformSettings);
  const [removeOldItems] = useMutation(removeOrphanItems);
  const [serviceInfo, setServiceInfo] = useState({
    productsCount: 0,
    connectionStatus: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    brand: "",
    merchantId: "",
    credentials: "",
    autoUpdate: true,
    firstSync: true,
  });

  const refetch = async () => {
    try {
      setIsLoading(true);
      setLoadError(false);
      const [settingsData, infoData] = await Promise.all([
        fetchMerchantPlatformSettings({ platform: "facebook" }),
        fetchMerchantPlatformInfo({ platform: "facebook" }),
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
            credentials: string;
            autoUpdate: boolean;
            firstSync: boolean;
          },
        );
      setSettingsForm((prev) => ({ ...prev, ...settings }));
      setServiceInfo({
        productsCount:
          infoData?.getMerchantPlatformInfo?.[0]?.productsCount || 0,
        connectionStatus:
          infoData?.getMerchantPlatformInfo?.[0]?.isValidConnection || false,
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
          platform: "facebook",
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
        <h2 className="mb-4 text-xl font-semibold">{t("facebook.title")}</h2>
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
              <Label>{t("facebook.catalogId")}</Label>
              <Input
                className="w-full"
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
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <Label>{t("facebook.accessToken")}</Label>
              <Input
                className="w-full"
                value={settingsForm.credentials}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    credentials: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex gap-2 items-center">
              <Checkbox
                id="facebook-account-credentials"
                checked={settingsForm.autoUpdate}
                onCheckedChange={(checked) =>
                  setSettingsForm({
                    ...settingsForm,
                    autoUpdate: typeof checked === "boolean" ? checked : false,
                  })
                }
              />
              <Label htmlFor="facebook-account-credentials">
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
        {serviceInfo.connectionStatus ? (
          <div className="mt-8">
            <Button
              onClick={async () => {
                try {
                  await removeOldItems({ platform: "facebook" });
                  toast.success(t("common.oldItemsRemoved"));
                  refetch();
                } catch (error) {
                  console.error(error);
                  toast.error(t("common.oldItemsRemoveFailed"));
                }
              }}
            >
              {t("common.removeOldItems")}
            </Button>
          </div>
        ) : null}
      </div>
    </PageBlock>
  );
};
