import {
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
} from "@/components/atoms/alert-dialog.js";
import React, { PropsWithChildren, ReactNode, useCallback } from "react";
import { useTranslation } from "react-i18next";

interface ConfirmationDialogProps {
  onConfirm: () => void;
  title?: string;
  description?: string;
  additionalElement?: ReactNode;
}

/**
 * A modal that asks the user to confirm an action.
 *
 * @param {() => void} onConfirm - Callback invoked when the user confirms the action.
 * @param {string} title - The title of the dialog.
 * @param {string} description - The description of the dialog.
 * @param {ReactNode} additionalElement - A socket for an additional element that should be rendered in the modal.
 * @param {ReactNode} children - The trigger element that opens the dialog.
 */
export const ConfirmationDialog: React.FC<
  PropsWithChildren<ConfirmationDialogProps>
> = ({ children, onConfirm, title, description, additionalElement }) => {
  const { t } = useTranslation("common");

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {title ? title : t("confirmationDialog.title")}
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription className="flex flex-col gap-4">
          {description ? description : t("confirmationDialog.description")}
          {additionalElement}
        </AlertDialogDescription>
        <AlertDialogFooter className="mt-2">
          <AlertDialogCancel>
            {t("confirmationDialog.cancelBtn")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {t("confirmationDialog.confirmBtn")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
