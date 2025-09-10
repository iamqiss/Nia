import { AppBskyFeedPostgate, type BskyAgent } from '@atproto/api';
export declare function getPostgateRecord({ agent, postUri, }: {
    agent: BskyAgent;
    postUri: string;
}): Promise<AppBskyFeedPostgate.Record | undefined>;
export declare function writePostgateRecord({ agent, postUri, postgate, }: {
    agent: BskyAgent;
    postUri: string;
    postgate: AppBskyFeedPostgate.Record;
}): Promise<void>;
export declare function upsertPostgate({ agent, postUri, }: {
    agent: BskyAgent;
    postUri: string;
}, callback: (postgate: AppBskyFeedPostgate.Record | undefined) => Promise<AppBskyFeedPostgate.Record | undefined>): Promise<void>;
export declare const createPostgateQueryKey: (postUri: string) => string[];
export declare function usePostgateQuery({ postUri }: {
    postUri: string;
}): any;
export declare function useWritePostgateMutation(): any;
export declare function useToggleQuoteDetachmentMutation(): any;
export declare function useToggleQuotepostEnabledMutation(): any;
//# sourceMappingURL=index.d.ts.map