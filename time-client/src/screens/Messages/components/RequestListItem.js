import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { Trans } from '@lingui/macro';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import { useSession } from '#/state/session';
import { atoms as a, tokens } from '#/alf';
import { KnownFollowers } from '#/components/KnownFollowers';
import { Text } from '#/components/Typography';
import { ChatListItem } from './ChatListItem';
import { AcceptChatButton, DeleteChatButton, RejectMenu } from './RequestButtons';
export function RequestListItem({ convo }) {
    const { currentAccount } = useSession();
    const moderationOpts = useModerationOpts();
    const otherUser = convo.members.find(member => member.did !== currentAccount?.did);
    if (!otherUser || !moderationOpts) {
        return null;
    }
    const isDeletedAccount = otherUser.handle === 'missing.invalid';
    return (_jsxs(View, { style: [a.relative, a.flex_1], children: [_jsxs(ChatListItem, { convo: convo, showMenu: false, children: [_jsx(View, { style: [a.pt_xs, a.pb_2xs], children: _jsx(KnownFollowers, { profile: otherUser, moderationOpts: moderationOpts, minimal: true, showIfEmpty: true }) }), _jsx(View, { style: [a.pt_md, a.pb_xs, a.w_full, { opacity: 0 }], "aria-hidden": true, children: _jsx(Text, { style: [a.text_xs, a.leading_tight, a.font_bold], children: _jsx(Trans, { comment: "Accept a chat request", children: "Accept Request" }) }) })] }), _jsx(View, { style: [
                    a.absolute,
                    a.pr_md,
                    a.w_full,
                    a.flex_row,
                    a.align_center,
                    a.gap_sm,
                    {
                        bottom: tokens.space.md,
                        paddingLeft: tokens.space.lg + 52 + tokens.space.md,
                    },
                ], children: !isDeletedAccount ? (_jsxs(_Fragment, { children: [_jsx(AcceptChatButton, { convo: convo, currentScreen: "list" }), _jsx(RejectMenu, { convo: convo, profile: otherUser, showDeleteConvo: true, currentScreen: "list" })] })) : (_jsxs(_Fragment, { children: [_jsx(DeleteChatButton, { convo: convo, currentScreen: "list" }), _jsx(View, { style: a.flex_1 })] })) })] }));
}
//# sourceMappingURL=RequestListItem.js.map