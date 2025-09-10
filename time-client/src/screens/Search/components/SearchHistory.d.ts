import type * as bsky from '#/types/bsky';
export declare function SearchHistory({ searchHistory, selectedProfiles, onItemClick, onProfileClick, onRemoveItemClick, onRemoveProfileClick, }: {
    searchHistory: string[];
    selectedProfiles: bsky.profile.AnyProfileView[];
    onItemClick: (item: string) => void;
    onProfileClick: (profile: bsky.profile.AnyProfileView) => void;
    onRemoveItemClick: (item: string) => void;
    onRemoveProfileClick: (profile: bsky.profile.AnyProfileView) => void;
}): any;
//# sourceMappingURL=SearchHistory.d.ts.map