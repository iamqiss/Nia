import * as toast from '#/components/Toast';
import {} from '#/components/Toast/types';
export const convertLegacyToastType = (type) => {
    switch (type) {
        // these ones are fine
        case 'default':
        case 'success':
        case 'error':
        case 'warning':
        case 'info':
            return type;
        // legacy ones need conversion
        case 'xmark':
            return 'error';
        case 'exclamation-circle':
            return 'warning';
        case 'check':
            return 'success';
        case 'clipboard-check':
            return 'success';
        case 'circle-exclamation':
            return 'warning';
        default:
            return 'default';
    }
};
/**
 * @deprecated use {@link toast} instead
 */
export function show(message, type = 'default') {
    const convertedType = convertLegacyToastType(type);
    toast.show(message, { type: convertedType });
}
//# sourceMappingURL=Toast.js.map