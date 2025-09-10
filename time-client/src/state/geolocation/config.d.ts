/**
 * Begin the process of resolving geolocation config. This should be called
 * once at app start.
 *
 * THIS METHOD SHOULD NEVER THROW.
 *
 * This method is otherwise not used for any purpose. To ensure geolocation
 * config is resolved, use {@link ensureGeolocationConfigIsResolved}
 */
export declare function beginResolveGeolocationConfig(): void;
/**
 * Ensure that geolocation config has been resolved, or at the very least attempted
 * once. Subsequent retries will not be captured by this `await`. Those will be
 * reported via {@link emitGeolocationConfigUpdate}.
 */
export declare function ensureGeolocationConfigIsResolved(): Promise<void>;
//# sourceMappingURL=config.d.ts.map