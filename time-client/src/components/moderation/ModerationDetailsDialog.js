import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useGetTimeAgo } from '#/lib/hooks/useTimeAgo';
import { useModerationCauseDescription } from '#/lib/moderation/useModerationCauseDescription';
import { makeProfileLink } from '#/lib/routes/links';
import { listUriToHref } from '#/lib/strings/url-helpers';
import { isNative } from '#/platform/detection';
import { useSession } from '#/state/session';
import { atoms as a, useGutters, useTheme } from '#/alf';
import * as Dialog from '#/components/Dialog';
import { InlineLinkText } from '#/components/Link';
import {} from '#/components/Pills';
import { Text } from '#/components/Typography';
export { useDialogControl as useModerationDetailsDialogControl } from '#/components/Dialog';
export function ModerationDetailsDialog(props) {
    return (_jsxs(Dialog.Outer, { control: props.control, children: [_jsx(Dialog.Handle, {}), _jsx(ModerationDetailsDialogInner, { ...props })] }));
}
function ModerationDetailsDialogInner({ modcause, control, }) {
    const t = useTheme();
    const xGutters = useGutters([0, 'base']);
    const { _ } = useLingui();
    const desc = useModerationCauseDescription(modcause);
    const { currentAccount } = useSession();
    const timeDiff = useGetTimeAgo({ future: true });
    let name;
    let description;
    if (!modcause) {
        name = _(msg `Content Warning`);
        description = _(msg `Moderator has chosen to set a general warning on the content.`);
    }
    else if (modcause.type === 'blocking') {
        if (modcause.source.type === 'list') {
            const list = modcause.source.list;
            name = _(msg `User Blocked by List`);
            description = (_jsxs(Trans, { children: ["This user is included in the", ' ', _jsx(InlineLinkText, { label: list.name, to: listUriToHref(list.uri), style: [a.text_sm], children: list.name }), ' ', "list which you have blocked."] }));
        }
        else {
            name = _(msg `User Blocked`);
            description = _(msg `You have blocked this user. You cannot view their content.`);
        }
    }
    else if (modcause.type === 'blocked-by') {
        name = _(msg `User Blocks You`);
        description = _(msg `This user has blocked you. You cannot view their content.`);
    }
    else if (modcause.type === 'block-other') {
        name = _(msg `Content Not Available`);
        description = _(msg `This content is not available because one of the users involved has blocked the other.`);
    }
    else if (modcause.type === 'muted') {
        if (modcause.source.type === 'list') {
            const list = modcause.source.list;
            name = _(msg `Account Muted by List`);
            description = (_jsxs(Trans, { children: ["This user is included in the", ' ', _jsx(InlineLinkText, { label: list.name, to: listUriToHref(list.uri), style: [a.text_sm], children: list.name }), ' ', "list which you have muted."] }));
        }
        else {
            name = _(msg `Account Muted`);
            description = _(msg `You have muted this account.`);
        }
    }
    else if (modcause.type === 'mute-word') {
        name = _(msg `Post Hidden by Muted Word`);
        description = _(msg `You've chosen to hide a word or tag within this post.`);
    }
    else if (modcause.type === 'hidden') {
        name = _(msg `Post Hidden by You`);
        description = _(msg `You have hidden this post.`);
    }
    else if (modcause.type === 'reply-hidden') {
        const isYou = currentAccount?.did === modcause.source.did;
        name = isYou
            ? _(msg `Reply Hidden by You`)
            : _(msg `Reply Hidden by Thread Author`);
        description = isYou
            ? _(msg `You hid this reply.`)
            : _(msg `The author of this thread has hidden this reply.`);
    }
    else if (modcause.type === 'label') {
        name = desc.name;
        description = (_jsx(Text, { emoji: true, style: [t.atoms.text, a.text_md, a.leading_snug], children: desc.description }));
    }
    else {
        // should never happen
        name = '';
        description = '';
    }
    const sourceName = desc.source || desc.sourceDisplayName || _(msg `an unknown labeler`);
    return (_jsxs(Dialog.ScrollableInner, { label: _(msg `Moderation details`), contentContainerStyle: {
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: 0,
        }, children: [_jsxs(View, { style: [xGutters, a.pb_lg], children: [_jsx(Text, { emoji: true, style: [t.atoms.text, a.text_2xl, a.font_heavy, a.mb_sm], children: name }), _jsx(Text, { style: [t.atoms.text, a.text_sm, a.leading_snug], children: description })] }), modcause?.type === 'label' && (_jsx(View, { style: [
                    xGutters,
                    a.py_md,
                    a.border_t,
                    !isNative && t.atoms.bg_contrast_25,
                    t.atoms.border_contrast_low,
                    {
                        borderBottomLeftRadius: a.rounded_md.borderRadius,
                        borderBottomRightRadius: a.rounded_md.borderRadius,
                    },
                ], children: modcause.source.type === 'user' ? (_jsx(Text, { style: [t.atoms.text, a.text_md, a.leading_snug], children: _jsx(Trans, { children: "This label was applied by the author." }) })) : (_jsx(_Fragment, { children: _jsxs(View, { style: [
                            a.flex_row,
                            a.justify_between,
                            a.gap_xl,
                            { paddingBottom: 1 },
                        ], children: [_jsx(Text, { style: [
                                    a.flex_1,
                                    a.leading_snug,
                                    t.atoms.text_contrast_medium,
                                ], numberOfLines: 1, children: _jsxs(Trans, { children: ["Source:", ' ', _jsx(InlineLinkText, { label: sourceName, to: makeProfileLink({
                                                did: modcause.label.src,
                                                handle: '',
                                            }), onPress: () => control.close(), children: sourceName })] }) }), modcause.label.exp && (_jsx(View, { children: _jsx(Text, { style: [
                                        a.leading_snug,
                                        a.text_sm,
                                        a.italic,
                                        t.atoms.text_contrast_medium,
                                    ], children: _jsxs(Trans, { children: ["Expires in ", timeDiff(Date.now(), modcause.label.exp)] }) }) }))] }) })) })), isNative && _jsx(View, { style: { height: 40 } }), _jsx(Dialog.Close, {})] }));
}
//# sourceMappingURL=ModerationDetailsDialog.js.map