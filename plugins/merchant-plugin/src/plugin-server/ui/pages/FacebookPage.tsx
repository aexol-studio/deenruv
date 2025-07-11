import React, { useEffect, useState } from "react";
import {
  PageDetailLayout,
  useLazyQuery,
  useMutation,
  useInjector,
} from "@deenruv/admin-ui/react";
import { NotificationService } from "@deenruv/admin-ui/core";
import { QUERIES } from "../graphql/queries.js";
import { MUTATIONS } from "../graphql/mutations.js";

export const FacebookPage = () => {
  const toast = useInjector(NotificationService);
  const [fetchMerchantPlatformSettings] = useLazyQuery(
    QUERIES["getMerchantPlatformSettings"],
  );
  const [fetchMerchantPlatformInfo] = useLazyQuery(
    QUERIES["getMerchantPlatformInfo"],
  );
  const [mutate] = useMutation(MUTATIONS["saveMerchantPlatformSettings"]);
  const [serviceInfo, setServiceInfo] = useState({
    productsCount: 0,
    connectionStatus: false,
  });

  const [isLoading, setIsLoading] = useState(true);
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
      const [settingsData, infoData] = await Promise.all([
        fetchMerchantPlatformSettings({ platform: "facebook" }),
        fetchMerchantPlatformInfo({ platform: "facebook" }),
      ]);
      const settings =
        settingsData?.getMerchantPlatformSettings?.entries?.reduce(
          (acc, { key, value }) => {
            if (key === "brand")
              setSettingsForm({ ...settingsForm, brand: value });
            if (key === "merchantId")
              setSettingsForm({ ...settingsForm, merchantId: value });
            if (key === "credentials")
              setSettingsForm({ ...settingsForm, credentials: value });
            if (key === "autoUpdate")
              setSettingsForm({
                ...settingsForm,
                autoUpdate: value === "true",
              });
            if (key === "firstSync")
              setSettingsForm({ ...settingsForm, firstSync: value === "true" });
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
            value: value.toString(),
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
      toast.error("Failed to save settings");
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
        )}{" "}
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
              <label>Facebook Access Token</label>
              <input
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
              <input
                type="checkbox"
                id="facebook-account-credentials"
                checked={settingsForm.autoUpdate}
                onChange={(e) =>
                  setSettingsForm({
                    ...settingsForm,
                    autoUpdate: e.target.checked,
                  })
                }
              />
              <label htmlFor="facebook-account-credentials">
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
          {serviceInfo.connectionStatus ? <div>💚</div> : <div>💔</div>}
        </div>
        {/* <div className="flex gap-2">
          <span>Products count</span>
          <span>{serviceInfo.productsCount}</span>
        </div> */}
      </div>
    </PageDetailLayout>
  );
};
