import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Fragment, useMemo } from 'react';
import { Keyboard, Platform, View, } from 'react-native';
import { AppBskyFeedPost, AtUri, } from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { HITSLOP_10 } from '#/lib/constants';
import { makeListLink, makeProfileLink } from '#/lib/routes/links';
import { isNative } from '#/platform/detection';
import { threadgateViewToAllowUISetting, } from '#/state/queries/threadgate';
import { atoms as a, useTheme, web } from '#/alf';
import { Button, ButtonText } from '#/components/Button';
import * as Dialog from '#/components/Dialog';
import { useDialogControl } from '#/components/Dialog';
import { PostInteractionSettingsDialog, usePrefetchPostInteractionSettings, } from '#/components/dialogs/PostInteractionSettingsDialog';
import { CircleBanSign_Stroke2_Corner0_Rounded as CircleBanSign } from '#/components/icons/CircleBanSign';
import { Earth_Stroke2_Corner0_Rounded as Earth } from '#/components/icons/Globe';
import { Group3_Stroke2_Corner0_Rounded as Group } from '#/components/icons/Group';
import { InlineLinkText } from '#/components/Link';
import { Text } from '#/components/Typography';
import * as bsky from '#/types/bsky';
import { PencilLine_Stroke2_Corner0_Rounded as PencilLine } from './icons/Pencil';
export function WhoCanReply({ post, isThreadAuthor, style }) {
    const { _ } = useLingui();
    const t = useTheme();
    const infoDialogControl = useDialogControl();
    const editDialogControl = useDialogControl();
    /*
     * `WhoCanReply` is only used for root posts atm, in case this changes
     * unexpectedly, we should check to make sure it's for sure the root URI.
     */
    const rootUri = bsky.dangerousIsType(post.record, AppBskyFeedPost.isRecord) && post.record.reply?.root
        ? post.record.reply.root.uri
        : post.uri;
    const settings = useMemo(() => {
        return threadgateViewToAllowUISetting(post.threadgate);
    }, [post.threadgate]);
    const prefetchPostInteractionSettings = usePrefetchPostInteractionSettings({
        postUri: post.uri,
        rootPostUri: rootUri,
    });
    const anyoneCanReply = settings.length === 1 && settings[0].type === 'everybody';
    const noOneCanReply = settings.length === 1 && settings[0].type === 'nobody';
    const description = anyoneCanReply
        ? _(msg `Everybody can reply`)
        : noOneCanReply
            ? _(msg `Replies disabled`)
            : _(msg `Some people can reply`);
    const onPressOpen = () => {
        if (isNative && Keyboard.isVisible()) {
            Keyboard.dismiss();
        }
        if (isThreadAuthor) {
            editDialogControl.open();
        }
        else {
            infoDialogControl.open();
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx(Button, { label: isThreadAuthor ? _(msg `Edit who can reply`) : _(msg `Who can reply`), onPress: onPressOpen, ...(isThreadAuthor
                    ? Platform.select({
                        web: {
                            onHoverIn: prefetchPostInteractionSettings,
                        },
                        native: {
                            onPressIn: prefetchPostInteractionSettings,
                        },
                    })
                    : {}), hitSlop: HITSLOP_10, children: ({ hovered }) => (_jsxs(View, { style: [a.flex_row, a.align_center, a.gap_xs, style], children: [_jsx(Icon, { color: t.palette.contrast_400, width: 16, settings: settings }), _jsx(Text, { style: [
                                a.text_sm,
                                a.leading_tight,
                                t.atoms.text_contrast_medium,
                                hovered && a.underline,
                            ], children: description }), isThreadAuthor && (_jsx(PencilLine, { width: 12, fill: t.palette.primary_500 }))] })) }), isThreadAuthor ? (_jsx(PostInteractionSettingsDialog, { postUri: post.uri, rootPostUri: rootUri, control: editDialogControl, initialThreadgateView: post.threadgate })) : (_jsx(WhoCanReplyDialog, { control: infoDialogControl, post: post, settings: settings, embeddingDisabled: Boolean(post.viewer?.embeddingDisabled) }))] }));
}
function Icon({ color, width, settings, }) {
    const isEverybody = settings.length === 0 ||
        settings.every(setting => setting.type === 'everybody');
    const isNobody = !!settings.find(gate => gate.type === 'nobody');
    const IconComponent = isEverybody ? Earth : isNobody ? CircleBanSign : Group;
    return _jsx(IconComponent, { fill: color, width: width });
}
function WhoCanReplyDialog({ control, post, settings, embeddingDisabled, }) {
    const { _ } = useLingui();
    return (_jsxs(Dialog.Outer, { control: control, nativeOptions: { preventExpansion: true }, children: [_jsx(Dialog.Handle, {}), _jsxs(Dialog.ScrollableInner, { label: _(msg `Dialog: adjust who can interact with this post`), style: web({ maxWidth: 400 }), children: [_jsxs(View, { style: [a.gap_sm], children: [_jsx(Text, { style: [a.font_bold, a.text_xl, a.pb_sm], children: _jsx(Trans, { children: "Who can interact with this post?" }) }), _jsx(Rules, { post: post, settings: settings, embeddingDisabled: embeddingDisabled })] }), isNative && (_jsx(Button, { label: _(msg `Close`), onPress: () => control.close(), size: "small", variant: "solid", color: "secondary", style: [a.mt_5xl], children: _jsx(ButtonText, { children: _jsx(Trans, { children: "Close" }) }) })), _jsx(Dialog.Close, {})] })] }));
}
function Rules({ post, settings, embeddingDisabled, }) {
    const t = useTheme();
    return (_jsxs(_Fragment, { children: [_jsxs(Text, { style: [
                    a.text_sm,
                    a.leading_snug,
                    a.flex_wrap,
                    t.atoms.text_contrast_medium,
                ], children: [settings.length === 0 ? (_jsx(Trans, { children: "This post has an unknown type of threadgate on it. Your app may be out of date." })) : settings[0].type === 'everybody' ? (_jsx(Trans, { children: "Everybody can reply to this post." })) : settings[0].type === 'nobody' ? (_jsx(Trans, { children: "Replies to this post are disabled." })) : (_jsxs(Trans, { children: ["Only", ' ', settings.map((rule, i) => (_jsxs(Fragment, { children: [_jsx(Rule, { rule: rule, post: post, lists: post.threadgate.lists }), _jsx(Separator, { i: i, length: settings.length })] }, `rule-${i}`))), ' ', "can reply."] })), ' '] }), embeddingDisabled && (_jsx(Text, { style: [
                    a.text_sm,
                    a.leading_snug,
                    a.flex_wrap,
                    t.atoms.text_contrast_medium,
                ], children: _jsx(Trans, { children: "No one but the author can quote this post." }) }))] }));
}
function Rule({ rule, post, lists, }) {
    if (rule.type === 'mention') {
        return _jsx(Trans, { children: "mentioned users" });
    }
    if (rule.type === 'followers') {
        return (_jsxs(Trans, { children: ["users following", ' ', _jsxs(InlineLinkText, { label: `@${post.author.handle}`, to: makeProfileLink(post.author), style: [a.text_sm, a.leading_snug], children: ["@", post.author.handle] })] }));
    }
    if (rule.type === 'following') {
        return (_jsxs(Trans, { children: ["users followed by", ' ', _jsxs(InlineLinkText, { label: `@${post.author.handle}`, to: makeProfileLink(post.author), style: [a.text_sm, a.leading_snug], children: ["@", post.author.handle] })] }));
    }
    if (rule.type === 'list') {
        const list = lists?.find(l => l.uri === rule.list);
        if (list) {
            const listUrip = new AtUri(list.uri);
            return (_jsxs(Trans, { children: [_jsx(InlineLinkText, { label: list.name, to: makeListLink(listUrip.hostname, listUrip.rkey), style: [a.text_sm, a.leading_snug], children: list.name }), ' ', "members"] }));
        }
    }
}
function Separator({ i, length }) {
    if (length < 2 || i === length - 1) {
        return null;
    }
    if (i === length - 2) {
        return (_jsxs(_Fragment, { children: [length > 2 ? ',' : '', " ", _jsx(Trans, { children: "and" }), ' '] }));
    }
    return _jsx(_Fragment, { children: ", " });
}
//# sourceMappingURL=WhoCanReply.js.map