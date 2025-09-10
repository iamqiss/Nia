import { type AppBskyFeedDefs } from '@atproto/api';
import { AppLanguage, type Language } from './languages';
export declare function code2ToCode3(lang: string): string;
export declare function code3ToCode2(lang: string): string;
export declare function code3ToCode2Strict(lang: string): string | undefined;
export declare function languageName(language: Language, appLang: string): string;
export declare function codeToLanguageName(lang2or3: string, appLang: string): string;
export declare function getPostLanguage(post: AppBskyFeedDefs.PostView): string | undefined;
export declare function isPostInLanguage(post: AppBskyFeedDefs.PostView, targetLangs: string[]): boolean;
export declare function getTranslatorLink(text: string, lang: string): string;
/**
 * Returns a valid `appLanguage` value from an arbitrary string.
 *
 * Context: post-refactor, we populated some user's `appLanguage` setting with
 * `postLanguage`, which can be a comma-separated list of values. This breaks
 * `appLanguage` handling in the app, so we introduced this util to parse out a
 * valid `appLanguage` from the pre-populated `postLanguage` values.
 *
 * The `appLanguage` will continue to be incorrect until the user returns to
 * language settings and selects a new option, at which point we'll re-save
 * their choice, which should then be a valid option. Since we don't know when
 * this will happen, we should leave this here until we feel it's safe to
 * remove, or we re-migrate their storage.
 */
export declare function sanitizeAppLanguageSetting(appLanguage: string): AppLanguage;
/**
 * Handles legacy migration for Java devices.
 *
 * {@link https://github.com/bluesky-social/social-app/pull/4461}
 * {@link https://xml.coverpages.org/iso639a.html}
 */
export declare function fixLegacyLanguageCode(code: string | null): string | null;
/**
 * Find the first language supported by our translation infra. Values should be
 * in order of preference, and match the values of {@link AppLanguage}.
 *
 * If no match, returns `en`.
 */
export declare function findSupportedAppLanguage(languageTags: (string | undefined)[]): string;
//# sourceMappingURL=helpers.d.ts.map