import React from 'react';
import { type BaseToastOptions } from '#/components/Toast/types';
export { DURATION } from '#/components/Toast/const';
export * from '#/components/Toast/Toast';
export { type ToastType } from '#/components/Toast/types';
/**
 * Toasts are rendered in a global outlet, which is placed at the top of the
 * component tree.
 */
export declare function ToastOutlet(): any;
/**
 * Access the full Sonner API
 */
export declare const api: any;
/**
 * Our base toast API, using the `Toast` export of this file.
 */
export declare function show(content: React.ReactNode, { type, ...options }?: BaseToastOptions): void;
//# sourceMappingURL=index.web.d.ts.map