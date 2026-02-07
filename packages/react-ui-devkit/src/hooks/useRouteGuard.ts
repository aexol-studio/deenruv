import { useRouteGuardStore } from "@/state";
import { useEffect } from "react";
import { useBlocker, useLocation } from "react-router";

interface UseRouteGuardProps {
  shouldBlock: boolean;
}

export const useRouteGuard = ({ shouldBlock }: UseRouteGuardProps) => {
  const { setModalState, confirmed, resetConfirmed } = useRouteGuardStore();
  const location = useLocation();
  const hasIdParam = /\d+/.test(location.pathname);

  useBlocker((blocker) => {
    // if (hasIdParam && shouldBlock && !confirmed) {
    //     setModalState(true, blocker.nextLocation.pathname);
    //     return true;
    // } else return false;
    return false;
  });

  useEffect(() => {
    resetConfirmed();
  }, [location, setModalState]);
};
