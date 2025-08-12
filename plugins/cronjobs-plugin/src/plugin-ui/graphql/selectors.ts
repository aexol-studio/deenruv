import { FromSelector, Selector } from "../zeus/index.js";

export const DpdSettingsSelector = Selector("DpdSettings")({
  address: true,
  city: true,
  postalCode: true,
  x_dpd_fid: true,
  company: true,
  countryCode: true,
  email: true,
  name: true,
  password: true,
  phone: true,
  username: true,
  webhookToken: true,
});

export type DpdSettingsType = FromSelector<
  typeof DpdSettingsSelector,
  "DpdSettings"
>;
