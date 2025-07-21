import React, { useCallback, useEffect, useState } from "react";
import { DataService, I18nService } from "@deenruv/admin-ui/core";
import {
  ActionBar,
  Card,
  FormField,
  useDetailComponentData,
  useInjector,
  useLazyQuery,
} from "@deenruv/admin-ui/react";
import { Client, Organization, Service } from "@deenruv/inpost";
import gql from "graphql-tag";

interface InpostConfig {
  host: string;
  apiKey?: string;
  geowidgetKey?: string;
  inpostOrganization?: number;
  service?: Service;
}

export const Inpost: React.FC = () => {
  const t = useInjector(I18nService);
  const dataService = useInjector(DataService);
  const [get, { data }] = useLazyQuery<{ getInpostConfig: InpostConfig }>(gql`
    query InpostConfig {
      getInpostConfig {
        host
        apiKey
        geowidgetKey
        inpostOrganization
        service
      }
    }
  `);
  const { entity, detailForm } = useDetailComponentData();
  const shippingMethodId = entity?.id as undefined | number;
  const fulfillmentHandlerControl = detailForm.controls["fulfillmentHandler"];
  const [handler, setHandler] = useState<string>(
    fulfillmentHandlerControl.value || "",
  );
  const valueChangeCb = useCallback(
    (value: string) => {
      setHandler(value);
    },
    [setHandler],
  );

  const [inpostConfig, setInpostConfig] = useState<InpostConfig>({
    host: "api-shipx-pl.easypack24.net",
  });
  const [organizations, setOrganizations] = useState([] as Organization[]);
  const [modified, setModified] = useState(false);

  useEffect(() => {
    (async () => {
      const config = await get();
      setInpostConfig(config.getInpostConfig);
      setModified(false);
    })();
  }, [get]);

  useEffect(() => {
    (async () => {
      if (inpostConfig.apiKey && inpostConfig.host) {
        const { host, apiKey } = inpostConfig;
        const cli = new Client({ host, apiKey });
        const organizations = await cli.organizations().list();
        setOrganizations(organizations.items);
        if (organizations.items[0]) {
          const change: Pick<InpostConfig, "inpostOrganization" | "service"> = {
            inpostOrganization: organizations.items[0].id,
          };
          if (organizations.items[0].services[0]) {
            change.service = organizations.items[0].services[0];
          }
          setInpostConfig({ ...inpostConfig, ...change });
        }
      }
    })();
  }, [
    inpostConfig.apiKey,
    inpostConfig.host,
    setOrganizations,
    setInpostConfig,
  ]);

  useEffect(() => {
    fulfillmentHandlerControl.valueChanges.subscribe(valueChangeCb);
  }, [valueChangeCb, fulfillmentHandlerControl.valueChanges.subscribe]);

  return shippingMethodId && handler === "inpost-fulfillment" ? (
    <div style={{ marginBottom: "16px" }}>
      <Card title={t.translate("inpost-plugin.title")}>
        <div style={{ marginTop: "16px", marginBottom: "16px" }}>
          <FormField
            label={t.translate("inpost-plugin.connection-label")}
            tooltip={t.translate("inpost-plugin.connection-tooltip")}
            invalid={!data?.getInpostConfig}
            errorMessage={
              data?.getInpostConfig
                ? ""
                : t.translate("inpost-plugin.connection-error")
            }
          >
            <span>
              {data?.getInpostConfig
                ? t.translate("inpost-plugin.connected")
                : t.translate("inpost-plugin.not-connected")}
            </span>
          </FormField>
        </div>
        <div style={{ marginTop: "16px", marginBottom: "16px" }}>
          <FormField
            label={t.translate("inpost-plugin.host-label")}
            tooltip={t.translate("inpost-plugin.host-tooltip")}
            invalid={false}
            errorMessage=""
          >
            <input
              type="text"
              value={inpostConfig.host}
              onChange={(v) => {
                setInpostConfig({ ...inpostConfig, host: v.target.value });
                setModified(true);
              }}
            />
          </FormField>
        </div>
        <div style={{ marginTop: "16px", marginBottom: "16px" }}>
          <FormField
            label={t.translate("inpost-plugin.api-key-label")}
            tooltip={t.translate("inpost-plugin.api-key-tooltip")}
            invalid={false}
            errorMessage=""
          >
            <input
              type="text"
              value={inpostConfig.apiKey || ""}
              onChange={(ev) => {
                setInpostConfig({ ...inpostConfig, apiKey: ev.target.value });
                setModified(true);
              }}
            />
          </FormField>
        </div>
        <div style={{ marginTop: "16px", marginBottom: "16px" }}>
          <FormField
            label={t.translate("inpost-plugin.geowidget-key-label")}
            tooltip={t.translate("inpost-plugin.geowidget-key-tooltip")}
            invalid={false}
            errorMessage=""
          >
            <input
              type="text"
              value={inpostConfig.geowidgetKey || ""}
              onChange={(ev) => {
                setInpostConfig({
                  ...inpostConfig,
                  geowidgetKey: ev.target.value,
                });
                setModified(true);
              }}
            />
          </FormField>
        </div>
        <div style={{ marginTop: "16px", marginBottom: "16px" }}>
          <FormField
            label={t.translate("inpost-plugin.organization-select-label")}
            tooltip={t.translate("inpost-plugin.organization-select-tooltip")}
            invalid={false}
            errorMessage=""
          >
            <select
              disabled={!organizations.length}
              defaultValue={`${inpostConfig.inpostOrganization ?? ""}`}
              onBlur={(ev) => {
                const org = organizations.find(
                  (org) => `${org.id}` === ev.target.value,
                );
                setInpostConfig({
                  ...inpostConfig,
                  inpostOrganization: org && org.id,
                });
                setModified(true);
              }}
            >
              {organizations.map((org) => (
                <option value={`${org.id}`}>{org.name}</option>
              ))}
            </select>
          </FormField>
        </div>
        <div style={{ marginTop: "16px", marginBottom: "16px" }}>
          <FormField
            label={t.translate("inpost-plugin.service-select-label")}
            tooltip={t.translate("inpost-plugin.service-select-tooltip")}
            invalid={false}
            errorMessage=""
          >
            <select
              disabled={typeof inpostConfig.inpostOrganization !== "number"}
              defaultValue={`${inpostConfig.service ?? ""}`}
              onBlur={(ev) => {
                setInpostConfig({
                  ...inpostConfig,
                  service: ev.target.value as Service,
                });
                setModified(true);
              }}
            >
              {organizations
                .find(
                  (org) =>
                    typeof inpostConfig.inpostOrganization === "number" &&
                    org.id === inpostConfig.inpostOrganization,
                )
                ?.services.map((svc) => (
                  <option value={`${svc}`}>
                    {t.translate(
                      `inpost-plugin.service-${svc.replace(/_/gi, "-")}`,
                    )}
                  </option>
                ))}
            </select>
          </FormField>
        </div>
        <div style={{ marginTop: "28px" }}>
          <ActionBar>
            <button
              className="button primary"
              onClick={() => {
                dataService
                  .mutate(
                    gql`
                      mutation SetInpostConfig(
                        $shippingMethodId: ID!
                        $host: String!
                        $apiKey: String!
                        $geowidgetKey: String
                        $inpostOrganization: Int!
                        $service: String!
                      ) {
                        setInpostShippingMethodConfig(
                          input: {
                            shippingMethodId: $shippingMethodId
                            host: $host
                            apiKey: $apiKey
                            geowidgetKey: $geowidgetKey
                            inpostOrganization: $inpostOrganization
                            service: $service
                          }
                        )
                      }
                    `,
                    {
                      ...inpostConfig,
                      shippingMethodId,
                    },
                  )
                  .subscribe(() => {
                    setModified(false);
                  });
              }}
            >
              {t.translate("inpost-plugin.save")}
            </button>
          </ActionBar>
        </div>
      </Card>
    </div>
  ) : null;
};
