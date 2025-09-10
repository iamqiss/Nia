import {} from '@lingui/core';
export const formatCount = (i18n, num) => {
    return i18n.number(num, {
        notation: 'compact',
        maximumFractionDigits: 1,
        // @ts-expect-error - roundingMode not in the types
        roundingMode: 'trunc',
    });
};
//# sourceMappingURL=format.js.map