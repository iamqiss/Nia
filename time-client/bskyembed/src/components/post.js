import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppBskyFeedDefs, AppBskyFeedPost, AppBskyRichtextFacet, RichText, } from '@atproto/api';
import { h } from 'preact';
import replyIcon from '../../assets/bubble_filled_stroke2_corner2_rounded.svg';
import likeIcon from '../../assets/heart2_filled_stroke2_corner0_rounded.svg';
import logo from '../../assets/logo.svg';
import repostIcon from '../../assets/repost_stroke2_corner2_rounded.svg';
import { CONTENT_LABELS } from '../labels';
import * as bsky from '../types/bsky';
import { niceDate } from '../util/nice-date';
import { prettyNumber } from '../util/pretty-number';
import { getRkey } from '../util/rkey';
import { getVerificationState } from '../util/verification-state';
import { Container } from './container';
import { Embed } from './embed';
import { Link } from './link';
import { VerificationCheck } from './verification-check';
export function Post({ thread }) {
    const post = thread.post;
    const isAuthorLabeled = post.author.labels?.some(label => CONTENT_LABELS.includes(label.val));
    let record = null;
    if (bsky.dangerousIsType(post.record, AppBskyFeedPost.isRecord)) {
        record = post.record;
    }
    const verification = getVerificationState({ profile: post.author });
    const href = `/profile/${post.author.did}/post/${getRkey(post)}`;
    return (_jsx(Container, { href: href, children: _jsxs("div", { className: "flex-1 flex-col flex gap-2", lang: record?.langs?.[0], children: [_jsxs("div", { className: "flex gap-2.5 items-center cursor-pointer w-full max-w-full", children: [_jsx(Link, { href: `/profile/${post.author.did}`, className: "rounded-full shrink-0", children: _jsx("div", { className: "w-10 h-10 overflow-hidden rounded-full bg-neutral-300 dark:bg-slate-700 shrink-0", children: _jsx("img", { src: post.author.avatar, style: isAuthorLabeled ? { filter: 'blur(2.5px)' } : undefined }) }) }), _jsxs("div", { className: "flex flex-1 flex-col min-w-0", children: [_jsxs("div", { className: "flex flex-1 items-center", children: [_jsx(Link, { href: `/profile/${post.author.did}`, className: "block font-bold text-[17px] leading-5 line-clamp-1 hover:underline underline-offset-2 text-ellipsis decoration-2", children: post.author.displayName?.trim() || post.author.handle }), verification.isVerified && (_jsx(VerificationCheck, { className: "pl-[3px] mt-px shrink-0", verifier: verification.role === 'verifier', size: 15 }))] }), _jsxs(Link, { href: `/profile/${post.author.did}`, className: "block text-[15px] text-textLight dark:text-textDimmed hover:underline line-clamp-1", children: ["@", post.author.handle] })] }), _jsx(Link, { href: href, className: "transition-transform hover:scale-110 shrink-0 self-start", children: _jsx("img", { src: logo, className: "h-8" }) })] }), _jsx(PostContent, { record: record }), _jsx(Embed, { content: post.embed, labels: post.labels }), _jsx(Link, { href: href, children: _jsx("time", { datetime: new Date(post.indexedAt).toISOString(), className: "text-textLight dark:text-textDimmed mt-1 text-sm hover:underline", children: niceDate(post.indexedAt) }) }), _jsxs("div", { className: "border-t dark:border-slate-600 w-full pt-2.5 flex items-center gap-5 text-sm cursor-pointer", children: [!!post.likeCount && (_jsxs("div", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("img", { src: likeIcon, className: "w-5 h-5" }), _jsx("p", { className: "font-bold text-neutral-500 dark:text-neutral-300 mb-px", children: prettyNumber(post.likeCount) })] })), !!post.repostCount && (_jsxs("div", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("img", { src: repostIcon, className: "w-5 h-5" }), _jsx("p", { className: "font-bold text-neutral-500 dark:text-neutral-300 mb-px", children: prettyNumber(post.repostCount) })] })), _jsxs("div", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("img", { src: replyIcon, className: "w-5 h-5" }), _jsx("p", { className: "font-bold text-neutral-500 dark:text-neutral-300 mb-px", children: "Reply" })] }), _jsx("div", { className: "flex-1" }), _jsx("p", { className: "cursor-pointer text-brand dark:text-brandLighten font-bold hover:underline hidden min-[450px]:inline", children: post.replyCount
                                ? `Read ${prettyNumber(post.replyCount)} ${post.replyCount > 1 ? 'replies' : 'reply'} on Bluesky`
                                : `View on Bluesky` }), _jsxs("p", { className: "cursor-pointer text-brand font-bold hover:underline min-[450px]:hidden", children: [_jsx("span", { className: "hidden min-[380px]:inline", children: "View on " }), "Bluesky"] })] })] }) }));
}
function PostContent({ record }) {
    if (!record)
        return null;
    const rt = new RichText({
        text: record.text,
        facets: record.facets,
    });
    const richText = [];
    let counter = 0;
    for (const segment of rt.segments()) {
        if (segment.link &&
            AppBskyRichtextFacet.validateLink(segment.link).success) {
            richText.push(_jsx(Link, { href: segment.link.uri, className: "text-blue-500 hover:underline", disableTracking: !segment.link.uri.startsWith('https://bsky.app') &&
                    !segment.link.uri.startsWith('https://go.bsky.app'), children: segment.text }, counter));
        }
        else if (segment.mention &&
            AppBskyRichtextFacet.validateMention(segment.mention).success) {
            richText.push(_jsx(Link, { href: `/profile/${segment.mention.did}`, className: "text-blue-500 hover:underline", children: segment.text }, counter));
        }
        else if (segment.tag &&
            AppBskyRichtextFacet.validateTag(segment.tag).success) {
            richText.push(_jsx(Link, { href: `/hashtag/${segment.tag.tag}`, className: "text-blue-500 hover:underline", children: segment.text }, counter));
        }
        else {
            richText.push(segment.text);
        }
        counter++;
    }
    return (_jsx("p", { className: "min-[300px]:text-lg leading-6 min-[300px]:leading-6 break-word break-words whitespace-pre-wrap", children: richText }));
}
//# sourceMappingURL=post.js.map