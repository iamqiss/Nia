/**
 * Normalized locales
 *
 * Handles legacy migration for Java devices.
 *
 * {@link https://github.com/bluesky-social/social-app/pull/4461}
 * {@link https://xml.coverpages.org/iso639a.html}
 *
 * Convert Chinese language tags for Native.
 *
 * {@link https://datatracker.ietf.org/doc/html/rfc5646#appendix-A}
 * {@link https://developer.apple.com/documentation/packagedescription/languagetag}
 * {@link https://gist.github.com/amake/0ac7724681ac1c178c6f95a5b09f03ce#new-locales-vs-old-locales-chinese}
 */
export declare function getLocales(): any[];
export declare const deviceLocales: any[];
/**
 * BCP-47 language tag without region e.g. array of 2-char lang codes
 *
 * {@link https://docs.expo.dev/versions/latest/sdk/localization/#locale}
 */
export declare const deviceLanguageCodes: any;
//# sourceMappingURL=deviceLocales.d.ts.map