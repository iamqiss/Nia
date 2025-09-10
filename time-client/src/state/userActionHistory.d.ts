export type SeenPost = {
    uri: string;
    likeCount: number;
    repostCount: number;
    replyCount: number;
    isFollowedBy: boolean;
    feedContext: string | undefined;
};
export type UserActionHistory = {
    /**
     * The last 100 post URIs the user has liked
     */
    likes: string[];
    /**
     * The last 100 DIDs the user has followed
     */
    follows: string[];
    followSuggestions: string[];
    /**
     * The last 100 post URIs the user has seen from the Discover feed only
     */
    seen: SeenPost[];
};
export declare function getActionHistory(): UserActionHistory;
export declare function useActionHistorySnapshot(): any;
export declare function like(postUris: string[]): void;
export declare function unlike(postUris: string[]): void;
export declare function follow(dids: string[]): void;
export declare function followSuggestion(dids: string[]): void;
export declare function unfollow(dids: string[]): void;
export declare function seen(posts: SeenPost[]): void;
//# sourceMappingURL=userActionHistory.d.ts.map