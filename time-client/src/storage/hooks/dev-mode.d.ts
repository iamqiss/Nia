export declare function useDevMode(): readonly [any, any];
/**
 * Does not update when toggling dev mode on or off. This util simply retrieves
 * the value and caches in memory indefinitely. So after an update, you'll need
 * to reload the app so it can pull a fresh value from storage.
 */
export declare function isDevMode(): boolean | undefined;
//# sourceMappingURL=dev-mode.d.ts.map