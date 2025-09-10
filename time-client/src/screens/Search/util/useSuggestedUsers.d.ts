/**
 * Conditional hook, used in case a user is a non-english speaker, in which
 * case we fall back to searching for users instead of our more curated set.
 */
export declare function useSuggestedUsers({ category, search, overrideInterests, }: {
    category?: string | null;
    /**
     * If true, we'll search for users using the translated value of `category`,
     * based on the user's "app language setting
     */
    search?: boolean;
    /**
     * In onboarding, interests haven't been saved to prefs yet, so we need to
     * pass them down through here
     */
    overrideInterests?: string[];
}): any;
//# sourceMappingURL=useSuggestedUsers.d.ts.map