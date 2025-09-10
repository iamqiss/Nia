import { type AppBskyUnspeccedGetPostThreadV2 } from '@atproto/api';
import { type Literal } from '#/types/utils';
export type ThreadSortOption = Literal<AppBskyUnspeccedGetPostThreadV2.QueryParams['sort'], string>;
export type ThreadViewOption = 'linear' | 'tree';
export type ThreadPreferences = {
    isLoaded: boolean;
    isSaving: boolean;
    sort: ThreadSortOption;
    setSort: (sort: string) => void;
    view: ThreadViewOption;
    setView: (view: ThreadViewOption) => void;
    prioritizeFollowedUsers: boolean;
    setPrioritizeFollowedUsers: (prioritize: boolean) => void;
};
export declare function useThreadPreferences({ save, }?: {
    save?: boolean;
}): ThreadPreferences;
/**
 * Migrates user thread preferences from the old sort values to V2
 */
export declare function normalizeSort(sort: string): ThreadSortOption;
/**
 * Transforms existing treeViewEnabled preference into a ThreadViewOption
 */
export declare function normalizeView({ treeViewEnabled, }: {
    treeViewEnabled: boolean;
}): ThreadViewOption;
//# sourceMappingURL=useThreadPreferences.d.ts.map