import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { AtUri, RichText as RichTextApi, } from '@atproto/api';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useQueryClient } from '@tanstack/react-query';
import { sanitizeHandle } from '#/lib/strings/handles';
import { logger } from '#/logger';
import { precacheFeedFromGeneratorView } from '#/state/queries/feed';
import { useAddSavedFeedsMutation, usePreferencesQuery, useRemoveFeedMutation, } from '#/state/queries/preferences';
import { useSession } from '#/state/session';
import * as Toast from '#/view/com/util/Toast';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon, ButtonText, } from '#/components/Button';
import { Pin_Stroke2_Corner0_Rounded as PinIcon } from '#/components/icons/Pin';
import { Link as InternalLink } from '#/components/Link';
import { Loader } from '#/components/Loader';
import * as Prompt from '#/components/Prompt';
import { RichText } from '#/components/RichText';
import { Text } from '#/components/Typography';
import { Trash_Stroke2_Corner0_Rounded as TrashIcon } from './icons/Trash';
export function Default(props) {
    const { view } = props;
    return (_jsx(Link, { ...props, children: _jsxs(Outer, { children: [_jsxs(Header, { children: [_jsx(Avatar, { src: view.avatar }), _jsx(TitleAndByline, { title: view.displayName, creator: view.creator }), _jsx(SaveButton, { view: view, pin: true })] }), _jsx(Description, { description: view.description }), _jsx(Likes, { count: view.likeCount || 0 })] }) }));
}
export function Link({ view, children, ...props }) {
    const queryClient = useQueryClient();
    const href = React.useMemo(() => {
        return createProfileFeedHref({ feed: view });
    }, [view]);
    React.useEffect(() => {
        precacheFeedFromGeneratorView(queryClient, view);
    }, [view, queryClient]);
    return (_jsx(InternalLink, { label: view.displayName, to: href, style: [a.flex_col], ...props, children: children }));
}
export function Outer({ children }) {
    return _jsx(View, { style: [a.w_full, a.gap_sm], children: children });
}
export function Header({ children }) {
    return _jsx(View, { style: [a.flex_row, a.align_center, a.gap_sm], children: children });
}
export function Avatar({ src, size = 40 }) {
    return _jsx(UserAvatar, { type: "algo", size: size, avatar: src });
}
export function AvatarPlaceholder({ size = 40 }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            t.atoms.bg_contrast_25,
            {
                width: size,
                height: size,
                borderRadius: 8,
            },
        ] }));
}
export function TitleAndByline({ title, creator, }) {
    const t = useTheme();
    return (_jsxs(View, { style: [a.flex_1], children: [_jsx(Text, { emoji: true, style: [a.text_md, a.font_bold, a.leading_snug], numberOfLines: 1, children: title }), creator && (_jsx(Text, { style: [a.leading_snug, t.atoms.text_contrast_medium], numberOfLines: 1, children: _jsxs(Trans, { children: ["Feed by ", sanitizeHandle(creator.handle, '@')] }) }))] }));
}
export function TitleAndBylinePlaceholder({ creator }) {
    const t = useTheme();
    return (_jsxs(View, { style: [a.flex_1, a.gap_xs], children: [_jsx(View, { style: [
                    a.rounded_xs,
                    t.atoms.bg_contrast_50,
                    {
                        width: '60%',
                        height: 14,
                    },
                ] }), creator && (_jsx(View, { style: [
                    a.rounded_xs,
                    t.atoms.bg_contrast_25,
                    {
                        width: '40%',
                        height: 10,
                    },
                ] }))] }));
}
export function Description({ description, ...rest }) {
    const rt = React.useMemo(() => {
        if (!description)
            return;
        const rt = new RichTextApi({ text: description || '' });
        rt.detectFacetsWithoutResolution();
        return rt;
    }, [description]);
    if (!rt)
        return null;
    return _jsx(RichText, { value: rt, style: [a.leading_snug], disableLinks: true, ...rest });
}
export function DescriptionPlaceholder() {
    const t = useTheme();
    return (_jsxs(View, { style: [a.gap_xs], children: [_jsx(View, { style: [a.rounded_xs, a.w_full, t.atoms.bg_contrast_50, { height: 12 }] }), _jsx(View, { style: [a.rounded_xs, a.w_full, t.atoms.bg_contrast_50, { height: 12 }] }), _jsx(View, { style: [
                    a.rounded_xs,
                    a.w_full,
                    t.atoms.bg_contrast_50,
                    { height: 12, width: 100 },
                ] })] }));
}
export function Likes({ count }) {
    const t = useTheme();
    return (_jsx(Text, { style: [a.text_sm, t.atoms.text_contrast_medium, a.font_bold], children: _jsxs(Trans, { children: ["Liked by ", _jsx(Plural, { value: count || 0, one: "# user", other: "# users" })] }) }));
}
export function SaveButton({ view, pin, ...props }) {
    const { hasSession } = useSession();
    if (!hasSession)
        return null;
    return _jsx(SaveButtonInner, { view: view, pin: pin, ...props });
}
function SaveButtonInner({ view, pin, text = true, ...buttonProps }) {
    const { _ } = useLingui();
    const { data: preferences } = usePreferencesQuery();
    const { isPending: isAddSavedFeedPending, mutateAsync: saveFeeds } = useAddSavedFeedsMutation();
    const { isPending: isRemovePending, mutateAsync: removeFeed } = useRemoveFeedMutation();
    const uri = view.uri;
    const type = view.uri.includes('app.bsky.feed.generator') ? 'feed' : 'list';
    const savedFeedConfig = React.useMemo(() => {
        return preferences?.savedFeeds?.find(feed => feed.value === uri);
    }, [preferences?.savedFeeds, uri]);
    const removePromptControl = Prompt.usePromptControl();
    const isPending = isAddSavedFeedPending || isRemovePending;
    const toggleSave = React.useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            if (savedFeedConfig) {
                await removeFeed(savedFeedConfig);
            }
            else {
                await saveFeeds([
                    {
                        type,
                        value: uri,
                        pinned: pin || false,
                    },
                ]);
            }
            Toast.show(_(msg({ message: 'Feeds updated!', context: 'toast' })));
        }
        catch (err) {
            logger.error(err, { message: `FeedCard: failed to update feeds`, pin });
            Toast.show(_(msg `Failed to update feeds`), 'xmark');
        }
    }, [_, pin, saveFeeds, removeFeed, uri, savedFeedConfig, type]);
    const onPrompRemoveFeed = React.useCallback(async (e) => {
        e.preventDefault();
        e.stopPropagation();
        removePromptControl.open();
    }, [removePromptControl]);
    return (_jsxs(_Fragment, { children: [_jsx(Button, { disabled: isPending, label: _(msg `Add this feed to your feeds`), size: "small", variant: "solid", color: savedFeedConfig ? 'secondary' : 'primary', onPress: savedFeedConfig ? onPrompRemoveFeed : toggleSave, ...buttonProps, children: savedFeedConfig ? (_jsxs(_Fragment, { children: [isPending ? (_jsx(ButtonIcon, { size: "md", icon: Loader })) : (!text && _jsx(ButtonIcon, { size: "md", icon: TrashIcon })), text && (_jsx(ButtonText, { children: _jsx(Trans, { children: "Unpin Feed" }) }))] })) : (_jsxs(_Fragment, { children: [_jsx(ButtonIcon, { size: "md", icon: isPending ? Loader : PinIcon }), text && (_jsx(ButtonText, { children: _jsx(Trans, { children: "Pin Feed" }) }))] })) }), _jsx(Prompt.Basic, { control: removePromptControl, title: _(msg `Remove from your feeds?`), description: _(msg `Are you sure you want to remove this from your feeds?`), onConfirm: toggleSave, confirmButtonCta: _(msg `Remove`), confirmButtonColor: "negative" })] }));
}
export function createProfileFeedHref({ feed, }) {
    const urip = new AtUri(feed.uri);
    const handleOrDid = feed.creator.handle || feed.creator.did;
    return `/profile/${handleOrDid}/feed/${urip.rkey}`;
}
//# sourceMappingURL=FeedCard.js.map