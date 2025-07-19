import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  useLazyQuery,
  useTranslation,
  useDetailView,
  Input,
  Select,
  Button,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  CardContent,
  CardHeader,
} from "@deenruv/react-ui-devkit";
import {
  GET_INPOST_ORGANIZATIONS,
  GET_INPOST_CONFIG,
} from "../graphql/queries.js";
import { SET_INPOST_CONFIG } from "../graphql/mutations.js";
import { InpostConfig, InpostOrganization } from "../graphql/selectors.js";
import { translationNS } from "../translation-ns.js";

export const Inpost: React.FC = () => {
  const { t } = useTranslation(translationNS);
  const [mutate] = useLazyQuery(SET_INPOST_CONFIG);
  const [get] = useLazyQuery(GET_INPOST_CONFIG);
  const [getOrganizations] = useLazyQuery(GET_INPOST_ORGANIZATIONS);
  const { entity, form } = useDetailView("shippingMethods-detail-view");

  const shippingMethodId = useMemo(
    () => (entity ? entity.id : undefined),
    [entity],
  );

  const handler = useMemo(
    () => form.base.state.fulfillmentHandler?.value,
    [form.base.state],
  );
  const [inpostConfig, setInpostConfig] = useState<Partial<InpostConfig>>({
    host: "api-shipx-pl.easypack24.net",
  });
  const [organizations, setOrganizations] = useState<InpostOrganization[]>([]);
  const [modified, setModified] = useState(false);

  useEffect(() => {
    (async () => {
      const config = await get();
      if (config.getInpostConfig) {
        setInpostConfig(config.getInpostConfig);
        setModified(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (inpostConfig.apiKey && inpostConfig.host) {
        const organizationsRes = await getOrganizations({
          input: {
            host: inpostConfig.host,
            apiKey: inpostConfig.apiKey,
          },
        });
        const organizations = organizationsRes.getInpostOrganizations;
        setOrganizations(organizations.items);
        if (organizations.items[0]) {
          const change: Pick<
            Partial<InpostConfig>,
            "inpostOrganization" | "service"
          > = {
            inpostOrganization: organizations.items[0].id,
          };
          if (organizations.items[0].services[0]) {
            change.service = organizations.items[0].services[0];
          }
          setInpostConfig({ ...inpostConfig, ...change });
        }
      }
    })();
  }, [inpostConfig.apiKey, inpostConfig.host]);

  return shippingMethodId && handler === "inpost-fulfillment" ? (
    <Card title={t("inpost-plugin.title")}>
      <CardHeader>
        <h2 className="text-lg font-semibold">
          {t("inpost-plugin.config-title")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t("inpost-plugin.config-description")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="my-4">
          <Input
            label={t("inpost-plugin.host-label")}
            value={inpostConfig.host}
            onChange={(v) => {
              setInpostConfig({ ...inpostConfig, host: v.target.value });
              setModified(true);
            }}
          />
        </div>
        <div className="my-4">
          <Input
            label={t("inpost-plugin.api-key-label")}
            value={inpostConfig.apiKey}
            onChange={(v) => {
              setInpostConfig({ ...inpostConfig, apiKey: v.target.value });
              setModified(true);
            }}
          />
        </div>
        <div className="my-4">
          <Input
            label={t("inpost-plugin.geowidget-key-label")}
            value={inpostConfig.geowidgetKey ?? ""}
            onChange={(v) => {
              setInpostConfig({
                ...inpostConfig,
                geowidgetKey: v.target.value,
              });
              setModified(true);
            }}
          />
        </div>
        <div className="my-4">
          <Select
            value={`${inpostConfig.inpostOrganization ?? ""}`}
            disabled={!organizations.length}
            onValueChange={(value) => {
              setInpostConfig({
                ...inpostConfig,
                inpostOrganization: parseInt(value, 10),
              });
              setModified(true);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("inpost-plugin.organization-select-placeholder")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  {t("inpost-plugin.organization-select-label")}
                </SelectLabel>
                {organizations.map((org, idx) => (
                  <SelectItem key={org.id + idx} value={`${org.id}`}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="my-4">
          <Select
            value={`${inpostConfig.service ?? ""}`}
            disabled={typeof inpostConfig.inpostOrganization !== "number"}
            onValueChange={(value) => {
              setInpostConfig({ ...inpostConfig, service: value });
              setModified(true);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t("inpost-plugin.service-select-placeholder")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  {t("inpost-plugin.service-select-label")}
                </SelectLabel>
                {organizations
                  .find(
                    (org) =>
                      typeof inpostConfig.inpostOrganization === "number" &&
                      org.id === inpostConfig.inpostOrganization,
                  )
                  ?.services.map((svc) => (
                    <SelectItem key={svc} value={`${svc}`}>
                      {t(`inpost-plugin.service-${svc.replace(/_/gi, "-")}`)}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div style={{ marginTop: "28px" }}>
          <Button
            className="button primary"
            onClick={() => {
              const payload = inpostConfig as InpostConfig;
              if (!payload.host) return;
              if (!payload.apiKey) return;
              if (!payload.inpostOrganization) return;
              if (!payload.service) return;
              mutate({ input: { shippingMethodId, ...payload } }).then(() =>
                setModified(false),
              );
            }}
            disabled={
              !inpostConfig.host ||
              !inpostConfig.apiKey ||
              !inpostConfig.inpostOrganization ||
              !inpostConfig.service ||
              (!modified &&
                !!inpostConfig.host &&
                !!inpostConfig.apiKey &&
                !!inpostConfig.inpostOrganization &&
                !!inpostConfig.service)
            }
          >
            {t("inpost-plugin.save")}
          </Button>
        </div>
      </CardContent>
    </Card>
  ) : null;
};
