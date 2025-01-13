import { useRouteGuardStore } from '@/state';
import { useEffect } from 'react';
import { useBlocker, useLocation } from 'react-router-dom';

interface UseRouteGuardProps {
  shouldBlock: boolean;
}

export const useRouteGuard = ({ shouldBlock }: UseRouteGuardProps) => {
  const { setModalState, confirmed, resetConfirmed } = useRouteGuardStore();
  const location = useLocation();

  useBlocker((blocker) => {
    console.log('B', shouldBlock, confirmed);
    if (shouldBlock && !confirmed) {
      setModalState(true, blocker.nextLocation.pathname);
      return true;
    } else return false;
  });

  useEffect(() => {
    resetConfirmed();
  }, [location, setModalState]);
};
