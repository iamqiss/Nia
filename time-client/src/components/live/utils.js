import { useEffect, useState } from 'react';
import {} from '@lingui/core';
import { plural } from '@lingui/macro';
export function displayDuration(i18n, durationInMinutes) {
    const roundedDurationInMinutes = Math.round(durationInMinutes);
    const hours = Math.floor(roundedDurationInMinutes / 60);
    const minutes = roundedDurationInMinutes % 60;
    const minutesString = i18n._(plural(minutes, { one: '# minute', other: '# minutes' }));
    return hours > 0
        ? i18n._(minutes > 0
            ? plural(hours, {
                one: `# hour ${minutesString}`,
                other: `# hours ${minutesString}`,
            })
            : plural(hours, {
                one: '# hour',
                other: '# hours',
            }))
        : minutesString;
}
// Trailing debounce
export function useDebouncedValue(val, delayMs) {
    const [prev, setPrev] = useState(val);
    useEffect(() => {
        const timeout = setTimeout(() => setPrev(val), delayMs);
        return () => clearTimeout(timeout);
    }, [val, delayMs]);
    return prev;
}
//# sourceMappingURL=utils.js.map