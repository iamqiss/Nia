import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Pressable, View } from 'react-native';
import {} from '@atproto/api';
import { Trans } from '@lingui/macro';
import { ReactRenderer } from '@tiptap/react';
import {} from '@tiptap/suggestion';
import tippy, {} from 'tippy.js';
import { useModerationOpts } from '#/state/preferences/moderation-opts';
import {} from '#/state/queries/actor-autocomplete';
import { atoms as a, useTheme } from '#/alf';
import * as ProfileCard from '#/components/ProfileCard';
import { Text } from '#/components/Typography';
export function createSuggestion({ autocomplete, autocompleteRef, }) {
    return {
        async items({ query }) {
            const suggestions = await autocomplete({ query });
            return suggestions.slice(0, 8);
        },
        render: () => {
            let component;
            let popup;
            const hide = () => {
                popup?.[0]?.destroy();
                component?.destroy();
            };
            return {
                onStart: props => {
                    component = new ReactRenderer(MentionList, {
                        props: { ...props, autocompleteRef, hide },
                        editor: props.editor,
                    });
                    if (!props.clientRect) {
                        return;
                    }
                    // @ts-ignore getReferenceClientRect doesnt like that clientRect can return null -prf
                    popup = tippy('body', {
                        getReferenceClientRect: props.clientRect,
                        appendTo: () => document.body,
                        content: component.element,
                        showOnCreate: true,
                        interactive: true,
                        trigger: 'manual',
                        placement: 'bottom-start',
                    });
                },
                onUpdate(props) {
                    component?.updateProps(props);
                    if (!props.clientRect) {
                        return;
                    }
                    popup?.[0]?.setProps({
                        // @ts-ignore getReferenceClientRect doesnt like that clientRect can return null -prf
                        getReferenceClientRect: props.clientRect,
                    });
                },
                onKeyDown(props) {
                    if (props.event.key === 'Escape') {
                        return false;
                    }
                    return component?.ref?.onKeyDown(props) || false;
                },
                onExit() {
                    hide();
                },
            };
        },
    };
}
const MentionList = forwardRef(function MentionListImpl({ items, command, hide, autocompleteRef }, ref) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const t = useTheme();
    const moderationOpts = useModerationOpts();
    const selectItem = (index) => {
        const item = items[index];
        if (item) {
            command({ id: item.handle });
        }
    };
    const upHandler = () => {
        setSelectedIndex((selectedIndex + items.length - 1) % items.length);
    };
    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % items.length);
    };
    const enterHandler = () => {
        selectItem(selectedIndex);
    };
    useEffect(() => setSelectedIndex(0), [items]);
    useImperativeHandle(autocompleteRef, () => ({
        maybeClose: () => {
            hide();
            return true;
        },
    }));
    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }
            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }
            if (event.key === 'Enter' || event.key === 'Tab') {
                enterHandler();
                return true;
            }
            return false;
        },
    }));
    if (!moderationOpts)
        return null;
    return (_jsx("div", { className: "items", children: _jsx(View, { style: [
                t.atoms.border_contrast_low,
                t.atoms.bg,
                a.rounded_sm,
                a.border,
                a.p_xs,
                { width: 300 },
            ], children: items.length > 0 ? (items.map((item, index) => {
                const isSelected = selectedIndex === index;
                return (_jsx(AutocompleteProfileCard, { profile: item, isSelected: isSelected, onPress: () => selectItem(index), onHover: () => setSelectedIndex(index), moderationOpts: moderationOpts }, item.handle));
            })) : (_jsx(Text, { style: [a.text_sm, a.px_md, a.py_md], children: _jsx(Trans, { children: "No result" }) })) }) }));
});
function AutocompleteProfileCard({ profile, isSelected, onPress, onHover, moderationOpts, }) {
    const t = useTheme();
    return (_jsx(Pressable, { style: [
            isSelected && t.atoms.bg_contrast_25,
            a.align_center,
            a.justify_between,
            a.flex_row,
            a.px_md,
            a.py_sm,
            a.gap_2xl,
            a.rounded_xs,
            a.transition_color,
        ], onPress: onPress, onPointerEnter: onHover, accessibilityRole: "button", children: _jsx(View, { style: [a.flex_1], children: _jsxs(ProfileCard.Header, { children: [_jsx(ProfileCard.Avatar, { profile: profile, moderationOpts: moderationOpts, disabledPreview: true }), _jsx(ProfileCard.NameAndHandle, { profile: profile, moderationOpts: moderationOpts })] }) }) }));
}
//# sourceMappingURL=Autocomplete.js.map