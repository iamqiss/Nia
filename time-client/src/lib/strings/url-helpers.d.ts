export declare const BSKY_APP_HOST = "https://bsky.app";
export declare function isValidDomain(str: string): boolean;
export declare function makeRecordUri(didOrName: string, collection: string, rkey: string): any;
export declare function toNiceDomain(url: string): string;
export declare function toShortUrl(url: string): string;
export declare function toShareUrl(url: string): string;
export declare function toBskyAppUrl(url: string): string;
export declare function isBskyAppUrl(url: string): boolean;
export declare function isRelativeUrl(url: string): boolean;
export declare function isBskyRSSUrl(url: string): boolean;
export declare function isExternalUrl(url: string): boolean;
export declare function isTrustedUrl(url: string): boolean;
export declare function isBskyPostUrl(url: string): boolean;
export declare function isBskyCustomFeedUrl(url: string): boolean;
export declare function isBskyListUrl(url: string): boolean;
export declare function isBskyStartUrl(url: string): boolean;
export declare function isBskyStarterPackUrl(url: string): boolean;
export declare function isBskyDownloadUrl(url: string): boolean;
export declare function convertBskyAppUrlIfNeeded(url: string): string;
export declare function listUriToHref(url: string): string;
export declare function feedUriToHref(url: string): string;
export declare function postUriToRelativePath(uri: string, options?: {
    handle?: string;
}): string | undefined;
/**
 * Checks if the label in the post text matches the host of the link facet.
 *
 * Hosts are case-insensitive, so should be lowercase for comparison.
 * @see https://www.rfc-editor.org/rfc/rfc3986#section-3.2.2
 */
export declare function linkRequiresWarning(uri: string, label: string): boolean;
/**
 * Returns a lowercase domain hostname if the label is a valid URL.
 *
 * Hosts are case-insensitive, so should be lowercase for comparison.
 * @see https://www.rfc-editor.org/rfc/rfc3986#section-3.2.2
 */
export declare function labelToDomain(label: string): string | undefined;
export declare function isPossiblyAUrl(str: string): boolean;
export declare function splitApexDomain(hostname: string): [string, string];
export declare function createBskyAppAbsoluteUrl(path: string): string;
export declare function createProxiedUrl(url: string): string;
export declare function isShortLink(url: string): boolean;
export declare function shortLinkToHref(url: string): string;
export declare function getHostnameFromUrl(url: string | URL): string | null;
export declare function getServiceAuthAudFromUrl(url: string | URL): string | null;
export declare function definitelyUrl(maybeUrl: string): string | null;
//# sourceMappingURL=url-helpers.d.ts.map