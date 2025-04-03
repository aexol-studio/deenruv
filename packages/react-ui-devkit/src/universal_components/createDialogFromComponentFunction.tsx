import React from 'react';
import { createRoot } from 'react-dom/client';
import { Dialog, DialogContent } from '@/components/index.js';

export type DialogComponentProps<T, K = any> = {
    data?: K;
    resolve: (value: T) => void;
    reject: (reason?: any) => void;
    close: () => void;
};

export function createDialogFromComponent<T = any, K = any>(
    DialogComponent: React.ComponentType<DialogComponentProps<T>>,
    data?: K,
    options: {
        preventOutsideClose?: boolean;
        preventEscapeClose?: boolean;
    } = {},
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const container = document.createElement('div');
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
            reject(new Error('Dialog closed without resolution'));
        };

        const handleResolve = (value: T) => {
            cleanup();
            resolve(value);
        };

        root.render(
            <Dialog open={true} onOpenChange={open => !open && !options.preventOutsideClose && handleClose()}>
                <DialogContent
                    onInteractOutside={options.preventOutsideClose ? undefined : handleClose}
                    onEscapeKeyDown={options.preventEscapeClose ? undefined : handleClose}
                >
                    <DialogComponent
                        data={data}
                        resolve={handleResolve}
                        reject={reason => {
                            cleanup();
                            reject(reason);
                        }}
                        close={handleClose}
                    />
                </DialogContent>
            </Dialog>,
        );
    });
}
