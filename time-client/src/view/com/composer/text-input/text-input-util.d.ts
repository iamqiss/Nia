import { type AppBskyRichtextFacet, type RichText } from '@atproto/api';
export type LinkFacetMatch = {
    rt: RichText;
    facet: AppBskyRichtextFacet.Main;
};
export declare function suggestLinkCardUri(suggestLinkImmediately: boolean, nextDetectedUris: Map<string, LinkFacetMatch>, prevDetectedUris: Map<string, LinkFacetMatch>, pastSuggestedUris: Set<string>): string | undefined;
//# sourceMappingURL=text-input-util.d.ts.map