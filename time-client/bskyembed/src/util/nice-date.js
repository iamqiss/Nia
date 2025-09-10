export function niceDate(date) {
    const d = new Date(date);
    return `${d.toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })} at ${d.toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
    })}`;
}
//# sourceMappingURL=nice-date.js.map