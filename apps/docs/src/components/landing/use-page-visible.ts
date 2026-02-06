"use client";

import { useState, useEffect } from "react";

/**
 * Returns false when page/tab is hidden (minimized, tab switched, etc.).
 * Use this to pause animations, timers, and intervals when the user isn't looking.
 *
 * Based on the Page Visibility API:
 * https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
 */
export function usePageVisible(): boolean {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onVisibilityChange = () => {
      setVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  return visible;
}
