import { Selector } from "../zeus/index.js";
import { FromSelectorWithScalars } from "./scalars.js";

export const InpostConfigSelector = Selector("InpostConfig")({
  host: true,
  apiKey: true,
  geowidgetKey: true,
  inpostOrganization: true,
  service: true,
});
export type InpostConfig = FromSelectorWithScalars<
  typeof InpostConfigSelector,
  "InpostConfig"
>;

export const InpostOrganizationSelector = Selector("InpostOrganization")({
  id: true,
  name: true,
  services: true,
});
export type InpostOrganization = FromSelectorWithScalars<
  typeof InpostOrganizationSelector,
  "InpostOrganization"
>;
