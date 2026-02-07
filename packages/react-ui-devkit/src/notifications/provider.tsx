import React, { useRef } from "react";
import { NotificationProviderProps, NotificationStore } from "./types.js";
import { createNotificationsStore } from "./state.js";
import { NotificationContext } from "./context.js";

export function NotificationProvider<T>({
  children,
  ...props
}: NotificationProviderProps) {
  const storeRef = useRef<NotificationStore>(undefined);
  if (!storeRef.current) {
    storeRef.current = createNotificationsStore(props);
  }
  return (
    <NotificationContext.Provider value={storeRef.current}>
      {children}
    </NotificationContext.Provider>
  );
}
