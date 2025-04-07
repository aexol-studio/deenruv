import { CustomerHistoryEntryData } from "@deenruv/core";

export const CUSTOM_TYPE = "CUSTOM_TYPE";

declare module "@deenruv/core" {
  interface OrderHistoryEntryData {
    [CUSTOM_TYPE]: { message: string };
  }

  interface CustomerHistoryEntryData {
    [CUSTOM_TYPE]: { name: string };
  }
}
