import { FromSelectorWithScalars, Selector } from "@deenruv/admin-types";

export const ChannelListSelector = Selector("Channel")({
  id: true,
  token: true,
  code: true,
  createdAt: true,
  updatedAt: true,
});

export type ChannelListType = FromSelectorWithScalars<
  typeof ChannelListSelector,
  "Channel"
>;
