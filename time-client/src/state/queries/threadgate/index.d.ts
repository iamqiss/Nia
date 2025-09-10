import { AppBskyFeedDefs, AppBskyFeedThreadgate, type BskyAgent } from '@atproto/api';
import { type ThreadgateAllowUISetting } from '#/state/queries/threadgate/types';
export * from '#/state/queries/threadgate/types';
export * from '#/state/queries/threadgate/util';
export declare const threadgateRecordQueryKeyRoot = "threadgate-record";
export declare const createThreadgateRecordQueryKey: (uri: string) => string[];
export declare function useThreadgateRecordQuery({ postUri, initialData, }?: {
    postUri?: string;
    initialData?: AppBskyFeedThreadgate.Record;
}): any;
export declare const threadgateViewQueryKeyRoot = "threadgate-view";
export declare const createThreadgateViewQueryKey: (uri: string) => string[];
export declare function useThreadgateViewQuery({ postUri, initialData, }?: {
    postUri?: string;
    initialData?: AppBskyFeedDefs.ThreadgateView;
}): any;
export declare function getThreadgateView({ agent, postUri, }: {
    agent: BskyAgent;
    postUri: string;
}): Promise<any>;
export declare function getThreadgateRecord({ agent, postUri, }: {
    agent: BskyAgent;
    postUri: string;
}): Promise<AppBskyFeedThreadgate.Record | null>;
export declare function writeThreadgateRecord({ agent, postUri, threadgate, }: {
    agent: BskyAgent;
    postUri: string;
    threadgate: AppBskyFeedThreadgate.Record;
}): Promise<void>;
export declare function upsertThreadgate({ agent, postUri, }: {
    agent: BskyAgent;
    postUri: string;
}, callback: (threadgate: AppBskyFeedThreadgate.Record | null) => Promise<AppBskyFeedThreadgate.Record | undefined>): Promise<void>;
/**
 * Update the allow list for a threadgate record.
 */
export declare function updateThreadgateAllow({ agent, postUri, allow, }: {
    agent: BskyAgent;
    postUri: string;
    allow: ThreadgateAllowUISetting[];
}): Promise<void>;
export declare function useSetThreadgateAllowMutation(): any;
export declare function useToggleReplyVisibilityMutation(): any;
//# sourceMappingURL=index.d.ts.map