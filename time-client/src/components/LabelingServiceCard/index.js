import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { View } from 'react-native';
import {} from '@atproto/api';
import { msg, Plural, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { getLabelingServiceTitle } from '#/lib/moderation';
import { sanitizeHandle } from '#/lib/strings/handles';
import { useLabelerInfoQuery } from '#/state/queries/labeler';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, useTheme } from '#/alf';
import { Flag_Stroke2_Corner0_Rounded as Flag } from '#/components/icons/Flag';
import { Link as InternalLink } from '#/components/Link';
import { RichText } from '#/components/RichText';
import { Text } from '#/components/Typography';
import { ChevronRight_Stroke2_Corner0_Rounded as ChevronRight } from '../icons/Chevron';
export function Outer({ children, style, }) {
    return (_jsx(View, { style: [
            a.flex_row,
            a.gap_md,
            a.w_full,
            a.p_lg,
            a.pr_md,
            a.overflow_hidden,
            style,
        ], children: children }));
}
export function Avatar({ avatar }) {
    return _jsx(UserAvatar, { type: "labeler", size: 40, avatar: avatar });
}
export function Title({ value }) {
    return (_jsx(Text, { emoji: true, style: [a.text_md, a.font_bold, a.leading_tight], children: value }));
}
export function Description({ value, handle }) {
    const { _ } = useLingui();
    return value ? (_jsx(Text, { numberOfLines: 2, children: _jsx(RichText, { value: value, style: [a.leading_snug] }) })) : (_jsx(Text, { emoji: true, style: [a.leading_snug], children: _(msg `By ${sanitizeHandle(handle, '@')}`) }));
}
export function RegionalNotice() {
    const t = useTheme();
    return (_jsxs(View, { style: [
            a.flex_row,
            a.align_center,
            a.gap_xs,
            a.pt_2xs,
            { marginLeft: -2 },
        ], children: [_jsx(Flag, { fill: t.atoms.text_contrast_low.color, size: "sm" }), _jsx(Text, { style: [a.italic, a.leading_snug], children: _jsx(Trans, { children: "Required in your region" }) })] }));
}
export function LikeCount({ likeCount }) {
    const t = useTheme();
    return (_jsx(Text, { style: [
            a.mt_sm,
            a.text_sm,
            t.atoms.text_contrast_medium,
            { fontWeight: '600' },
        ], children: _jsxs(Trans, { children: ["Liked by ", _jsx(Plural, { value: likeCount, one: "# user", other: "# users" })] }) }));
}
export function Content({ children }) {
    const t = useTheme();
    return (_jsxs(View, { style: [
            a.flex_1,
            a.flex_row,
            a.gap_md,
            a.align_center,
            a.justify_between,
        ], children: [_jsx(View, { style: [a.gap_2xs, a.flex_1], children: children }), _jsx(ChevronRight, { size: "md", style: [a.z_10, t.atoms.text_contrast_low] })] }));
}
/**
 * The canonical view for a labeling service. Use this or compose your own.
 */
export function Default({ labeler, style, }) {
    return (_jsxs(Outer, { style: style, children: [_jsx(Avatar, { avatar: labeler.creator.avatar }), _jsxs(Content, { children: [_jsx(Title, { value: getLabelingServiceTitle({
                            displayName: labeler.creator.displayName,
                            handle: labeler.creator.handle,
                        }) }), _jsx(Description, { value: labeler.creator.description, handle: labeler.creator.handle }), labeler.likeCount ? _jsx(LikeCount, { likeCount: labeler.likeCount }) : null] })] }));
}
export function Link({ children, labeler, }) {
    const { _ } = useLingui();
    return (_jsx(InternalLink, { to: {
            screen: 'Profile',
            params: {
                name: labeler.creator.handle,
            },
        }, label: _(msg `View the labeling service provided by @${labeler.creator.handle}`), children: children }));
}
// TODO not finished yet
export function DefaultSkeleton() {
    return (_jsx(View, { children: _jsx(Text, { children: "Loading" }) }));
}
export function Loader({ did, loading: LoadingComponent = DefaultSkeleton, error: ErrorComponent, component: Component, }) {
    const { isLoading, data, error } = useLabelerInfoQuery({ did });
    return isLoading ? (LoadingComponent ? (_jsx(LoadingComponent, {})) : null) : error || !data ? (ErrorComponent ? (_jsx(ErrorComponent, { error: error?.message || 'Unknown error' })) : null) : (_jsx(Component, { labeler: data }));
}
//# sourceMappingURL=index.js.map