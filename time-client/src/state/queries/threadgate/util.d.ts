import { type AppBskyFeedDefs, AppBskyFeedThreadgate } from '@atproto/api';
import { type ThreadgateAllowUISetting } from '#/state/queries/threadgate/types';
export declare function threadgateViewToAllowUISetting(threadgateView: AppBskyFeedDefs.ThreadgateView | undefined): ThreadgateAllowUISetting[];
/**
 * Converts a full {@link AppBskyFeedThreadgate.Record} to a list of
 * {@link ThreadgateAllowUISetting}, for use by app UI.
 */
export declare function threadgateRecordToAllowUISetting(threadgate: AppBskyFeedThreadgate.Record | undefined): ThreadgateAllowUISetting[];
/**
 * Converts an array of {@link ThreadgateAllowUISetting} to the `allow` prop on
 * {@link AppBskyFeedThreadgate.Record}.
 *
 * If the `allow` property on the record is undefined, we infer that to mean
 * that everyone can reply. If it's an empty array, we infer that to mean that
 * no one can reply.
 */
export declare function threadgateAllowUISettingToAllowRecordValue(threadgate: ThreadgateAllowUISetting[]): AppBskyFeedThreadgate.Record['allow'];
/**
 * Merges two {@link AppBskyFeedThreadgate.Record} objects, combining their
 * `allow` and `hiddenReplies` arrays and de-deduplicating them.
 *
 * Note: `allow` can be undefined here, be sure you don't accidentally set it
 * to an empty array. See other comments in this file.
 */
export declare function mergeThreadgateRecords(prev: AppBskyFeedThreadgate.Record, next: Partial<AppBskyFeedThreadgate.Record>): AppBskyFeedThreadgate.Record;
/**
 * Create a new {@link AppBskyFeedThreadgate.Record} object with the given
 * properties.
 */
export declare function createThreadgateRecord(threadgate: Partial<AppBskyFeedThreadgate.Record>): AppBskyFeedThreadgate.Record;
//# sourceMappingURL=util.d.ts.map