import { create } from 'zustand';

interface RouteGuardState {
  isModalOpen: boolean;
  nextLocation: string | null;
  confirmed: boolean;
  resetConfirmed: () => void;
  setModalState: (isOpen: boolean, nextLocation?: string | null) => void;
  confirmNavigation: (navigate: (to: string) => void) => void;
  cancelNavigation: () => void;
}

export const useRouteGuardStore = create<RouteGuardState>((set) => ({
  isModalOpen: false,
  nextLocation: null,
  confirmed: false,
  resetConfirmed: () => set({ confirmed: false }),
  setModalState: (isOpen, nextLocation = null) => set({ isModalOpen: isOpen, nextLocation }),
  confirmNavigation: (navigate) =>
    set((state) => {
      if (state.nextLocation) {
        setTimeout(() => {
          navigate(state.nextLocation!);
        }, 0);
      }
      return { confirmed: true, isModalOpen: false, nextLocation: null };
    }),
  cancelNavigation: () => set({ confirmed: false, isModalOpen: false, nextLocation: null }),
}));
