// we need the date in the form yyyy-MM-dd to pass to the input
export function toSimpleDateString(date) {
    const _date = typeof date === 'string' ? new Date(date) : date;
    return _date.toISOString().split('T')[0];
}
//# sourceMappingURL=utils.js.map