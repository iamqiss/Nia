import { type AppBskyActorSearchActors, type ModerationOpts } from '@atproto/api';
import { type InfiniteData } from '@tanstack/react-query';
import type * as bsky from '#/types/bsky';
export declare function useLoadEnoughProfiles({ interest, data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, }: {
    interest: string | null;
    data?: InfiniteData<AppBskyActorSearchActors.OutputSchema>;
    isLoading: boolean;
    isFetchingNextPage: boolean;
    hasNextPage: boolean;
    fetchNextPage: () => Promise<unknown>;
}): {
    isReady: boolean;
};
export declare function SuggestedAccountsTabBar({ selectedInterest, onSelectInterest, hideDefaultTab, defaultTabLabel, }: {
    selectedInterest: string | null;
    onSelectInterest: (interest: string | null) => void;
    hideDefaultTab?: boolean;
    defaultTabLabel?: string;
}): any;
/**
 * Profile card for suggested accounts. Note: border is on the bottom edge
 */
declare let SuggestedProfileCard: ({ profile, moderationOpts, recId, position, }: {
    profile: bsky.profile.AnyProfileView;
    moderationOpts: ModerationOpts;
    recId?: number;
    position: number;
}) => React.ReactNode;
export { SuggestedProfileCard };
//# sourceMappingURL=ExploreSuggestedAccounts.d.ts.map