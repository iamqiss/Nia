import { jsx as _jsx } from "react/jsx-runtime";
import { useMemo } from 'react';
import { View } from 'react-native';
import { AtUri } from '@atproto/api';
import { PressableScale } from '#/lib/custom-animations/PressableScale';
import { makeCustomFeedLink } from '#/lib/routes/links';
import { logger } from '#/logger';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import { atoms as a, native, useTheme } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import * as FeedCard from '#/components/FeedCard';
import { sizes as iconSizes } from '#/components/icons/common';
import { MagnifyingGlass2_Stroke2_Corner0_Rounded as SearchIcon } from '#/components/icons/MagnifyingGlass2';
import { Link } from '#/components/Link';
import { Text } from '#/components/Typography';
export function Container({ style, children, bottomBorder, }) {
    const t = useTheme();
    return (_jsx(View, { style: [
            a.flex_row,
            a.align_center,
            a.px_lg,
            a.pt_2xl,
            a.pb_md,
            a.gap_sm,
            t.atoms.bg,
            bottomBorder && [a.border_b, t.atoms.border_contrast_low],
            style,
        ], children: children }));
}
export function FeedLink({ feed, children, }) {
    const t = useTheme();
    const { host: did, rkey } = useMemo(() => new AtUri(feed.uri), [feed.uri]);
    return (_jsx(Link, { to: makeCustomFeedLink(did, rkey), label: feed.displayName, style: [a.flex_1], children: ({ focused, hovered, pressed }) => (_jsx(View, { style: [
                a.flex_1,
                a.flex_row,
                a.align_center,
                { gap: 10 },
                a.rounded_md,
                a.p_xs,
                { marginLeft: -6 },
                (focused || hovered || pressed) && t.atoms.bg_contrast_25,
            ], children: children })) }));
}
export function FeedAvatar({ feed }) {
    return _jsx(UserAvatar, { type: "algo", size: 38, avatar: feed.avatar });
}
export function Icon({ icon: Comp, size = 'lg', }) {
    const iconSize = iconSizes[size];
    return (_jsx(View, { style: [a.z_20, { width: iconSize, height: iconSize, marginLeft: -2 }], children: _jsx(Comp, { width: iconSize }) }));
}
export function TitleText({ style, ...props }) {
    return (_jsx(Text, { style: [a.font_bold, a.flex_1, a.text_xl, style], emoji: true, ...props }));
}
export function SubtitleText({ style, ...props }) {
    const t = useTheme();
    return (_jsx(Text, { style: [
            t.atoms.text_contrast_medium,
            a.leading_tight,
            a.flex_1,
            a.text_sm,
            style,
        ], ...props }));
}
export function SearchButton({ label, metricsTag, onPress, }) {
    return (_jsx(Button, { label: label, size: "small", variant: "ghost", color: "secondary", shape: "round", PressableComponent: native(PressableScale), onPress: () => {
            logger.metric('explore:module:searchButtonPress', { module: metricsTag }, { statsig: true });
            onPress?.();
        }, style: [
            {
                right: -4,
            },
        ], children: _jsx(ButtonIcon, { icon: SearchIcon, size: "lg" }) }));
}
export function PinButton({ feed }) {
    return (_jsx(View, { style: [a.z_20, { marginRight: -6 }], children: _jsx(FeedCard.SaveButton, { pin: true, view: feed, size: "large", color: "secondary", variant: "ghost", shape: "square", text: false }) }));
}
//# sourceMappingURL=ModuleHeader.js.map