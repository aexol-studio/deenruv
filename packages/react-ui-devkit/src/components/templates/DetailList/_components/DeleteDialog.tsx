import {
  Button,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components";
import { useTranslation } from "@/hooks/useTranslation.js";
import React from "react";

type ConfirmationDialogProps = {
  onConfirmDelete: () => void;
  setDeleteDialogOpened: (e: boolean) => void;
  itemsToDelete: { id: string }[];
  deleteDialogOpened: boolean;
};

export function DeleteDialog({
  onConfirmDelete,
  setDeleteDialogOpened,
  deleteDialogOpened,
  itemsToDelete,
}: ConfirmationDialogProps) {
  const { t } = useTranslation("table");

  return (
    <Dialog open={deleteDialogOpened} onOpenChange={setDeleteDialogOpened}>
      <DialogContent>
        <DialogTitle>
          {itemsToDelete.length > 1
            ? t("bulk.delete.title.plural")
            : t("bulk.delete.title.singular")}
        </DialogTitle>
        <div className="flex max-h-[50vh] flex-col gap-2">
          <DialogDescription className="text-primary text-lg">
            {t("bulk.delete.description")}
          </DialogDescription>
          <DialogDescription>
            {itemsToDelete.map(({ id }) => (
              <div key={id}>{id}</div>
            ))}
          </DialogDescription>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">{t("bulk.delete.cancel")}</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirmDelete}>
            {t("bulk.delete.confirm", { amount: itemsToDelete.length })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
