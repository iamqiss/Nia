import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { DismissableLayer, FocusGuards, FocusScope } from 'radix-ui/internal';
import { RemoveScrollBar } from 'react-remove-scroll-bar';
import { useA11y } from '#/state/a11y';
import { useModals } from '#/state/modals';
import { useComposerState } from '#/state/shell/composer';
import { EmojiPicker, } from '#/view/com/composer/text-input/web/EmojiPicker';
import { atoms as a, flatten, useBreakpoints, useTheme } from '#/alf';
import { ComposePost, useComposerCancelRef } from '../com/composer/Composer';
const BOTTOM_BAR_HEIGHT = 61;
export function Composer({}) {
    const state = useComposerState();
    const isActive = !!state;
    // rendering
    // =
    if (!isActive) {
        return null;
    }
    return (_jsxs(_Fragment, { children: [_jsx(RemoveScrollBar, {}), _jsx(Inner, { state: state })] }));
}
function Inner({ state }) {
    const ref = useComposerCancelRef();
    const { isModalActive } = useModals();
    const t = useTheme();
    const { gtMobile } = useBreakpoints();
    const { reduceMotionEnabled } = useA11y();
    const [pickerState, setPickerState] = React.useState({
        isOpen: false,
        pos: { top: 0, left: 0, right: 0, bottom: 0, nextFocusRef: null },
    });
    const onOpenPicker = React.useCallback((pos) => {
        if (!pos)
            return;
        setPickerState({
            isOpen: true,
            pos,
        });
    }, []);
    const onClosePicker = React.useCallback(() => {
        setPickerState(prev => ({
            ...prev,
            isOpen: false,
        }));
    }, []);
    FocusGuards.useFocusGuards();
    return (_jsx(FocusScope.FocusScope, { loop: true, trapped: true, asChild: true, children: _jsxs(DismissableLayer.DismissableLayer, { role: "dialog", "aria-modal": true, style: flatten([
                { position: 'fixed' },
                a.inset_0,
                { backgroundColor: '#000c' },
                a.flex,
                a.flex_col,
                a.align_center,
                !reduceMotionEnabled && a.fade_in,
            ]), onFocusOutside: evt => evt.preventDefault(), onInteractOutside: evt => evt.preventDefault(), onDismiss: () => {
                // TEMP: remove when all modals are ALF'd -sfn
                if (!isModalActive) {
                    ref.current?.onPressCancel();
                }
            }, children: [_jsx(View, { style: [
                        styles.container,
                        !gtMobile && styles.containerMobile,
                        t.atoms.bg,
                        t.atoms.border_contrast_medium,
                        !reduceMotionEnabled && [
                            a.zoom_fade_in,
                            { animationDelay: 0.1 },
                            { animationFillMode: 'backwards' },
                        ],
                    ], children: _jsx(ComposePost, { cancelRef: ref, replyTo: state.replyTo, quote: state.quote, onPost: state.onPost, onPostSuccess: state.onPostSuccess, mention: state.mention, openEmojiPicker: onOpenPicker, text: state.text, imageUris: state.imageUris }) }), _jsx(EmojiPicker, { state: pickerState, close: onClosePicker })] }) }));
}
const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        maxWidth: 600,
        width: '100%',
        paddingVertical: 0,
        borderRadius: 8,
        marginBottom: 0,
        borderWidth: 1,
        // @ts-expect-error web only
        maxHeight: 'calc(100% - (40px * 2))',
        overflow: 'hidden',
    },
    containerMobile: {
        borderRadius: 0,
        marginBottom: BOTTOM_BAR_HEIGHT,
        // @ts-expect-error web only
        maxHeight: `calc(100% - ${BOTTOM_BAR_HEIGHT}px)`,
    },
});
//# sourceMappingURL=Composer.web.js.map