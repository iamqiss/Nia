const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
    roundingMode: 'trunc',
});
export function prettyNumber(number) {
    return formatter.format(number);
}
//# sourceMappingURL=pretty-number.js.map