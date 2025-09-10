import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AppBskyEmbedExternal, AppBskyEmbedImages, AppBskyEmbedRecord, AppBskyEmbedRecordWithMedia, AppBskyEmbedVideo, AppBskyFeedDefs, AppBskyFeedPost, AppBskyGraphDefs, AppBskyGraphStarterpack, AppBskyLabelerDefs, } from '@atproto/api';
import { ComponentChildren, h } from 'preact';
import { useMemo } from 'preact/hooks';
import infoIcon from '../../assets/circleInfo_stroke2_corner0_rounded.svg';
import playIcon from '../../assets/play_filled_corner2_rounded.svg';
import starterPackIcon from '../../assets/starterPack.svg';
import { CONTENT_LABELS, labelsToInfo } from '../labels';
import * as bsky from '../types/bsky';
import { getRkey } from '../util/rkey';
import { getVerificationState } from '../util/verification-state';
import { Link } from './link';
import { VerificationCheck } from './verification-check';
export function Embed({ content, labels, hideRecord, }) {
    const labelInfo = useMemo(() => labelsToInfo(labels), [labels]);
    if (!content)
        return null;
    try {
        // Case 1: Image
        if (AppBskyEmbedImages.isView(content)) {
            return _jsx(ImageEmbed, { content: content, labelInfo: labelInfo });
        }
        // Case 2: External link
        if (AppBskyEmbedExternal.isView(content)) {
            return _jsx(ExternalEmbed, { content: content, labelInfo: labelInfo });
        }
        // Case 3: Record (quote or linked post)
        if (AppBskyEmbedRecord.isView(content)) {
            if (hideRecord) {
                return null;
            }
            const record = content.record;
            // Case 3.1: Post
            if (AppBskyEmbedRecord.isViewRecord(record)) {
                const pwiOptOut = !!record.author.labels?.find(label => label.val === '!no-unauthenticated');
                if (pwiOptOut) {
                    return (_jsx(Info, { children: "The author of the quoted post has requested their posts not be displayed on external sites." }));
                }
                let text;
                if (AppBskyFeedPost.isRecord(record.value)) {
                    text = record.value.text;
                }
                const isAuthorLabeled = record.author.labels?.some(label => CONTENT_LABELS.includes(label.val));
                const verification = getVerificationState({ profile: record.author });
                return (_jsxs(Link, { href: `/profile/${record.author.did}/post/${getRkey(record)}`, className: "transition-colors hover:bg-neutral-100 dark:hover:bg-slate-700 border dark:border-slate-600 rounded-xl p-2 gap-1.5 w-full flex flex-col", children: [_jsxs("div", { className: "flex gap-1.5 items-center", children: [_jsx("div", { className: "w-4 h-4 rounded-full bg-neutral-300 dark:bg-slate-700 shrink-0", children: _jsx("img", { className: "rounded-full", src: record.author.avatar, style: isAuthorLabeled ? { filter: 'blur(1.5px)' } : undefined }) }), _jsxs("div", { className: "flex flex-1 items-center shrink min-w-0 min-h-0", children: [_jsx("p", { className: "block text-sm shrink-0 font-bold max-w-[70%] line-clamp-1", children: record.author.displayName?.trim() || record.author.handle }), verification.isVerified && (_jsx(VerificationCheck, { className: "ml-[3px] mt-px shrink-0 self-center", verifier: verification.role === 'verifier', size: 12 })), _jsxs("p", { className: "block line-clamp-1 text-sm text-textLight dark:text-textDimmed shrink-[10] ml-1", children: ["@", record.author.handle] })] })] }), text && _jsx("p", { className: "text-sm", children: text }), record.embeds?.map(embed => (_jsx(Embed, { content: embed, labels: record.labels, hideRecord: true }, embed.$type)))] }));
            }
            // Case 3.2: List
            if (AppBskyGraphDefs.isListView(record)) {
                return (_jsx(GenericWithImageEmbed, { image: record.avatar, title: record.name, href: `/profile/${record.creator.did}/lists/${getRkey(record)}`, subtitle: record.purpose === AppBskyGraphDefs.MODLIST
                        ? `Moderation list by @${record.creator.handle}`
                        : `User list by @${record.creator.handle}`, description: record.description }));
            }
            // Case 3.3: Feed
            if (AppBskyFeedDefs.isGeneratorView(record)) {
                return (_jsx(GenericWithImageEmbed, { image: record.avatar, title: record.displayName, href: `/profile/${record.creator.did}/feed/${getRkey(record)}`, subtitle: `Feed by @${record.creator.handle}`, description: `Liked by ${record.likeCount ?? 0} users` }));
            }
            // Case 3.4: Labeler
            if (AppBskyLabelerDefs.isLabelerView(record)) {
                // Embed type does not exist in the app, so show nothing
                return null;
            }
            // Case 3.5: Starter pack
            if (AppBskyGraphDefs.isStarterPackViewBasic(record)) {
                return _jsx(StarterPackEmbed, { content: record });
            }
            // Case 3.6: Post not found
            if (AppBskyEmbedRecord.isViewNotFound(record)) {
                return _jsx(Info, { children: "Quoted post not found, it may have been deleted." });
            }
            // Case 3.7: Post blocked
            if (AppBskyEmbedRecord.isViewBlocked(record)) {
                return _jsx(Info, { children: "The quoted post is blocked." });
            }
            // Case 3.8: Detached quote post
            if (AppBskyEmbedRecord.isViewDetached(record)) {
                // Just don't show anything
                return null;
            }
            // Unknown embed type
            return null;
        }
        // Case 4: Video
        if (AppBskyEmbedVideo.isView(content)) {
            return _jsx(VideoEmbed, { content: content });
        }
        // Case 5: Record with media
        if (AppBskyEmbedRecordWithMedia.isView(content) &&
            AppBskyEmbedRecord.isViewRecord(content.record.record)) {
            return (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(Embed, { content: content.media, labels: labels, hideRecord: hideRecord }), _jsx(Embed, { content: {
                            $type: 'app.bsky.embed.record#view',
                            record: content.record.record,
                        }, labels: content.record.record.labels, hideRecord: hideRecord })] }));
        }
        // Unknown embed type
        return null;
    }
    catch (err) {
        return (_jsx(Info, { children: err instanceof Error ? err.message : 'An error occurred' }));
    }
}
function Info({ children }) {
    return (_jsxs("div", { className: "w-full rounded-xl border py-2 px-2.5 flex-row flex gap-2 bg-neutral-50", children: [_jsx("img", { src: infoIcon, className: "w-4 h-4 shrink-0 mt-0.5" }), _jsx("p", { className: "text-sm text-textLight dark:text-textDimmed", children: children })] }));
}
function ImageEmbed({ content, labelInfo, }) {
    if (labelInfo) {
        return _jsx(Info, { children: labelInfo });
    }
    switch (content.images.length) {
        case 1:
            return (_jsx("img", { src: content.images[0].thumb, alt: content.images[0].alt, className: "w-full rounded-xl overflow-hidden object-cover h-auto max-h-[1000px]" }));
        case 2:
            return (_jsx("div", { className: "flex gap-1 rounded-xl overflow-hidden w-full aspect-[2/1]", children: content.images.map((image, i) => (_jsx("img", { src: image.thumb, alt: image.alt, className: "w-1/2 h-full object-cover rounded-sm" }, i))) }));
        case 3:
            return (_jsxs("div", { className: "flex gap-1 rounded-xl overflow-hidden w-full aspect-[2/1]", children: [_jsx("div", { className: "flex-1 aspect-square", children: _jsx("img", { src: content.images[0].thumb, alt: content.images[0].alt, className: "w-full h-full object-cover rounded-sm" }) }), _jsx("div", { className: "flex flex-col gap-1 flex-1", children: content.images.slice(1).map((image, i) => (_jsx("img", { src: image.thumb, alt: image.alt, className: "flex-1 object-cover rounded-sm min-h-0" }, i))) })] }));
        case 4:
            return (_jsx("div", { className: "grid grid-cols-2 gap-1 rounded-xl overflow-hidden", children: content.images.map((image, i) => (_jsx("img", { src: image.thumb, alt: image.alt, className: "aspect-[3/2] w-full object-cover rounded-sm" }, i))) }));
        default:
            return null;
    }
}
function ExternalEmbed({ content, labelInfo, }) {
    function toNiceDomain(url) {
        try {
            const urlp = new URL(url);
            return urlp.host ? urlp.host : url;
        }
        catch (e) {
            return url;
        }
    }
    if (labelInfo) {
        return _jsx(Info, { children: labelInfo });
    }
    return (_jsxs(Link, { href: content.external.uri, className: "w-full rounded-xl overflow-hidden border dark:border-slate-600 flex flex-col items-stretch", disableTracking: true, children: [content.external.thumb && (_jsx("img", { src: content.external.thumb, className: "aspect-[1.91/1] object-cover" })), _jsxs("div", { className: "py-3 px-4", children: [_jsx("p", { className: "text-sm text-textLight dark:text-textDimmed line-clamp-1", children: toNiceDomain(content.external.uri) }), _jsx("p", { className: "font-semibold line-clamp-3", children: content.external.title }), _jsx("p", { className: "text-sm text-textLight dark:text-textDimmed line-clamp-2 mt-0.5", children: content.external.description })] })] }));
}
function GenericWithImageEmbed({ title, subtitle, href, image, description, }) {
    return (_jsxs(Link, { href: href, className: "w-full rounded-xl border dark:border-slate-600 py-2 px-3 flex flex-col gap-2", children: [_jsxs("div", { className: "flex gap-2.5 items-center", children: [image ? (_jsx("img", { src: image, alt: title, className: "w-8 h-8 rounded-md bg-neutral-300 dark:bg-slate-700 shrink-0" })) : (_jsx("div", { className: "w-8 h-8 rounded-md bg-brand shrink-0" })), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-bold text-sm", children: title }), _jsx("p", { className: "text-textLight dark:text-textDimmed text-sm", children: subtitle })] })] }), description && (_jsx("p", { className: "text-textLight dark:text-textDimmed text-sm", children: description }))] }));
}
// just the thumbnail and a play button
function VideoEmbed({ content }) {
    let aspectRatio = 1;
    if (content.aspectRatio) {
        const { width, height } = content.aspectRatio;
        aspectRatio = clamp(width / height, 1 / 1, 3 / 1);
    }
    return (_jsxs("div", { className: "w-full overflow-hidden rounded-xl aspect-square relative", style: { aspectRatio: `${aspectRatio} / 1` }, children: [_jsx("img", { src: content.thumbnail, alt: content.alt, className: "object-cover size-full" }), _jsx("div", { className: "size-24 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 flex items-center justify-center", children: _jsx("img", { src: playIcon, className: "object-cover size-3/5" }) })] }));
}
function StarterPackEmbed({ content, }) {
    if (!bsky.dangerousIsType(content.record, AppBskyGraphStarterpack.isRecord)) {
        return null;
    }
    const starterPackHref = getStarterPackHref(content);
    const imageUri = getStarterPackImage(content);
    return (_jsxs(Link, { href: starterPackHref, className: "w-full rounded-xl overflow-hidden border dark:border-slate-600 flex flex-col items-stretch", children: [_jsx("img", { src: imageUri, className: "aspect-[1.91/1] object-cover" }), _jsxs("div", { className: "py-3 px-4", children: [_jsxs("div", { className: "flex space-x-2 items-center", children: [_jsx("img", { src: starterPackIcon, className: "w-10 h-10" }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold leading-[21px]", children: content.record.name }), _jsxs("p", { className: "text-sm text-textLight dark:text-textDimmed line-clamp-2 leading-[18px]", children: ["Starter pack by", ' ', content.creator.displayName || `@${content.creator.handle}`] })] })] }), content.record.description && (_jsx("p", { className: "text-sm mt-1", children: content.record.description })), !!content.joinedAllTimeCount && content.joinedAllTimeCount > 50 && (_jsxs("p", { className: "text-sm font-semibold text-textLight dark:text-textDimmed mt-1", children: [content.joinedAllTimeCount, " users have joined!"] }))] })] }));
}
// from #/lib/strings/starter-pack.ts
function getStarterPackImage(starterPack) {
    const rkey = getRkey({ uri: starterPack.uri });
    return `https://ogcard.cdn.bsky.app/start/${starterPack.creator.did}/${rkey}`;
}
function getStarterPackHref(starterPack) {
    const rkey = getRkey({ uri: starterPack.uri });
    const handleOrDid = starterPack.creator.handle || starterPack.creator.did;
    return `/starter-pack/${handleOrDid}/${rkey}`;
}
function clamp(num, min, max) {
    return Math.max(min, Math.min(num, max));
}
//# sourceMappingURL=embed.js.map