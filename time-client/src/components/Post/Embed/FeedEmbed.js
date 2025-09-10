import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from 'react';
import { moderateFeedGenerator } from '@atproto/api';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { atoms as a, useTheme } from '#/alf';
import * as FeedCard from '#/components/FeedCard';
import { ContentHider } from '#/components/moderation/ContentHider';
import {} from '#/types/bsky/post';
import {} from './types';
export function FeedEmbed({ embed, }) {
    const t = useTheme();
    return (_jsx(FeedCard.Link, { view: embed.view, style: [a.border, t.atoms.border_contrast_medium, a.p_md, a.rounded_sm], children: _jsxs(FeedCard.Outer, { children: [_jsxs(FeedCard.Header, { children: [_jsx(FeedCard.Avatar, { src: embed.view.avatar }), _jsx(FeedCard.TitleAndByline, { title: embed.view.displayName, creator: embed.view.creator })] }), _jsx(FeedCard.Likes, { count: embed.view.likeCount || 0 })] }) }));
}
export function ModeratedFeedEmbed({ embed, }) {
    const moderationOpts = useModerationOpts();
    const moderation = useMemo(() => {
        return moderationOpts
            ? moderateFeedGenerator(embed.view, moderationOpts)
            : undefined;
    }, [embed.view, moderationOpts]);
    return (_jsx(ContentHider, { modui: moderation?.ui('contentList'), childContainerStyle: [a.pt_xs], children: _jsx(FeedEmbed, { embed: embed }) }));
}
//# sourceMappingURL=FeedEmbed.js.map