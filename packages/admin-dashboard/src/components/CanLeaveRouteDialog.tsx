import { useRouteGuardStore } from '@/state';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@deenruv/react-ui-devkit';
import React, { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

interface CanLeaveRouteDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onConfirm: () => void;
}

export const CanLeaveRouteDialog: React.FC = () => {
  const { isModalOpen, confirmNavigation, cancelNavigation } = useRouteGuardStore();
  const navigate = useNavigate();

  return (
    <AlertDialog open={isModalOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Are you sure you want to leave without saving?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelNavigation}>Stay</AlertDialogCancel>
          <AlertDialogAction onClick={() => confirmNavigation(navigate)}>Leave</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
