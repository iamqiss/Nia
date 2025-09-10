import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import {} from '@atproto/api';
import EmojiPicker from '@emoji-mart/react';
import { msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { DropdownMenu } from 'radix-ui';
import { useSession } from '#/state/session';
import {} from '#/view/com/composer/text-input/web/EmojiPicker';
import { useWebPreloadEmoji } from '#/view/com/composer/text-input/web/useWebPreloadEmoji';
import { atoms as a, flatten, useTheme } from '#/alf';
import { DotGrid_Stroke2_Corner0_Rounded as DotGridIcon } from '#/components/icons/DotGrid';
import * as Menu from '#/components/Menu';
import {} from '#/components/Menu/types';
import { Text } from '#/components/Typography';
import { hasAlreadyReacted, hasReachedReactionLimit } from './util';
export function EmojiReactionPicker({ message, children, onEmojiSelect, }) {
    if (!children)
        throw new Error('EmojiReactionPicker requires the children prop on web');
    const { _ } = useLingui();
    return (_jsxs(Menu.Root, { children: [_jsx(Menu.Trigger, { label: _(msg `Add emoji reaction`), children: children }), _jsx(MenuInner, { message: message, onEmojiSelect: onEmojiSelect })] }));
}
function MenuInner({ message, onEmojiSelect, }) {
    const t = useTheme();
    const { control } = Menu.useMenuContext();
    const { currentAccount } = useSession();
    useWebPreloadEmoji({ immediate: true });
    const [expanded, setExpanded] = useState(false);
    const [prevOpen, setPrevOpen] = useState(control.isOpen);
    if (control.isOpen !== prevOpen) {
        setPrevOpen(control.isOpen);
        if (!control.isOpen) {
            setExpanded(false);
        }
    }
    const handleEmojiPickerResponse = (emoji) => {
        handleEmojiSelect(emoji.native);
    };
    const handleEmojiSelect = (emoji) => {
        control.close();
        onEmojiSelect(emoji);
    };
    const limitReacted = hasReachedReactionLimit(message, currentAccount?.did);
    return expanded ? (_jsx(DropdownMenu.Portal, { children: _jsx(DropdownMenu.Content, { sideOffset: 5, collisionPadding: { left: 5, right: 5, bottom: 5 }, children: _jsx("div", { onWheel: evt => evt.stopPropagation(), children: _jsx(EmojiPicker, { onEmojiSelect: handleEmojiPickerResponse, autoFocus: true }) }) }) })) : (_jsx(Menu.Outer, { style: [a.rounded_full], children: _jsxs(View, { style: [a.flex_row, a.gap_xs], children: [['👍', '😆', '❤️', '👀', '😢'].map(emoji => {
                    const alreadyReacted = hasAlreadyReacted(message, currentAccount?.did, emoji);
                    return (_jsx(DropdownMenu.Item, { className: [
                            'EmojiReactionPicker__Pressable',
                            alreadyReacted && '__selected',
                            limitReacted && '__disabled',
                        ]
                            .filter(Boolean)
                            .join(' '), onSelect: () => handleEmojiSelect(emoji), style: flatten([
                            a.flex,
                            a.flex_col,
                            a.rounded_full,
                            a.justify_center,
                            a.align_center,
                            a.transition_transform,
                            {
                                width: 34,
                                height: 34,
                            },
                            alreadyReacted && {
                                backgroundColor: t.atoms.bg_contrast_100.backgroundColor,
                            },
                        ]), children: _jsx(Text, { style: [a.text_center, { fontSize: 28 }], emoji: true, children: emoji }) }, emoji));
                }), _jsx(DropdownMenu.Item, { asChild: true, className: "EmojiReactionPicker__PickerButton", children: _jsx(Pressable, { accessibilityRole: "button", role: "button", onPress: () => setExpanded(true), style: flatten([
                            a.rounded_full,
                            { height: 34, width: 34 },
                            a.justify_center,
                            a.align_center,
                        ]), children: _jsx(DotGridIcon, { size: "lg", style: t.atoms.text_contrast_medium }) }) })] }) }));
}
//# sourceMappingURL=EmojiReactionPicker.web.js.map