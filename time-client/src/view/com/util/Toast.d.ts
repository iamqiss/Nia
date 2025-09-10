import { type ToastType } from '#/components/Toast/types';
/**
 * @deprecated use {@link ToastType} and {@link toast} instead
 */
export type LegacyToastType = 'xmark' | 'exclamation-circle' | 'check' | 'clipboard-check' | 'circle-exclamation';
export declare const convertLegacyToastType: (type: ToastType | LegacyToastType) => ToastType;
/**
 * @deprecated use {@link toast} instead
 */
export declare function show(message: string, type?: ToastType | LegacyToastType): void;
//# sourceMappingURL=Toast.d.ts.map