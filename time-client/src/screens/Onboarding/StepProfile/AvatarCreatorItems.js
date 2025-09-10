import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { View } from 'react-native';
import { msg, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {} from '#/screens/Onboarding/StepProfile/index';
import { avatarColors, emojiItems, emojiNames, } from '#/screens/Onboarding/StepProfile/types';
import { atoms as a, useTheme } from '#/alf';
import { Button, ButtonIcon } from '#/components/Button';
import { Text } from '#/components/Typography';
const ACTIVE_BORDER_WIDTH = 3;
const ACTIVE_BORDER_STYLES = {
    top: -ACTIVE_BORDER_WIDTH,
    bottom: -ACTIVE_BORDER_WIDTH,
    left: -ACTIVE_BORDER_WIDTH,
    right: -ACTIVE_BORDER_WIDTH,
    opacity: 0.5,
    borderWidth: 3,
};
export function AvatarCreatorItems({ type, avatar, setAvatar, }) {
    const { _ } = useLingui();
    const t = useTheme();
    const isEmojis = type === 'emojis';
    const onSelectEmoji = React.useCallback((emoji) => {
        setAvatar(prev => ({
            ...prev,
            placeholder: emojiItems[emoji],
        }));
    }, [setAvatar]);
    const onSelectColor = React.useCallback((color) => {
        setAvatar(prev => ({
            ...prev,
            backgroundColor: color,
        }));
    }, [setAvatar]);
    return (_jsxs(View, { style: [a.w_full], children: [_jsx(Text, { style: [a.pb_md, t.atoms.text_contrast_medium], children: isEmojis ? (_jsx(Trans, { children: "Select an emoji" })) : (_jsx(Trans, { children: "Select a color" })) }), _jsx(View, { style: [
                    a.flex_row,
                    a.align_start,
                    a.justify_start,
                    a.flex_wrap,
                    a.gap_md,
                ], children: isEmojis
                    ? emojiNames.map(emojiName => (_jsxs(Button, { label: _(msg `Select the ${emojiName} emoji as your avatar`), size: "small", shape: "round", variant: "solid", color: "secondary", onPress: () => onSelectEmoji(emojiName), children: [_jsx(ButtonIcon, { icon: emojiItems[emojiName].component }), avatar.placeholder.name === emojiName && (_jsx(View, { style: [
                                    a.absolute,
                                    a.rounded_full,
                                    ACTIVE_BORDER_STYLES,
                                    {
                                        borderColor: avatar.backgroundColor,
                                    },
                                ] }))] }, emojiName)))
                    : avatarColors.map(color => (_jsx(Button, { label: _(msg `Choose this color as your avatar`), size: "small", shape: "round", variant: "solid", onPress: () => onSelectColor(color), children: ctx => (_jsxs(_Fragment, { children: [_jsx(View, { style: [
                                        a.absolute,
                                        a.inset_0,
                                        a.rounded_full,
                                        {
                                            opacity: ctx.hovered || ctx.pressed ? 0.8 : 1,
                                            backgroundColor: color,
                                        },
                                    ] }), avatar.backgroundColor === color && (_jsx(View, { style: [
                                        a.absolute,
                                        a.rounded_full,
                                        ACTIVE_BORDER_STYLES,
                                        {
                                            borderColor: color,
                                        },
                                    ] }))] })) }, color))) })] }));
}
//# sourceMappingURL=AvatarCreatorItems.js.map