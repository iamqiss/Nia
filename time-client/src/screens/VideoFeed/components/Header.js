import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback } from 'react';
import { View } from 'react-native';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useNavigation } from '@react-navigation/native';
import { HITSLOP_30 } from '#/lib/constants';
import {} from '#/lib/routes/types';
import { sanitizeHandle } from '#/lib/strings/handles';
import { useFeedSourceInfoQuery } from '#/state/queries/feed';
import { UserAvatar } from '#/view/com/util/UserAvatar';
import {} from '#/screens/VideoFeed/types';
import { atoms as a, useBreakpoints } from '#/alf';
import { Button } from '#/components/Button';
import { ArrowLeft_Stroke2_Corner0_Rounded as ArrowLeft } from '#/components/icons/Arrow';
import * as Layout from '#/components/Layout';
import { BUTTON_VISUAL_ALIGNMENT_OFFSET } from '#/components/Layout/const';
import { Text } from '#/components/Typography';
export function HeaderPlaceholder() {
    return (_jsxs(View, { style: [a.flex_1, a.flex_row, a.align_center, a.gap_sm], children: [_jsx(View, { style: [
                    a.rounded_sm,
                    {
                        width: 36,
                        height: 36,
                        backgroundColor: 'white',
                        opacity: 0.8,
                    },
                ] }), _jsxs(View, { style: [a.flex_1, a.gap_xs], children: [_jsx(View, { style: [
                            a.w_full,
                            a.rounded_xs,
                            {
                                backgroundColor: 'white',
                                height: 14,
                                width: 80,
                                opacity: 0.8,
                            },
                        ] }), _jsx(View, { style: [
                            a.w_full,
                            a.rounded_xs,
                            {
                                backgroundColor: 'white',
                                height: 10,
                                width: 140,
                                opacity: 0.6,
                            },
                        ] })] })] }));
}
export function Header({ sourceContext, }) {
    let content = null;
    switch (sourceContext.type) {
        case 'feedgen': {
            content = _jsx(FeedHeader, { sourceContext: sourceContext });
            break;
        }
        case 'author':
        // TODO
        default: {
            break;
        }
    }
    return (_jsxs(Layout.Header.Outer, { noBottomBorder: true, children: [_jsx(BackButton, {}), _jsx(Layout.Header.Content, { align: "left", children: content })] }));
}
export function FeedHeader({ sourceContext, }) {
    const { gtMobile } = useBreakpoints();
    const { data: info, isLoading, error, } = useFeedSourceInfoQuery({ uri: sourceContext.uri });
    if (sourceContext.sourceInterstitial !== undefined) {
        // For now, don't show the header if coming from an interstitial.
        return null;
    }
    if (isLoading) {
        return _jsx(HeaderPlaceholder, {});
    }
    else if (error || !info) {
        return null;
    }
    return (_jsxs(View, { style: [a.flex_1, a.flex_row, a.align_center, a.gap_sm], children: [info.avatar && _jsx(UserAvatar, { size: 36, type: "algo", avatar: info.avatar }), _jsxs(View, { style: [a.flex_1], children: [_jsx(Text, { style: [
                            a.text_md,
                            a.font_heavy,
                            a.leading_tight,
                            gtMobile && a.text_lg,
                        ], numberOfLines: 2, children: info.displayName }), _jsx(View, { style: [a.flex_row, { gap: 6 }], children: _jsx(Text, { style: [a.flex_shrink, a.text_sm, a.leading_snug], numberOfLines: 1, children: sanitizeHandle(info.creatorHandle, '@') }) })] })] }));
}
// TODO: This customization should be a part of the layout component
export function BackButton({ onPress, style, ...props }) {
    const { _ } = useLingui();
    const navigation = useNavigation();
    const onPressBack = useCallback((evt) => {
        onPress?.(evt);
        if (evt.defaultPrevented)
            return;
        if (navigation.canGoBack()) {
            navigation.goBack();
        }
        else {
            navigation.navigate('Home');
        }
    }, [onPress, navigation]);
    return (_jsx(Layout.Header.Slot, { children: _jsx(Button, { label: _(msg `Go back`), size: "small", variant: "ghost", color: "secondary", shape: "round", onPress: onPressBack, hitSlop: HITSLOP_30, style: [
                { marginLeft: -BUTTON_VISUAL_ALIGNMENT_OFFSET },
                a.bg_transparent,
                style,
            ], ...props, children: _jsx(ArrowLeft, { size: "lg", fill: "white" }) }) }));
}
//# sourceMappingURL=Header.js.map