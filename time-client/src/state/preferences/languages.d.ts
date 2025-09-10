import React from 'react';
export declare function Provider({ children }: React.PropsWithChildren<{}>): any;
export declare function useLanguagePrefs(): any;
export declare function useLanguagePrefsApi(): any;
export declare function getContentLanguages(): any;
/**
 * Be careful with this. It's used for the PWI home screen so that users can
 * select a UI language and have it apply to the fetched Discover feed.
 *
 * We only support BCP-47 two-letter codes here, hence the split.
 */
export declare function getAppLanguageAsContentLanguage(): any;
export declare function toPostLanguages(postLanguage: string): string[];
export declare function hasPostLanguage(postLanguage: string, code2: string): boolean;
//# sourceMappingURL=languages.d.ts.map