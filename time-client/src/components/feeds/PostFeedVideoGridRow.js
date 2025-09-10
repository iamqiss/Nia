import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { AppBskyEmbedVideo } from '@atproto/api';
import { logEvent } from '#/lib/statsig/statsig';
import {} from '#/state/queries/post-feed';
import {} from '#/screens/VideoFeed/types';
import { atoms as a, useGutters } from '#/alf';
import * as Grid from '#/components/Grid';
import { VideoPostCard, VideoPostCardPlaceholder, } from '#/components/VideoPostCard';
export function PostFeedVideoGridRow({ items: slices, sourceContext, }) {
    const gutters = useGutters(['base', 'base', 0, 'base']);
    const posts = slices
        .filter(slice => AppBskyEmbedVideo.isView(slice.post.embed))
        .map(slice => ({
        post: slice.post,
        moderation: slice.moderation,
    }));
    /**
     * This should not happen because we should be filtering out posts without
     * videos within the `PostFeed` component.
     */
    if (posts.length !== slices.length)
        return null;
    return (_jsx(View, { style: [gutters], children: _jsx(View, { style: [a.flex_row, a.gap_sm], children: _jsx(Grid.Row, { gap: a.gap_sm.gap, children: posts.map(post => (_jsx(Grid.Col, { width: 1 / 2, children: _jsx(VideoPostCard, { post: post.post, sourceContext: sourceContext, moderation: post.moderation, onInteract: () => {
                            logEvent('videoCard:click', { context: 'feed' });
                        } }) }, post.post.uri))) }) }) }));
}
export function PostFeedVideoGridRowPlaceholder() {
    const gutters = useGutters(['base', 'base', 0, 'base']);
    return (_jsx(View, { style: [gutters], children: _jsxs(View, { style: [a.flex_row, a.gap_sm], children: [_jsx(VideoPostCardPlaceholder, {}), _jsx(VideoPostCardPlaceholder, {})] }) }));
}
//# sourceMappingURL=PostFeedVideoGridRow.js.map