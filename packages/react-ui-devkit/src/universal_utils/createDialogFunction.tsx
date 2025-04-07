import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/index.js";
import React, { type ReactNode } from "react";
import { createRoot } from "react-dom/client";

type DialogButton = {
  label: string;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  returnValue?: any;
  onClick?: () => any;
};

type DialogOptions = {
  title?: string;
  description?: string;
  buttons?: DialogButton[];
  content?: ReactNode;
};

export function createDialog<T = boolean>(options: DialogOptions): Promise<T> {
  return new Promise<T>((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };

    const handleClose = () => {
      cleanup();
      resolve(false as T);
    };

    const handleButtonClick = (button: DialogButton) => {
      if (button.onClick) {
        const result = button.onClick();
        cleanup();
        resolve(result as T);
      } else {
        cleanup();
        resolve(
          (button.returnValue !== undefined ? button.returnValue : true) as T,
        );
      }
    };

    root.render(
      <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent
          onInteractOutside={handleClose}
          onEscapeKeyDown={handleClose}
        >
          {options.title && (
            <DialogHeader>
              <DialogTitle>{options.title}</DialogTitle>
              {options.description && (
                <DialogDescription>{options.description}</DialogDescription>
              )}
            </DialogHeader>
          )}

          {options.content}

          <DialogFooter className="flex justify-end gap-2">
            {options.buttons?.map((button, index) => (
              <Button
                key={index}
                variant={button.variant || "default"}
                onClick={() => handleButtonClick(button)}
              >
                {button.label}
              </Button>
            ))}
          </DialogFooter>
        </DialogContent>
      </Dialog>,
    );
  });
}
