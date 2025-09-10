import { type I18n } from '@lingui/core';
export type DateDiffFormat = 'long' | 'short';
type DateDiff = {
    value: number;
    unit: 'now' | 'second' | 'minute' | 'hour' | 'day' | 'month';
    earlier: Date;
    later: Date;
};
export declare function useGetTimeAgo({ future }?: {
    future?: boolean;
}): any;
/**
 * Returns the difference between `earlier` and `later` dates, based on
 * opinionated rules.
 *
 * - All month are considered exactly 30 days.
 * - Dates assume `earlier` <= `later`, and will otherwise return 'now'.
 * - All values round down
 */
export declare function dateDiff(earlier: number | string | Date, later: number | string | Date, rounding?: 'up' | 'down'): DateDiff;
/**
 * Accepts a `DateDiff` and teturns the difference between `earlier` and
 * `later` dates, formatted as a natural language string.
 *
 * - All month are considered exactly 30 days.
 * - Dates assume `earlier` <= `later`, and will otherwise return 'now'.
 * - Differences >= 360 days are returned as the "M/D/YYYY" string
 * - All values round down
 */
export declare function formatDateDiff({ diff, format, i18n, }: {
    diff: DateDiff;
    format?: DateDiffFormat;
    i18n: I18n;
}): string;
export {};
//# sourceMappingURL=useTimeAgo.d.ts.map