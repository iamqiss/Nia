import { type I18n } from '@lingui/core';
export declare function niceDate(i18n: I18n, date: number | string | Date): any;
export declare function getAge(birthDate: Date): number;
/**
 * Get a Date object that is N years ago from now
 * @param years number of years
 * @returns Date object
 */
export declare function getDateAgo(years: number): Date;
/**
 * Compares two dates by year, month, and day only
 */
export declare function simpleAreDatesEqual(a: Date, b: Date): boolean;
//# sourceMappingURL=time.d.ts.map