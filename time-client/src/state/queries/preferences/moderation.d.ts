import { DEFAULT_LABEL_SETTINGS } from '@atproto/api';
/**
 * More strict than our default settings for logged in users.
 */
export declare const DEFAULT_LOGGED_OUT_LABEL_PREFERENCES: typeof DEFAULT_LABEL_SETTINGS;
export declare function useMyLabelersQuery({ excludeNonConfigurableLabelers, }?: {
    excludeNonConfigurableLabelers?: boolean;
}): any;
export declare function useLabelDefinitionsQuery(): any;
//# sourceMappingURL=moderation.d.ts.map