import { type DateFieldProps } from '#/components/forms/DateField/types';
export * as utils from '#/components/forms/DateField/utils';
export declare const LabelText: any;
/**
 * Date-only input. Accepts a string in the format YYYY-MM-DD, or a Date object.
 * Date objects are converted to strings in the format YYYY-MM-DD.
 * Returns a string in the format YYYY-MM-DD.
 *
 * To generate a string in the format YYYY-MM-DD from a Date object, use the
 * `utils.toSimpleDateString(Date)` export of this file.
 */
export declare function DateField({ value, inputRef, onChangeDate, testID, label, isInvalid, accessibilityHint, maximumDate, }: DateFieldProps): any;
//# sourceMappingURL=index.d.ts.map