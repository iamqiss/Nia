import { type JSX } from 'react';
import { type I18n } from '@lingui/core';
export declare function TimeElapsed({ timestamp, children, timeToString, }: {
    timestamp: string;
    children: ({ timeElapsed }: {
        timeElapsed: string;
    }) => JSX.Element;
    timeToString?: (i18n: I18n, timeElapsed: string) => string;
}): JSX.Element;
//# sourceMappingURL=TimeElapsed.d.ts.map