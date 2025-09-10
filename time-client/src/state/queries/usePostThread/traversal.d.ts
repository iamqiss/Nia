import { type ModerationOpts } from '@atproto/api';
import { type ApiThreadItem, type PostThreadParams, type ThreadItem } from '#/state/queries/usePostThread/types';
export declare function sortAndAnnotateThreadItems(thread: ApiThreadItem[], { threadgateHiddenReplies, moderationOpts, view, skipModerationHandling, }: {
    threadgateHiddenReplies: Set<string>;
    moderationOpts: ModerationOpts;
    view: PostThreadParams['view'];
    /**
     * Set to `true` in cases where we already know the moderation state of the
     * post e.g. when fetching additional replies from the server. This will
     * prevent additional sorting or nested-branch truncation, and all replies,
     * regardless of moderation state, will be included in the resulting
     * `threadItems` array.
     */
    skipModerationHandling?: boolean;
}): {
    threadItems: ThreadItem[];
    otherThreadItems: ThreadItem[];
};
export declare function buildThread({ threadItems, otherThreadItems, serverOtherThreadItems, isLoading, hasSession, otherItemsVisible, hasOtherThreadItems, showOtherItems, }: {
    threadItems: ThreadItem[];
    otherThreadItems: ThreadItem[];
    serverOtherThreadItems: ThreadItem[];
    isLoading: boolean;
    hasSession: boolean;
    otherItemsVisible: boolean;
    hasOtherThreadItems: boolean;
    showOtherItems: () => void;
}): ThreadItem[];
/**
 * Get the start and end index of a "branch" of the thread. A "branch" is a
 * parent and it's children (not siblings). Returned indices are inclusive of
 * the parent and its last child.
 *
 *   items[]               (index, depth)
 *     └─┬ anchor ──────── (0, 0)
 *       ├─── branch ───── (1, 1)
 *       ├──┬ branch ───── (2, 1) (start)
 *       │  ├──┬ leaf ──── (3, 2)
 *       │  │  └── leaf ── (4, 3)
 *       │  └─── leaf ──── (5, 2) (end)
 *       ├─── branch ───── (6, 1)
 *       └─── branch ───── (7, 1)
 *
 *   const { start: 2, end: 5, length: 3 } = getBranch(items, 2, 1)
 */
export declare function getBranch(thread: ApiThreadItem[], branchStartIndex: number, branchStartDepth: number): {
    start: number;
    end: number;
    length: number;
};
//# sourceMappingURL=traversal.d.ts.map