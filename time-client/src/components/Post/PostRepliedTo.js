import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import { Trans } from '@lingui/macro';
import { useSession } from '#/state/session';
import { UserInfoText } from '#/view/com/util/UserInfoText';
import { atoms as a, useTheme } from '#/alf';
import { ArrowCornerDownRight_Stroke2_Corner2_Rounded as ArrowCornerDownRightIcon } from '#/components/icons/ArrowCornerDownRight';
import { ProfileHoverCard } from '#/components/ProfileHoverCard';
import { Text } from '#/components/Typography';
export function PostRepliedTo({ parentAuthor, isParentBlocked, isParentNotFound, }) {
    const t = useTheme();
    const { currentAccount } = useSession();
    const textStyle = [a.text_sm, t.atoms.text_contrast_medium, a.leading_snug];
    let label;
    if (isParentBlocked) {
        label = _jsx(Trans, { context: "description", children: "Replied to a blocked post" });
    }
    else if (isParentNotFound) {
        label = _jsx(Trans, { context: "description", children: "Replied to a post" });
    }
    else if (parentAuthor) {
        const did = typeof parentAuthor === 'string' ? parentAuthor : parentAuthor.did;
        const isMe = currentAccount?.did === did;
        if (isMe) {
            label = _jsx(Trans, { context: "description", children: "Replied to you" });
        }
        else {
            label = (_jsxs(Trans, { context: "description", children: ["Replied to", ' ', _jsx(ProfileHoverCard, { did: did, children: _jsx(UserInfoText, { did: did, attr: "displayName", style: textStyle }) })] }));
        }
    }
    if (!label) {
        // Should not happen.
        return null;
    }
    return (_jsxs(View, { style: [a.flex_row, a.align_center, a.pb_xs, a.gap_xs], children: [_jsx(ArrowCornerDownRightIcon, { size: "xs", style: [t.atoms.text_contrast_medium, { top: -1 }] }), _jsx(Text, { style: textStyle, children: label })] }));
}
//# sourceMappingURL=PostRepliedTo.js.map