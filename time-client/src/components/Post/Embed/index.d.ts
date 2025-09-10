import { type EmbedType } from '#/types/bsky/post';
import { type CommonProps, type EmbedProps, QuoteEmbedViewContext } from './types';
export { PostEmbedViewContext, QuoteEmbedViewContext } from './types';
export declare function Embed({ embed: rawEmbed, ...rest }: EmbedProps): any;
export declare function PostDetachedEmbed({ embed, }: {
    embed: EmbedType<'post_detached'>;
}): any;
export declare function QuoteEmbed({ embed, onOpen, style, isWithinQuote: parentIsWithinQuote, allowNestedQuotes: parentAllowNestedQuotes, }: Omit<CommonProps, 'viewContext'> & {
    embed: EmbedType<'post'>;
    viewContext?: QuoteEmbedViewContext;
}): any;
//# sourceMappingURL=index.d.ts.map