import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { AtUri, moderateUserList, } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';
import { sanitizeHandle } from '#/lib/strings/handles';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { precacheList } from '#/state/queries/feed';
import { useSession } from '#/state/session';
import { atoms as a, useTheme } from '#/alf';
import { Avatar, Description, Header, Outer, SaveButton, } from '#/components/FeedCard';
import { Link as InternalLink } from '#/components/Link';
import * as Hider from '#/components/moderation/Hider';
import { Text } from '#/components/Typography';
/*
 * This component is based on `FeedCard` and is tightly coupled with that
 * component. Please refer to `FeedCard` for more context.
 */
export { Avatar, AvatarPlaceholder, Description, Header, Outer, SaveButton, TitleAndBylinePlaceholder, } from '#/components/FeedCard';
const CURATELIST = 'app.bsky.graph.defs#curatelist';
const MODLIST = 'app.bsky.graph.defs#modlist';
export function Default(props) {
    const { view, showPinButton } = props;
    const moderationOpts = useModerationOpts();
    const moderation = moderationOpts
        ? moderateUserList(view, moderationOpts)
        : undefined;
    return (_jsx(Link, { ...props, children: _jsxs(Outer, { children: [_jsxs(Header, { children: [_jsx(Avatar, { src: view.avatar }), _jsx(TitleAndByline, { title: view.name, creator: view.creator, purpose: view.purpose, modUi: moderation?.ui('contentView') }), showPinButton && view.purpose === CURATELIST && (_jsx(SaveButton, { view: view, pin: true }))] }), _jsx(Description, { description: view.description })] }) }));
}
export function Link({ view, children, ...props }) {
    const queryClient = useQueryClient();
    const href = React.useMemo(() => {
        return createProfileListHref({ list: view });
    }, [view]);
    React.useEffect(() => {
        precacheList(queryClient, view);
    }, [view, queryClient]);
    return (_jsx(InternalLink, { label: view.name, to: href, ...props, children: children }));
}
export function TitleAndByline({ title, creator, purpose = CURATELIST, modUi, }) {
    const t = useTheme();
    const { _ } = useLingui();
    const { currentAccount } = useSession();
    return (_jsxs(View, { style: [a.flex_1], children: [_jsxs(Hider.Outer, { modui: modUi, isContentVisibleInitialState: creator && currentAccount?.did === creator.did, allowOverride: creator && currentAccount?.did === creator.did, children: [_jsx(Hider.Mask, { children: _jsx(Text, { style: [a.text_md, a.font_bold, a.leading_snug, a.italic], numberOfLines: 1, children: _jsx(Trans, { children: "Hidden list" }) }) }), _jsx(Hider.Content, { children: _jsx(Text, { emoji: true, style: [a.text_md, a.font_bold, a.leading_snug], numberOfLines: 1, children: title }) })] }), creator && (_jsx(Text, { emoji: true, style: [a.leading_snug, t.atoms.text_contrast_medium], numberOfLines: 1, children: purpose === MODLIST
                    ? _(msg `Moderation list by ${sanitizeHandle(creator.handle, '@')}`)
                    : _(msg `List by ${sanitizeHandle(creator.handle, '@')}`) }))] }));
}
export function createProfileListHref({ list, }) {
    const urip = new AtUri(list.uri);
    const handleOrDid = list.creator.handle || list.creator.did;
    return `/profile/${handleOrDid}/lists/${urip.rkey}`;
}
//# sourceMappingURL=ListCard.js.map