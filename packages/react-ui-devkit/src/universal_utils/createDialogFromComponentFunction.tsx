import React from "react";
import { createRoot } from "react-dom/client";
import { Dialog, DialogContent } from "@/components/index.js";

export type DialogComponentProps<T, K = any> = {
  data: K;
  resolve: (value: T) => void;
  reject: (reason?: any) => void;
  close: () => void;
};

type InferDialogProps<C> =
  C extends React.ComponentType<DialogComponentProps<infer T, infer K>>
    ? { returnType: T; dataType: K }
    : never;

export function createDialogFromComponent<
  C extends React.ComponentType<DialogComponentProps<any, any>>,
>(
  DialogComponent: C,
  data: InferDialogProps<C>["dataType"],
  options: {
    preventOutsideClose?: boolean;
    preventEscapeClose?: boolean;
  } = {},
): Promise<InferDialogProps<C>["returnType"]> {
  return new Promise((resolve, reject) => {
    const container = document.createElement("div");
    container.setAttribute("data-dialog-container", "true");
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
      reject(new Error("Dialog closed without resolution"));
    };

    const handleResolve = (value: InferDialogProps<C>["returnType"]) => {
      cleanup();
      resolve(value);
    };

    const props = {
      data,
      resolve: handleResolve,
      reject: (reason?: any) => {
        cleanup();
        reject(reason);
      },
      close: handleClose,
    } as React.ComponentProps<C>;

    root.render(
      <Dialog
        open={true}
        onOpenChange={(open) =>
          !open && !options.preventOutsideClose && handleClose()
        }
      >
        <DialogContent
          onInteractOutside={
            options.preventOutsideClose ? undefined : handleClose
          }
          onEscapeKeyDown={options.preventEscapeClose ? undefined : handleClose}
        >
          {React.createElement(DialogComponent, props)}
        </DialogContent>
      </Dialog>,
    );
  });
}

// if (import.meta.hot) {
//     import.meta.hot.dispose(() => {
//         const modals = document.querySelectorAll('[data-dialog-container]');
//         modals.forEach(modal => modal.remove());
//     });
// }
